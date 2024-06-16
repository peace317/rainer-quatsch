'use client';

import { useDashboardContext } from '@/layout/context/DashboardContext';
import { useToastContext } from '@/layout/context/ToastContext';
import { User, UserRole } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import { useTranslations } from 'next-intl';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteProps } from 'primereact/autocomplete';
import { Button, ButtonProps } from 'primereact/button';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { useRef, useState } from 'react';
import { TfiPlus } from 'react-icons/tfi';
import Avatar from './Avatar';
import { apiUrl } from '@/util/js-helper';
import React from 'react';

interface UserSearchProps extends React.HTMLAttributes<HTMLDivElement> {
    showCreateNewUserButton?: boolean;
    onUserSelect?: (user: User) => void;
    onUserRemove?: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ showCreateNewUserButton = false, onUserSelect = () => {}, onUserRemove = () => {}, ...props}) => {
    const t = useTranslations();
    const userInputRef = useRef<HTMLInputElement>(null);
    const { users } = useDashboardContext();
    const [selectedUsers, setSelectedUsers] = useState<User[] | undefined>();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [acceptUserPopup, setAcceptUserPopup] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buttonEl = useRef<any>(null);
    const { show } = useToastContext();

    const search = (event: AutoCompleteCompleteEvent) => {
        let _filteredUser;
        if (!event.query.trim().length) {
            _filteredUser = [...users];
        } else {
            _filteredUser = users.filter((user) => {
                return user.displayName?.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
        setFilteredUsers(_filteredUser);
    };

    const createGuest = () => {
        const username = userInputRef?.current?.value;
        axios
            .post(apiUrl("register"), {
                username: username,
                displayName: username,
                email: '',
                password: '',
                userRole: UserRole.GUEST
            })
            .then((e: AxiosResponse) => {
                const newUser = e.data as User;
                show({
                    severity: 'success',
                    summary: t('SUCCESS'),
                    detail: t('GUEST_0_SUCCESSFULLY_CREATED', { 0: newUser.displayName })
                });
                if (userInputRef.current)
                    userInputRef.current.value = ""
                setSelectedUsers((current) => {
                    return [newUser, ...(current ? [...current] : [])];
                });
                onUserSelect(newUser);
            })
            .catch((e: AxiosResponse) => {
                show({
                    severity: 'error',
                    summary: t('ERROR'),
                    detail: e.request.response.message
                });
            });
    };

    const itemTemplate = (user: User) => {
        return (
            <div className="flex align-items-center" key={user.id}>
                <Avatar user={user} size={"normal"} className='mr-2'/>
                <div>{user.displayName}</div>
                {user.userRole === UserRole.GUEST &&
                <div className='ml-1'>(Gast)</div>}
            </div>
        );
    };

    const selectedItemTemplate = (user: User) => {
        return (
            <div className="flex align-items-center">
                <div>{user.displayName}</div>
            </div>
        );
    };

    return (
        <div className="w-full flex" {...props}>
            <ConfirmPopup
                visible={acceptUserPopup}
                onHide={() => setAcceptUserPopup(false)}
                acceptLabel={t('YES')}
                rejectLabel={t('NO')}
                message={t('ACCEPT_CREATE_NEW_GUEST_0', { 0: userInputRef?.current?.value })}
                icon="pi pi-exclamation-triangle"
                accept={createGuest}
                reject={() => setAcceptUserPopup(false)}
                target={buttonEl.current}
            />
            <AutoComplete
                field="id"
                className={'mr-2 flex-1 block'}
                multiple
                inputRef={userInputRef}
                value={selectedUsers}
                suggestions={filteredUsers}
                itemTemplate={itemTemplate}
                selectedItemTemplate={selectedItemTemplate}
                completeMethod={search}
                onChange={(e) => setSelectedUsers(e.value)}
                onSelect={(e) => onUserSelect(e.value)}
                onUnselect={(e) => onUserRemove(e.value)}
                emptyMessage={t('NO_RESULT_FOUND')}
                showEmptyMessage={true}
            />
            {showCreateNewUserButton && (
                <Button
                    id={'newUserButton'}
                    type="button"
                    ref={buttonEl}
                    onClick={() => setAcceptUserPopup(true)}
                    disabled={userInputRef?.current?.value.length === 0 || (filteredUsers !== undefined && filteredUsers.length !== 0)}
                    tooltip={t('ADD_GUEST')}
                    tooltipOptions={{ showDelay: 500 }}
                    icon={<TfiPlus className="pi" />}
                />
            )}
        </div>
    );
};

export default UserSearch;
