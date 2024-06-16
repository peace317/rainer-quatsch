'use client';

import useConversationId from '@/hooks/useConversationId';
import { LoadingContext } from '@/layout/context/LoadingContext';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Menu } from 'primereact/menu';
import React, { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import HeaderInformation from './HeaderInformation';
import { apiUrl } from '@/util/js-helper';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    showArchiveTile?: Dispatch<SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ showArchiveTile = () => {}, ...props }) => {
    const t = useTranslations();
    const conversationId = useConversationId();
    const router = useRouter();
    const menuRef = useRef<Menu>(null);
    const [deleteConversationPopup, setDeleteConversationPopup] = useState(false);
    const { setLoading } = useContext(LoadingContext);

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Delete',
                    icon: 'pi pi-times',
                    command: () => {
                        setDeleteConversationPopup(true);
                    }
                }
            ]
        },
        {
            label: 'Navigate',
            items: [
                {
                    label: 'React Website',
                    icon: 'pi pi-external-link',
                    url: 'https://reactjs.org/'
                },
                {
                    label: 'Router',
                    icon: 'pi pi-upload'
                }
            ]
        }
    ];

    const deleteConversation = () => {
        setLoading(true);
        axios
            .delete(apiUrl('conversation',conversationId))
            .then(() => {
                console.log('fertig gelöscht');
                router.push('/dashboard');
                router.refresh();
            })
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setLoading(false));
    };

    return (
        <div
            id="conversationHeader"
            className="w-full 
                      flex 
                      justify-between 
                     align-items-center
                      "
            {...props}>
            <ConfirmPopup
                visible={deleteConversationPopup}
                onHide={() => setDeleteConversationPopup(false)}
                acceptLabel={t('YES')}
                rejectLabel={t('NO')}
                message={t('DELETE_CONVERSATION')}
                icon="pi pi-exclamation-triangle"
                accept={deleteConversation}
                reject={() => setDeleteConversationPopup(false)}
            />
            <div className="flex gap-2 align-items-center">
                <Link
                    href="/dashboard"
                    className="
                            lg:hidden 
                            block 
                            text-sky-500 
                            hover:text-sky-600 
                            transition 
                            cursor-pointer
                          ">
                    <HiChevronLeft size={32} />
                </Link>
                <HeaderInformation id="headerInformation" showArchiveTile={showArchiveTile} />
            </div>
            <div className="ml-auto">
                <Button
                    icon={<HiEllipsisHorizontal size={32} />}
                    className="ml-2 w-3rem h-3rem"
                    onClick={(event) => menuRef.current?.toggle(event)}
                    aria-controls="menu_chat_options"
                    aria-haspopup
                    text
                    rounded
                />
                <Menu id="menu_chat_options" model={items} popup ref={menuRef} popupAlignment="right" />
            </div>
        </div>
    );
};

export default Header;
