import prisma from "@/libs/prismadb";
import { ConversationType } from "@/types";

export const readConversation = async (conversationId: string): Promise<ConversationType | null> => {

   return await prisma.conversation.findUnique({
        where: {
          id: conversationId
        },
        include: {
          users: true,
          archives: {
            include: {
              uploader: true
            }
          }
        },
      });
};
