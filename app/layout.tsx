import '@/libs/env';
import { CookiesProvider } from 'next-client-cookies/server';
import { cookies } from 'next/headers';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import React, { Suspense } from 'react';
import { i18n } from '../next-i18next.config';
import '../styles/layout/layout.scss';
import AuthContext from './layout/context/AuthContext';
import { LayoutProvider } from './layout/context/LayoutContext';
import { LoadingProvider } from './layout/context/LoadingContext';
import { ToastProvider } from './layout/context/ToastContext';
import ToasterContext from './layout/context/ToasterContext';
import { CookieType } from '@/types';

/*
export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}*/

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies();

    const lang = i18n.defaultLocale;

    let messages;
    try {
        messages = (await import(`../public/locales/${lang}/common.json`)).default;
    } catch (error) {
        console.log(error);
    }

    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                <link
                    id="theme-css"
                    href={`/themes/${cookieStore.get(CookieType.THEME)?.value || 'bootstrap4-light-blue'}/theme.css`}
                    rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <AuthContext>
                        <CookiesProvider>
                            <ToasterContext />
                            <ToastProvider>
                                <Suspense>
                                    <LoadingProvider>
                                        <LayoutProvider lang={lang} defaultMessages={messages}>
                                            {children}
                                        </LayoutProvider>
                                    </LoadingProvider>
                                </Suspense>
                            </ToastProvider>
                        </CookiesProvider>
                    </AuthContext>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
