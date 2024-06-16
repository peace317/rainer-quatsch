'use client';

import {
    ConversationType, MessageType,
    getCallUserKey,
    getDeleteConversationKey,
    getNewConversationKey,
    getNewMessageKey,
    getUpdateConversationKey,
    getUpdateMessageKey,
    getUpdateUserKey
} from '@/types';
import { User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | undefined;
    isConnected: boolean;
    bindConversationUpdate: (conversationId: string, callback: (conversation: ConversationType) => void) => SocketBinding;
    bindConversationUpdateForUser: (userId: string, callback: (conversation: ConversationType) => void) => SocketBinding;
    bindNewConversation: (userId: string, callback: (conversation: ConversationType) => void) => SocketBinding;
    bindDeleteConversation: (userId: string, callback: (conversation: ConversationType) => void) => SocketBinding;
    /**
     * Socket binding for a new message that was added to the conversation.
     *
     * @param conversationId conversationId to listen on
     * @param callback callback
     * @returns binding of the event and the callback for removing
     */
    bindNewMessage: (conversationId: string, callback: (newMessage: MessageType) => void) => SocketBinding;
    /**
     * Socket binding for a message update in the conversation.
     *
     * @param conversationId
     * @param callback
     * @returns binding of the event and the callback for removing
     */
    bindMessageUpdate: (conversationId: string, callback: (updatedMessage: MessageType) => void) => SocketBinding;
    bindUserUpdate: (userId: string, callback: (updatedUser: User) => void) => SocketBinding;
    /**
     * Removes a specific binding from the socket listener, that was provided by the call of any bind method. 
     * So if there are many binds for a single method, only one of the listeners get remmoved.
     * 
     * @param binding binding to be removed
     */
    removeBinding: (binding: SocketBinding) => void;
};

export type SocketContextProps = {
    children?: ReactNode;
    /**
     * current user must be provided and can't be obtained by the useCurrentUser hook, because the useCurrentUser hook needs a socket connection
     */
    currentUser: User;
    port: number | string | undefined
    host: string
};

/**
 * Binding Type for socket binding. Every binding instance correlates with the
 * listener for the binding, so by removing a bind with that specific instance only
 * the certain listener gets removed as an listener. If only the event key is used for removing
 * listeners, all listeners for that event key get removed.
 */
export interface SocketBinding {
    eventKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void;
}

export const SocketContext = createContext({} as SocketContextType);

export const useSocket = () => {
    return useContext(SocketContext);
};

/**
 * Context for socket connections.
 *
 * @param param0
 * @returns
 */
export const SocketProvider = ({
    children,
    currentUser,
    port,
    host
}: SocketContextProps) => {
    const t = useTranslations();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const url = `ws://${host}:${port}`;
        const socketInstance = ClientIO(url, {
            transports: ['websocket'],
            withCredentials: true,
            parser: require("socket.io-msgpack-parser")
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
        });

        socketInstance.on('disconnect', (reason, description) => {
            console.log('Disconnected', reason, description);
        });

        socketInstance.on('connect_error', async (err) => {
            console.log(`Websocket error due to ${err.message}`);
            console.log(err);
            socketInstance.close();
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, [currentUser.id, host, port /* sollte eigentlich statisch sein aber sonst meckert lint */ ]);

    const isConnected = useMemo(() => {
        return socket?.connected || false;
    }, [socket?.connected]);

    const bindConversationUpdate = (conversationId: string, callback: (conversation: ConversationType) => void): SocketBinding => {
        const eventKey = getUpdateConversationKey(conversationId);
        socket?.on(eventKey, callback);

        return {
            eventKey,
            callback
        };
    };

    const bindConversationUpdateForUser = (userId: string, callback: (conversation: ConversationType) => void): SocketBinding => {
        const eventKey = getUpdateConversationKey(userId);
        socket?.on(eventKey, callback);

        return {
            eventKey,
            callback
        };
    };

    const bindNewConversation = (userId: string, callback: (conversation: ConversationType) => void): SocketBinding => {
        const eventKey = getNewConversationKey(userId);
        socket?.on(eventKey, callback);
        return {
            eventKey,
            callback
        };
    };

    const bindDeleteConversation = (userId: string, callback: (conversation: ConversationType) => void): SocketBinding => {
        const eventKey = getDeleteConversationKey(userId);
        socket?.on(eventKey, callback);
        return {
            eventKey,
            callback
        };
    };

    const bindNewMessage = (conversationId: string, callback: (newMessage: MessageType) => void): SocketBinding => {
        const eventKey = getNewMessageKey(conversationId);
        socket?.on(eventKey, callback);
        return {
            eventKey,
            callback
        };
    };

    const bindMessageUpdate = (conversationId: string, callback: (updatedMessage: MessageType) => void): SocketBinding => {
        const eventKey = getUpdateMessageKey(conversationId);
        socket?.on(eventKey, callback);
        return {
            eventKey,
            callback
        };
    };

    const bindUserUpdate = (userId: string, callback: (updatedUser: User) => void): SocketBinding => {
        const eventKey = getUpdateUserKey(userId);
        socket?.on(eventKey, callback);
        return {
            eventKey,
            callback
        };
    };
    
    const bindCallUser = (userId: string, callback: (message: MessageType) => void): SocketBinding => {
        const eventKey = getCallUserKey(userId);
        socket?.on(eventKey, callback);
        return {
            eventKey,
            callback
        };
    };

    const removeBinding = (binding: SocketBinding): void => {
        socket?.off(binding.eventKey, binding.callback);
    };

    const value = {
        socket,
        isConnected,
        bindConversationUpdate,
        bindConversationUpdateForUser,
        bindNewConversation,
        bindDeleteConversation,
        bindNewMessage,
        bindMessageUpdate,
        bindUserUpdate,
        bindCallUser,
        removeBinding
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
