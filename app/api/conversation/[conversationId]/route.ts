import getCurrentUser from '@/actions/getCurrentUser';
import { emitDeleteConversation, emitNewConversation } from '@/actions/trigger';
import prisma from '@/libs/prismadb';
import { readConversation } from '@/services/ConversationService';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';

interface IParams {
    conversationId?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const conversationId = params.conversationId;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse('No conversation id provided.', { status: 400 });
        }

        const conversation = await readConversation(conversationId);

        if (!conversation) {
            return new NextResponse('No conversation found for id.', { status: 400 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const conversationId = params.conversationId;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse('No conversation id provided.', { status: 400 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId as string
            },
            include: {
                users: true
            }
        });
        
        if (!existingConversation) {
            return new NextResponse('No conversation found for id.', { status: 400 });
        }
    
        const remainingUsers = existingConversation.users.filter((user) => user.id !== currentUser.id);
    
        if (remainingUsers.length > 0) {
            console.log("Remove User", currentUser, "from conversation", conversationId);
            await prisma.conversation.update({
                where: {
                    id: conversationId as string
                },
                data: {
                    userIds: {
                        set: remainingUsers.map((user) => user.id)
                    }
                }
            });
        }
    
        const remainingConversations = currentUser.conversationIds.filter((conv) => conv !== conversationId);
    
        await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                conversationIds: {
                    set: remainingConversations
                }
            }
        });
    
        existingConversation.users.forEach((user) => {
            emitDeleteConversation(user.id, existingConversation)
        });
    
        return new NextResponse('success', { status: 200 })
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
