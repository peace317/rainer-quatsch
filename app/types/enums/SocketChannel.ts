/**
 * Channel id's for socket communication.
 */
export enum SocketChannel {
  // Reserved words by socket.io. Do not use for sending messages!
  CONNECT = 'connect',
  CONNECT_ERROR = 'connect_error',
  DISCONNECT = 'disconnect',
  DISCONNECTING = 'disconnecting',
  NEW_LISTENER = 'newListener',
  REMOVE_LISTENER = 'removeListener',
  // ---------------- Custom events -------------------
  USER_CONNECT = 'USER_CONNECT',
  USER_DISCONNECT = 'USER_DISCONNECT',
  NEW_MESSAGE = 'NEW_MESSAGE',
  UPDATE_MESSAGE = 'UPDATE_MESSAGE',
  NEW_CONVERSATION = 'NEW_CONVERSATION',
  UPDATE_CONVERSATION = 'UPDATE_CONVERSATION',
  DELETE_CONVERSATION = 'DELETE_CONVERSATION',
  UPDATE_USER = 'UPDATE_USER',
  ANSWER_CALL = 'ANSWER_CALL',
  CALL_USER = 'CALL_USER',
  JOIN_CALL = 'JOIN_CALL',
}

const SEP = ":";

/**
 * Channel key a new covnersation.
 * 
 * @param id id of the user, to which the new conversation is send
 * @returns channel key
 */
export function getNewConversationKey(userId: string | undefined) {
  return SocketChannel.NEW_CONVERSATION + SEP + userId; 
}

/**
 * Channel key for the update of a conversation.
 * 
 * @param id conversation id or user id
 * @returns channel key
 */
export function getUpdateConversationKey(id: string) {
  return SocketChannel.UPDATE_CONVERSATION + SEP + id; 
}

/**
 * Channel key for the deletion of a conversation.
 * 
 * @param id user id
 * @returns channel key
 */
export function getDeleteConversationKey(id: string) {
  return SocketChannel.DELETE_CONVERSATION + SEP + id; 
}

/**
 * Channel key for a new message.
 * 
 * @param id covnersation id, to which the message is send
 * @returns channel key
 */
export function getNewMessageKey(conversationId: string) {
  return SocketChannel.NEW_MESSAGE + SEP + conversationId; 
}

/**
 * Channel key for an updated message.
 * @param conversationId covnersation id
 * @returns channel key
 */
export function getUpdateMessageKey(conversationId: string) {
  return SocketChannel.UPDATE_MESSAGE + SEP + conversationId; 
}

/**
 * Channel key for the update of a foreign user.
 * 
 * @param id id of the foreign user
 * @returns channel key
 */
export function getUpdateUserKey(userId: string) {
  return SocketChannel.UPDATE_USER + SEP + userId; 
}

export function getCallUserKey(userId: string) {
  return SocketChannel.CALL_USER + SEP + userId; 
}

export function getAnswerCallKey(userId: string) {
  return SocketChannel.ANSWER_CALL + SEP + userId; 
}

export function getJoinCallKey(userId: string) {
  return SocketChannel.JOIN_CALL + SEP + userId; 
}
