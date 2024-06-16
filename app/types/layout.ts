import React, { Dispatch, SetStateAction, HTMLAttributeAnchorTarget, ReactNode, MutableRefObject } from 'react';
import { User } from '@prisma/client';
import { Locale } from '@/../next-i18next.config';
import { ConversationType } from './models';

/* Breadcrumb Types */
export interface AppBreadcrumbProps {
    className?: string;
}

export interface Breadcrumb {
    labels?: string[];
    to?: string;
}

export interface BreadcrumbItem {
    label: string;
    to?: string;
    items?: BreadcrumbItem[];
}

/* Context Types */
export type LayoutState = {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    topBarActive: boolean;
    sideBarActive: boolean;
    footerActive: boolean;
};

export type CallLayoutState = {
    sideBarActive: boolean;
};

export type UserProps = {
    children?: ReactNode;
    currentUser: User;
};

export type DashboardProps = {
    users: User[];
    conversations: ConversationType[];
    children?: ReactNode;
};

export type LayoutConfig = {
    ripple: boolean;
    inputStyle: string;
    menuMode: string;
    colorScheme: string;
    theme: string;
    scale: number;
    lang: Locale;
};

export interface LayoutContextProps {
    layoutConfig: LayoutConfig;
    setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
    layoutState: LayoutState;
    setLayoutState: Dispatch<SetStateAction<LayoutState>>;
    onMenuToggle: () => void;
    showMenu: (show: boolean) => void;
    showProfileSidebar: () => void;
}

export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: Dispatch<SetStateAction<string>>;
}

export interface DashboardContextProps {
    users: User[];
    conversations: ConversationType[];
}

/* AppConfig Types */
export interface AppConfigProps {
    simple?: boolean;
}

/* AppTopbar Types */
export type NodeRef = MutableRefObject<ReactNode>;
export interface AppTopbarRef {
    menubutton?: HTMLButtonElement | null;
    topbarmenu?: HTMLDivElement | null;
    topbarmenubutton?: HTMLButtonElement | null;
    children?: ReactNode;
}

/* AppMenu Types */
interface MenuModelItem extends Omit<AppMenuItem, 'items'> {
    // Hier können spezifische Eigenschaften für MenuModelItem hinzugefügt werden
}

type CommandProps = {
    originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
    item?: MenuModelItem;
};

export interface MenuProps {
    model: MenuModel[];
}

export interface MenuModel {
    label: string;
    icon?: string;
    items?: MenuModel[];
    to?: string;
    url?: string;
    target?: HTMLAttributeAnchorTarget;
    separator?: boolean;
}

export interface AppMenuItem extends MenuModel {
    items?: AppMenuItem[];
    badge?: 'UPDATED' | 'NEW';
    badgeClass?: string;
    class?: string;
    preventExact?: boolean;
    visible?: boolean;
    disabled?: boolean;
    replaceUrl?: boolean;
    command?: ({ originalEvent, item }: CommandProps) => void;
}

export interface AppMenuItemProps {
    item?: AppMenuItem;
    parentKey?: string;
    index?: number;
    root?: boolean;
    className?: string;
}
