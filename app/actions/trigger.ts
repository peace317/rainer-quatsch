'use server';

import {
    ConversationType,
    getCallUserKey,
    getDeleteConversationKey,
    getNewConversationKey,
    getNewMessageKey,
    getUpdateConversationKey,
    getUpdateMessageKey,
    getUpdateUserKey
} from '@/types';
import { Conversation, Message, User } from '@prisma/client';
import socketIO from '@/libs/socket';

export interface SocketPackage {
    eventKey: string;
    data: unknown;
}

const packageData = (id: string, data: unknown): SocketPackage => {
    return {
        eventKey: id,
        data
    };
};

export const emitConversationUpdate = (conversationId: string, updatedConversation: ConversationType): void => {
    try {
        socketIO.emit(process.env.WEBSOCKET_TOKEN, packageData(getUpdateConversationKey(conversationId), updatedConversation));
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

/**
 * Sends an update of an conversation to an specific user.
 * 
 * @param userId id of the user that should receive the update
 * @param updatedConversation 
 */
export const emitConversationUpdateForUser = (userId: string, updatedConversation: Conversation): void => {
    try {
        socketIO.emit(process.env.WEBSOCKET_TOKEN, packageData(getUpdateConversationKey(userId), updatedConversation));
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

/**
 * Sends a new conversation to a specific user.
 * 
 * @param userId id of the user that should receive the new conversation
 * @param newConversation 
 */
export const emitNewConversation = (userId: string, newConversation: Conversation): void => {
    try {
        socketIO.emit(process.env.WEBSOCKET_TOKEN, packageData(getNewConversationKey(userId), newConversation));
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

/**
 * Sends a deleted conversation to a specific user.
 * 
 * @param userId id of the user that should receive the update
 * @param deletedConversation 
 */
export const emitDeleteConversation = (userId: string, deletedConversation: Conversation): void => {
    try {
        socketIO.emit(process.env.WEBSOCKET_TOKEN, packageData(getDeleteConversationKey(userId), deletedConversation));
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

/**
 * Sends a new message to a conversation.
 * 
 * @param conversationId 
 * @param newMessage 
 */
export const emitNewMessage = (conversationId: string, newMessage: Message): void => {
    try {
        const data = packageData(getNewMessageKey(conversationId), newMessage);
        socketIO.emit(process.env.WEBSOCKET_TOKEN, data);
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

/**
 * Sends an update of a message to a conversation.
 * 
 * @param conversationId 
 * @param message 
 */
export const emitMessageUpdate = (conversationId: string, message: Message): void => {
    try {
        socketIO.emit(process.env.WEBSOCKET_TOKEN, packageData(getUpdateMessageKey(conversationId), message));
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

/**
 * Sends an update of an user to a specific user.
 * 
 * @param userId id of the user that should receive the updated user
 * @param updatedUser 
 */
export const emitUserUpdate = (userId: string, updatedUser: User): void => {
    try {
        socketIO.emit(process.env.WEBSOCKET_TOKEN, packageData(getUpdateUserKey(userId), updatedUser));
    } catch (error: unknown) {
        console.error('WEBSOCKET_ERROR', error);
    }
};

