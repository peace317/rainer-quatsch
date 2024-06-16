'use client';

import { useConversation } from '@/layout/context/ConversationContext';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook to get the current conversation id from the path params.
 *
 * @param optional boolean that defines, if the retrieved conversation Id can be optional. 
 * If false (undefined), an error will be raised when the conversation id is undefined
 * @returns conversation id
 */
const useConversationId = (optional?: boolean): string => {
    const params = useParams();
    const conversation = useConversation();

    const conversationId = useMemo(() => {
        if (!params?.conversationId) {
            if (!conversation && optional === true) return '';
            if (!conversation) throw new Error('Could not find conversation id in context.');
            return conversation.id;
        }

        return params.conversationId as string;
    }, [params?.conversationId, conversation, optional]);

    return conversationId;
};

export default useConversationId;
