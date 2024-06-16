'use client';

import React, { useState, createContext, useEffect, Dispatch, SetStateAction, useContext, Suspense } from 'react';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePathname, useSearchParams } from 'next/navigation';

export interface LoadingContextProps {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

export const LoadingContext = createContext({} as LoadingContextProps);

export const useLoading = () => {
    return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }: React.PropsWithChildren) => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const value = {
        loading,
        setLoading
    };

    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams]);

    return (
        <LoadingContext.Provider value={value}>
            {loading && (
                <div className="center-screen" hidden={!loading} style={{ zIndex: '2000' }}>
                    <ProgressSpinner aria-label="Loading" />
                </div>
            )}
            <BlockUI blocked={loading} fullScreen />
            {children}
        </LoadingContext.Provider>
    );
};
