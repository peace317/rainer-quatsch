import axios from 'axios';
import prisma from '@/libs/prismadb';
import { MessageType } from '@/types';
import { apiUrl, isServer } from '@/util/js-helper';

const getMessages = async (conversationId: string) => {
    try {
        let messages: MessageType[];
        if (isServer()) {
            messages = await prisma.message.findMany({
                where: {
                    conversationId: conversationId
                },
                include: {
                    sender: true,
                    seen: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
        } else {
          const response = await axios.get(apiUrl("messages", conversationId));
          messages = response.data;
          
        }
        return messages;
    } catch (error: unknown) {
        console.error(error);
        return [];
    }
};

export default getMessages;
