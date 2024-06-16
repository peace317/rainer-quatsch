'use client';
import { ConversationType } from '@/types';
import { ReactNode, createContext, useContext, useState } from 'react';

export type ConversationProps = {
    conversation?: ConversationType | null;
    children?: ReactNode;
};

interface ConversationContextProps {
    conversation: ConversationType;
}

export const ConversationContext = createContext({} as ConversationContextProps);

export const useConversation = () => {
    return useContext(ConversationContext).conversation;
};

export const ConversationProvider = ({ children, conversation: initConversation }: ConversationProps) => {
    const [conversation, setConversation] = useState(initConversation);

    if (!conversation) {
        throw new Error('Conversation undefined');
    }

    const value = {
        conversation: conversation
    };

    return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
};
