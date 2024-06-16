'use client';

import useConversationId from '@/hooks/useConversationId';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useDashboardContext } from '@/layout/context/DashboardContext';
import { useSocket } from '@/layout/context/SocketContext';
import { ConversationType } from '@/types';
import { find } from 'lodash';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React, { useEffect, useMemo, useState } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';
import NewConversation from './NewConversation';

interface ConversationListProps {
    title?: string;
}

const ConversationList: React.FC<ConversationListProps> = () => {
    const { conversations: initialConversations } = useDashboardContext();
    const [items, setItems] = useState(initialConversations);
    const { bindConversationUpdateForUser, bindNewConversation, bindDeleteConversation, removeBinding } = useSocket();
    const [displayNewConversation, setDisplayNewConversation] = useState(false);
    const router = useRouter();
    const currentUser = useCurrentUser();
    const conversationId = useConversationId(true);
    const conversations = useMemo(() => {
        return items.sort(function (a, b) {
            if (a.lastMessageAt > b.lastMessageAt) return -1;
            if (a.lastMessageAt < b.lastMessageAt) return 1;
            return 0;
        });
    }, [items]);

    useEffect(() => {
        const updateHandler = (conversation: ConversationType) => {
            setItems((current) =>
                current.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return conversation;
                    }
                    return currentConversation;
                })
            );
        };

        const newConversationHandler = (conversation: ConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }

                return [conversation, ...current];
            });
        };

        const removeHandler = (conversation: ConversationType) => {
            setItems((current) => {
                return [...current.filter((conv) => conv.id !== conversation.id)];
            });
        };

        const updateBinding = bindConversationUpdateForUser(currentUser.id, updateHandler);
        const newBinding = bindNewConversation(currentUser.id, newConversationHandler);
        const deleteBinding = bindDeleteConversation(currentUser.id, removeHandler);

        return () => {
            removeBinding(updateBinding);
            removeBinding(newBinding);
            removeBinding(deleteBinding);
        };
    }, [currentUser.id, router, bindConversationUpdateForUser, bindNewConversation, bindDeleteConversation, removeBinding]);

    const newConversationCallback = (conversation: ConversationType) => {
        setItems((current) => {
            if (find(current, { id: conversation.id })) {
                return current;
            }

            return [conversation, ...current];
        });
        router.push(`/dashboard/conversation/${conversation.id}`);
    };

    return (
        <div>
            <NewConversation
                id="newConversation"
                display={displayNewConversation}
                setDisplay={setDisplayNewConversation}
                callback={newConversationCallback}
            />
            <div className="flex justify-between ml-3 mb-1">
                <div className="text-2xl font-bold mr-3">Messages</div>
                <Button icon={<MdOutlineGroupAdd size={20} />} text onClick={() => setDisplayNewConversation(true)} />
            </div>
            <Flipper flipKey={conversations.map((item) => item.id).join('')}>
                <ul className="list-none p-0">
                    {conversations.map((item) => (
                        <Flipped key={item.id} flipId={item.id}>
                            <li>
                                <ConversationBox conversation={item} selected={conversationId === item.id} />
                            </li>
                        </Flipped>
                    ))}
                </ul>
            </Flipper>
        </div>
    );
};

export default ConversationList;
