'use client';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import Header from './Header';
import { Divider } from 'primereact/divider';
import Body from './Body';
import { useLoading } from '@/layout/context/LoadingContext';
import ArchiveManager from '@/components/archive/ArchiveManager';
import MessageForm from '@/components/message/MessageForm';

const Conversation: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
    const { showBoundary } = useErrorBoundary();
    const [showArchiveTile, setShowArchiveTile] = useState(false);
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(false);

        const errorInterceptor = axios.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error: AxiosError) {
                if (error.response && !error.message.includes(error.response.statusText))
                    error.message = `${error.message}: ${error.response.statusText}`
                showBoundary(error);
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(errorInterceptor);
        };
    }, [showBoundary, setLoading]);

    return (
        <div className="h-full w-full" {...props}>
            <div className="tile-card h-full w-full flex flex-column mb-2 border-none border-noround">
                <Header id="header" showArchiveTile={setShowArchiveTile} />
                <Divider />
                {!showArchiveTile && (
                    <>
                        <Body id={'body'} />
                        <MessageForm id={'inputForm'} inputType="simple"/>
                    </>
                )}
                {showArchiveTile && (
                    <>
                        <ArchiveManager id="archives" />
                    </>
                )}
            </div>
        </div>
    );
};

export default Conversation;
