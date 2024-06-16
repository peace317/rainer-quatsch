'use client'
import { createContext, useEffect, useState } from 'react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { useCookies } from 'next-client-cookies';
import { Locale } from '@/../next-i18next.config';
import { CookieType, LayoutConfig, LayoutContextProps, LayoutState } from '@/types';

export interface RootLayoutProps {
    children: React.ReactNode;
    lang: Locale;
    defaultMessages: AbstractIntlMessages;
}

export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({ children, lang, defaultMessages }: RootLayoutProps) => {
    const cookies = useCookies();
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: cookies.get(CookieType.THEME_COLOR_SCHEME) || 'light',
        theme: cookies.get(CookieType.THEME) || 'bootstrap4-light-blue',
        scale: 14,
        lang: lang
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        topBarActive: true,
        sideBarActive: true,
        footerActive: true
    });

    const [messages, setMessages] = useState(defaultMessages);

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showMenu = (show: boolean) => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !show }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !show }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !show }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    
    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const messagesData = await import(`../../../public/locales/${lang}/common.json`);
          setMessages(messagesData.default);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();
    }, [lang]);
    

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showMenu,
        showProfileSidebar
    };

    return <LayoutContext.Provider value={value}>
        <NextIntlClientProvider locale={lang} messages={messages} >
            {children}
        </NextIntlClientProvider>
    </LayoutContext.Provider>;
};
