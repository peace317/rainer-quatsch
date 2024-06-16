"use client"
import { DashboardContextProps, DashboardProps } from '@/types';
import { createContext, useContext } from 'react';

export const DashboardContext = createContext({} as DashboardContextProps);

export const useDashboardContext = () => {
    return useContext(DashboardContext);
};


export const DashboardProvider = ({ children, users, conversations }: DashboardProps) => {

    const value = {
        users,
        conversations
    };

    return <DashboardContext.Provider value={value}>
        {children}
    </DashboardContext.Provider>;
};