import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { User } from '@prisma/client';
import prisma from './prismadb';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: 'username', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {

                if (!credentials?.username) {
                    throw new Error('Invalid credentials, no username');
                }

                if (!credentials?.password) {
                    throw new Error('Invalid credentials, no password');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username
                    }
                });

                if (!user) {
                    throw new Error('User not found!');
                }

                if (user.userRole == 'GUEST') {
                    throw new Error('Guest have no rights to login!');
                }
                /*
                const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }*/

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
    session: {
        strategy: 'jwt',
        // Seconds until an idle session expires
        maxAge: parseInt(process.env.SESSION_MAX_AGE, 10),
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        verifyRequest: '/login',
        newUser: '/register',
        error: '/login'
    },
    callbacks: {
        async signIn({ user }) {
            const _user = user as User;
            if (_user.userRole === 'GUEST') return false;
            return true;
        },
        async session({ session, token }) {
            if (token) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: token.userId
                    }
                });
                session.user = user;
            }
            return Promise.resolve(session);
        },
        async jwt({ token, user }) {
            if (user) {
                const _user = user as User;
                token.userId = _user.id;
                token.name = _user.username;
            }
            return Promise.resolve(token);
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
