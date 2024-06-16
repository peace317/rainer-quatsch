import { MenuContextProps } from '@/types';
import React, { useState, createContext } from 'react';

export const MenuContext = createContext({} as MenuContextProps);

export const MenuProvider = ({ children }: React.PropsWithChildren) => {
    const [activeMenu, setActiveMenu] = useState('');

    const value = {
        activeMenu,
        setActiveMenu
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
