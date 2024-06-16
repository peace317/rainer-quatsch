'use client';

import Avatar from '@/components/user/Avatar';
import useCurrentUser from '@/hooks/useCurrentUser';
import { MessageType } from '@/types';
import { User } from '@prisma/client';
import clsx from 'clsx';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import React, { useMemo } from 'react';

interface MessageBoxProps {
    data: MessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
    const currentUser = useCurrentUser();

    const isOwn = useMemo(() => currentUser.id === data?.sender?.id, [currentUser.id, data?.sender?.id]);

    const seenList = (data.seen || [])
        .filter((user: User) => user.email !== data?.sender?.email)
        .map((user: User) => user.displayName)
        .join(', ');

    const container = clsx('flex gap-3 p-3', isOwn && 'justify-content-end');
    const avatar = clsx(isOwn && 'flex-order-2');
    const body = clsx('flex flex-column gap-2', isOwn && 'align-items-end');
    const message = clsx(
        'text-sm w-fit overflow-hidden message-text',
        isOwn ? 'message-send' : 'message-received',
        'border-round-md py-2 px-3'
        //data.archiveIds.length > 0 ? 'border-round-md p-0' : 'border-round-md py-2 px-3'
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} size="normal" />
            </div>
            <div className={body}>
                <div className="flex align-items-center gap-2 mt-1">
                    <div style={{ color: 'var(--text-color)' }} className="text-sm">
                        {data.sender.displayName}
                    </div>
                    <div style={{ color: 'var(--text-color)', marginTop: '2px' }} className="text-xs font-light">
                        {format(new Date(data.createdAt), 'HH:mm')}
                    </div>
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div
                        id="seenBy"
                        className="text-xs 
                            font-light 
                            message-seen-by">
                        {`Seen by ${seenList}`}
                    </div>
                )}
                <div className={message}>
                    <div>{parse(data.body || '')}</div>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
