'use client';

import Avatar from '@/components/user/Avatar';
import Truncate from '@/components/util/Truncate';
import useOtherUser from '@/hooks/useOtherUser';
import { clsx } from 'clsx';
import { format, isToday } from 'date-fns';
import parse from 'html-react-parser';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { useLoading } from '@/layout/context/LoadingContext';
import { ConversationType } from '@/types';
import { isGroup } from '@/util/conversation';
import useCurrentUser from '@/hooks/useCurrentUser';

interface ConversationBoxProps {
    conversation: ConversationType;
    selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
    const otherUser = useOtherUser(conversation);
    const currentUser = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();
    const { setLoading } = useLoading();

    const handleClick = useCallback(() => {
        setLoading(true);
        if (pathname === `/dashboard/conversation/${conversation.id}`) {
            window.location.reload();
        } else {
            router.push(`/dashboard/conversation/${conversation.id}`);
        }
    }, [conversation, router, pathname, setLoading]);

    const lastMessage = useMemo(() => {
        const messages = conversation.messages || [];
        return messages[messages.length - 1];
    }, [conversation.messages]);

    const lastMessageTime = useMemo(() => {
        if (lastMessage) {
            if (isToday(lastMessage.createdAt)) return format(new Date(lastMessage.createdAt), 'HH:mm');
            return format(new Date(lastMessage.createdAt), 'dd.MM.yyyy');
        }
    }, [lastMessage]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return true;
        }

        const seenArray = lastMessage.seen || [];

        return seenArray.filter((user) => user.id === currentUser.id).length !== 0;
    }, [currentUser.id, lastMessage]);

    const lastMessageText = useMemo(() => {
        /* if (lastMessage?.archive.length > 0) {
             return 'Sent an image';
         }*/

        if (lastMessage?.body) {
            return lastMessage?.body;
        }

        return 'Started a conversation';
    }, [lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={clsx(
                `
                    card
                    w-full
                    flex 
                    align-items-center
                    mb-2
                    p-3
                    cursor-pointer`,
                selected ? 'conversation-item-selected' : 'conversation-item'
            )}>
            <Avatar
                user={isGroup(conversation) ? undefined : otherUser}
                label={isGroup(conversation) ? '+' + conversation.users?.length : otherUser?.displayName.charAt(0)}
            />
            <div className="min-w-0 pl-3 pt-2 min-w-0 flex-1">
                <div className="outline-none overflow-hidden" style={{ maxHeight: '50px' }}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex justify-content-between align-items-center mb-1">
                        <p className="text-md font-medium mb-0 conversation-item-header">{conversation.name || otherUser?.displayName}</p>
                        {lastMessage?.createdAt && (
                            <p
                                className="mt-1
                                           text-xs 
                                           font-light
                                           conversation-item-last-msg-date 
                                            ">
                                {lastMessageTime}
                            </p>
                        )}
                    </div>
                    <div
                        className={clsx(
                            `
                              text-sm
                              m-0
                              message-text
                                `,
                            hasSeen ? 'conversation-item-message-seen' : 'conversation-item-message'
                        )}>
                        <Truncate lines={1} trimWhitespace={true}>
                            {parse(lastMessageText)}
                        </Truncate>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationBox;
