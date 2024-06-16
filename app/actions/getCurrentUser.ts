/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from '@/libs/auth';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import getSession from '@/actions/getSession';
import { getToken } from 'next-auth/jwt';
import prisma from '@/libs/prismadb';

class StatusError extends Error {
    redirect: string | undefined;
}

const getCurrentUser = async (): Promise<User> => {
    try {
        const session = await getSession();
        if (!session?.user) {
            signOut();
            throw new Error('Session unavailable or unknown user.');
        }

        return session.user;
    } catch (error: unknown) {
        console.trace(error);
        throw new Error(error as string);
    }
};

export default getCurrentUser;

export const getCurrentUserServerSide = async (req: NextApiRequest, res: NextApiResponse): Promise<User | null | undefined> => {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (session?.user) return session?.user;

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (token?.userId)
            return await prisma.user.findUnique({
                where: {
                    id: token?.userId
                }
            });

        return undefined;
    } catch (error: unknown) {
        throw new Error(error as string);
    }
};
