import { readConversation } from '@/services/ConversationService';
import { ConversationType } from '@/types';
import { apiUrl, isServer } from '@/util/js-helper';
import axios from 'axios';

const getConversationById = async (conversationId: string) => {
    try {
        let conversation: ConversationType | null;

        if (!conversationId || conversationId === 'null') throw new Error('Conversation id was not provided.');

        if (isServer()) {
            conversation = await readConversation(conversationId);
        } else {
            const response = await axios.get(apiUrl('conversation', conversationId));
            conversation = response.data;
        }
        if (!conversation) throw new Error(`Did not find any conversation for id ${conversationId}`);

        return conversation;
    } catch (error: unknown) {
        console.trace('SERVER_ERROR', 'conversationId:' + conversationId, error);
        return null;
    }
};

export default getConversationById;
