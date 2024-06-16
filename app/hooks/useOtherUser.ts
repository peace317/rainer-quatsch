'use client';

import { useSocket } from '@/layout/context/SocketContext';
import { ConversationType } from '@/types';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

/**
 * Hook to get the first other user out of a conversation. Useful to keep the state of the user in 1-1 conversation.
 * 
 * @param conversation current conversation
 * @returns first other user of the conversation
 */
const useOtherUser = (conversation: ConversationType | undefined) => {
    const session = useSession();
    const { bindUserUpdate, removeBinding } = useSocket();
    const [otherUser, setOtherUser] = useState<User>();

    useEffect(() => {
        const currentUser = session.data?.user;
        
        if (!currentUser) {
            return;
        }
        
        const otherUsers = conversation?.users?.filter((user) => user.id !== currentUser.id);
        if (!otherUsers || otherUsers.length === 0) {
            return;
        }
        const _otherUser = otherUsers[0];
        setOtherUser(_otherUser);
    }, [session.data?.user, conversation?.users]);

    useEffect(() => {
        if (!otherUser?.id) return;

        const updateUserHandler = (user: User) => {
            setOtherUser(user);
        };
        
        const updateBinding = bindUserUpdate(otherUser.id, updateUserHandler)

        return () => {
            removeBinding(updateBinding);
        };
    }, [otherUser?.id, bindUserUpdate, removeBinding]);

    return otherUser;
};

export default useOtherUser;
