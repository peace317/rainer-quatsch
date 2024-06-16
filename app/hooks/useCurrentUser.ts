'use client';

import { useSocket } from '@/layout/context/SocketContext';
import { isServer } from '@/util/js-helper';
import { User, UserRole, UserStatus } from '@prisma/client';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import { CookieType } from '@/types';

/**
 * Hook to get current user. The user may not be correctly set after login and 
 * will be replaced with a dummy user to guarantee type safty. If the session is 
 * not authenticated, a redirect to the login page will be initiated.
 *
 * @returns current user
 */
const useCurrentUser = () => {
    const session = useSession();
    const { bindUserUpdate, removeBinding } = useSocket();
    const cookies = useCookies();
    const dummyUser: User = {
        id: '',
        username: '',
        displayName: '',
        email: '',
        hashedPassword: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        userRole: UserRole.GUEST,
        status: UserStatus.OFFLINE,
        conversationIds: [],
        seenMessageIds: [],
        scheduleIds: [],
        avatar: null
    };
    // to ensure that we always have an user available, we need a dummy user
    // the actual user will be set in useEffect, if available after session verification
    const [currentUser, setCurrentUser] = useState<User>(dummyUser);

    useEffect(() => {
        if (isServer() || session.status === 'loading') return;

        if (!session) {
            throw new Error('Session unavailable.');
        }

        if (session.status === 'unauthenticated') {
            // a query param would be nicer, but next-auth don't allow us to use a custom query, if we wan't the callback functionality
            cookies.set(CookieType.SHOW_SESSION_EXPIRED_MSG, 'true')
            signOut();
            // sign out is a promise, until then we serve the dummy user or the last state of the user
            return;
        }

        if (!session.data?.user) {
            console.error(session);
            throw new Error('User not available.');
        }

        const _currentUser = session.data?.user;
        setCurrentUser(_currentUser);

        const updateUserHandler = (user: User) => {
            setCurrentUser(user);
        };

        const binding = bindUserUpdate(_currentUser.id, updateUserHandler);

        return () => {
            removeBinding(binding);
        };
    }, [session, cookies, bindUserUpdate, removeBinding]);

    return currentUser;
};

export default useCurrentUser;
