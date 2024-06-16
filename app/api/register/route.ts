import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import { genSalt, hashSync } from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, displayName, username, password, userRole } = body;

        if (!userRole) {
            return new NextResponse('No user role defined.', { status: 500 });
        }

        if (userRole !== UserRole.GUEST) {
            if (!email) {
                return new NextResponse('Please provide an email.', { status: 400 });
            }
            if (!username) {
                return new NextResponse('Please provide an username.', { status: 400 });
            }

            const findUser = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });

            if (findUser) {
                return new NextResponse('User already exists.', { status: 400 });
            }
        }

        const salt = await genSalt(Number.parseInt(process.env.ENCRYPTION_SALT));
        const hashedPassword = hashSync(password, salt);

        let user = await prisma.user.create({
            data: {
                email,
                userRole,
                displayName,
                username,
                hashedPassword: hashedPassword
            }
        });

        if (userRole === 'GUEST') {
            user = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    username: user.id
                }
            });
        }

        return NextResponse.json(user);
    } catch (error: unknown) {
        console.log(error, 'REGISTRATION_ERROR');
        return new NextResponse('Internal error.', { status: 500 });
    }
}
