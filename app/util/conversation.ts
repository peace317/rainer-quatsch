import { Conversation } from "@prisma/client";

/**
 * Is a conversation a group chat that contains more than two people.
 * 
 * @param conversation 
 * @returns true, if it is a group
 */
export function isGroup(conversation: Conversation): boolean {
    return conversation.userIds.length > 2;
}