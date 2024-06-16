'use client'; // Error components must be Client Components

import React from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import NotFound from './not-found';

export default function Error({ error, reset }: { error?: Error & { digest?: string }; reset?: () => void }) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const onReset = () => {
        router.push('/dashboard');
    };

    if (error instanceof AxiosError) {
        switch (error.response?.status) {
            case 404:
                return <NotFound />;
            default:
        }
    }

    return (
        <div id="conversationError" className="grid w-full">
            <div className="col-12">
                <div className="tile-card">
                    <div
                        className="w-full surface-card flex flex-column align-items-center justify-content-center overflow-hidden"
                        style={{ borderRadius: '53px', height: 'calc(100vh - 200px)', minHeight: '425px' }}>
                        <div
                            className="flex justify-content-center align-items-center bg-pink-500 border-circle"
                            style={{ height: '3.2rem', width: '3.2rem', minHeight: '3.2rem' }}>
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-5xl mb-2">Error Occured</h1>
                        <div className="text-600 mb-5">Something went wrong.</div>
                        <img src="/images/error/asset-error.svg" alt="Error" className="mb-5" style={{ width: '50%', height: '50%', maxWidth: '600px' }} />
                        <Button icon="pi pi-arrow-left" label="Go to Dashboard" text onClick={onReset} />
                    </div>
                </div>
            </div>
        </div>
    );
}
