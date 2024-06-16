import getCurrentUser from '@/actions/getCurrentUser';
import { emitConversationUpdateForUser, emitMessageUpdate, emitNewConversation } from '@/actions/trigger';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';

interface IParams {
    conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const conversationId = params.conversationId;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse('No conversation id provided.', { status: 400 });
        }

        // Find existing conversation
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        if (!conversation) {
            return new NextResponse('No conversation found for id.', { status: 400 });
        }

        // Find last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        // if there is no last message yet, nothing todo
        if (!lastMessage) {
            return NextResponse.json(conversation, { status: 200 });
        }

        // If user has already seen the message, no need to go further
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation, { status: 200 });
        }

        // Update seen of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        conversation.messages[conversation.messages.length - 1] = updatedMessage;

        // Update all connections with new seen
        conversation.users.map((user) => {
            emitConversationUpdateForUser(user.id, conversation);
        });

        // Update last message seen
        emitMessageUpdate(conversationId, updatedMessage);

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
