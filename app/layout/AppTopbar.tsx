import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { PiChatCircleDotsLight } from 'react-icons/pi';
import { LayoutContext } from './context/LayoutContext';
import useCurrentUser from '@/hooks/useCurrentUser';
import { AppTopbarRef } from '@/types';
import { useLoading } from './context/LoadingContext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const currentUser = useCurrentUser();
    const { setLoading } = useLoading();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleOnClick = () => {
        setLoading(true);
    }

    return (
        <div className="layout-topbar">
            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <PiChatCircleDotsLight size={24} />
            </button>

            <Link href="/" className="layout-topbar-logo">
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`}
                    width="47.22px"
                    height={'35px'}
                    alt="logo"
                />
                <span>Rainer Quatsch</span>
            </Link>

            <button
                id="openSidebarButton"
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            <h6>Hello {currentUser?.displayName}</h6>
            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible
                })}>
                <Link href="/dashboard/calendar"  onClick={handleOnClick}>
                    <button id="calendar" type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                </Link>
                <Link href="/dashboard/account"  onClick={handleOnClick}>
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </Link>
                <Link href="/dashboard/documentation" onClick={handleOnClick}>
                    <button id="settings" type="button" className="p-link layout-topbar-button" style={{ color: 'var(--text-color-secondary)' }}>
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
                <button id="signout" type="button" className="p-link layout-topbar-button" onClick={() => signOut()}>
                    <BiLogOut className="pi-big" />
                    <span className="ml-2">Logout</span>
                </button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
