'use client';

import Avatar from '@/components/user/Avatar';
import AvatarGroup from '@/components/user/AvatarGroup';
import useOtherUser from '@/hooks/useOtherUser';
import { useConversation } from '@/layout/context/ConversationContext';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useMemo, useTransition } from 'react';
import EmptyHeaderInformation from './EmptyHeaderInformation';
import { isGroup } from '@/util/conversation';

interface HeaderInfoProps extends React.HTMLAttributes<HTMLDivElement> {
    showArchiveTile?: Dispatch<SetStateAction<boolean>>;
}

const HeaderInformation: React.FC<HeaderInfoProps> = ({ showArchiveTile = () => {}, ...props }) => {
    const t = useTranslations();
    const [isPending] = useTransition();
    const conversation = useConversation();
    const otherUser = useOtherUser(conversation);

    const statusText = useMemo(() => {
        if (isGroup(conversation)) {
            return `${conversation?.users?.length} members`;
        }
        if (otherUser) return t(otherUser?.status);
        return undefined;
    }, [conversation, otherUser, t]);

    if (isPending) {
        return <EmptyHeaderInformation id="emptyHeader" />;
    }

    return (
        <div className="cursor-pointer" onClick={() => showArchiveTile(false)} {...props}>
            <div className="flex m-2">
                <div>
                    {isGroup(conversation) && (
                        <Avatar
                            user={otherUser}
                            icon={'pi pi-user'}
                        />
                    )}
                </div>
                <div className="flex flex-column m-2">
                    <div>{conversation?.name || otherUser?.displayName}</div>
                    <div className="text-sm font-light text-neutral-500">{statusText}</div>
                </div>
            </div>
        </div>
    );
};

export default HeaderInformation;
