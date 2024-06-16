import getCurrentUser from '@/actions/getCurrentUser';
import { emitNewConversation } from '@/actions/trigger';
import prisma from '@/libs/prismadb';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { members, name } = body;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!members || members.length < 1 || !name) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        const newConversation = await prisma.conversation.create({
            data: {
                name,
                users: {
                    connect: [
                        ...members.map((member: User) => ({
                            id: member.id
                        })),
                        {
                            id: currentUser.id
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        });

        // Update all connections with new conversation
        newConversation.users.map((user) => {
            emitNewConversation(user.id, newConversation);
        });

        return NextResponse.json(newConversation, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
