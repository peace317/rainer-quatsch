'use client';
import MessageBox from '@/components/message/MessageBox';
import useConversationId from '@/hooks/useConversationId';
import { useSocket } from '@/layout/context/SocketContext';
import { MessageType } from '@/types';
import { apiUrl } from '@/util/js-helper';
import { Message, User } from '@prisma/client';
import axios from 'axios';
import clsx from 'clsx';
import { find } from 'lodash';
import { ScrollPanel } from 'primereact/scrollpanel';
import React, { useEffect, useRef, useState } from 'react';

interface BodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const Body: React.FC<BodyProps> = ({ ...props }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const conversationId = useConversationId();
    const [messages, setMessages] = useState<Array<MessageType>>([]);
    const { bindNewMessage, bindMessageUpdate, removeBinding } = useSocket();
    const container = clsx('mb-2 messageBody', props.className);

    const scrollDown = () => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    };

    useEffect(() => {
        axios.get(apiUrl('messages', conversationId)).then((response) => {
            setMessages(response.data);
        });
    }, [conversationId]);

    useEffect(() => {
        if (messages.length) {
            scrollDown();
        }
    }, [messages.length]);

    useEffect(() => {
        axios.post(apiUrl('message-seen',conversationId));
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView();

        const messageHandler = (message: MessageType) => {
            axios.post(apiUrl('message-seen',conversationId));
            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                return [...current, message];
            });
            bottomRef.current?.scrollIntoView();
        };

        const updateMessageHandler = (newMessage: MessageType) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }

                    return currentMessage;
                })
            );
            bottomRef.current?.scrollIntoView();
        };

        const msgUpdateBinding = bindMessageUpdate(conversationId, updateMessageHandler);
        const newMsgBinding = bindNewMessage(conversationId, messageHandler);

        return () => {
            removeBinding(newMsgBinding);
            removeBinding(msgUpdateBinding);
        };
    }, [conversationId, bindNewMessage, bindMessageUpdate, removeBinding]);

    // className='flex justify-content-center'
    return (
        <div className={container} {...props}>
            <ScrollPanel>
                {messages.map((message, i) => (
                    <MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />
                ))}
                <div ref={bottomRef} />
            </ScrollPanel>
        </div>
    );
};

export default Body;
