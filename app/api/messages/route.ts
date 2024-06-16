import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import getCurrentUser from '@/actions/getCurrentUser';
import { emitConversationUpdateForUser, emitNewMessage } from '@/actions/trigger';

interface IParams {
    conversationId?: string;
}

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { message, conversationId } = body;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!message) {
            return new NextResponse('Empty message.', { status: 400 });
        }

        const newMessage = await prisma.message.create({
            include: {
                seen: true,
                sender: true
            },
            data: {
                body: message,
                conversation: {
                    connect: { id: conversationId }
                },
                sender: {
                    connect: { id: currentUser.id }
                },
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        emitNewMessage(conversationId, newMessage);

        updatedConversation.users.map((user) => {
            emitConversationUpdateForUser(user.id, updatedConversation);
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
