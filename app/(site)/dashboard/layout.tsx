import React  from 'react';
import getConversations from '@/actions/getConversations';
import getCurrentUser from '@/actions/getCurrentUser';
import getUsers from '@/actions/getUsers';
import { SocketProvider } from '@/layout/context/SocketContext';
import Layout from '@/layout/Layout';
import { Metadata } from 'next';
import { DashboardProvider } from '@/layout/context/DashboardContext';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'RainerQuatsch',
    description: 'The ultimate collection of video assistant tools.',
    robots: { index: false, follow: false },
    icons: {
        icon: '/favicon.ico'
    }
};

export default async function DashboardLayout({ children }: AppLayoutProps) {
    const users = await getUsers();
    const currentUser = await getCurrentUser();
    const conversations = await getConversations();

    return (
        <SocketProvider currentUser={currentUser} host={process.env.ENV_HOST} port={process.env.WEBSOCKET_PORT}>
            <DashboardProvider users={users} conversations={conversations}>
                <Layout>{children}</Layout>
            </DashboardProvider>
        </SocketProvider>
    );
}
