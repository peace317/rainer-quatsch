'use client';

import { ContentProps, ToastMessage as PrimeToastMessage, Toast } from 'primereact/toast';
import { createContext, useContext, useRef, useState } from 'react';

export interface ToastMessage extends Omit<PrimeToastMessage, 'content'> {
    content?: React.ReactNode | ((props: ContentProps) => React.ReactNode);
    position?: 'top-center' | 'top-right';
}

export interface ToastContextProps {
    show: (message: ToastMessage) => void;
    clear: () => void;
}

export const ToastContext = createContext({} as ToastContextProps);

export const useToastContext = () => {
    const toastContext = useContext(ToastContext);
    if (!toastContext) {
        throw Error('Tried to access ToastContext outside a ToastContextProvider.');
    }
    return toastContext;
};

export const ToastProvider = ({ children }: React.PropsWithChildren) => {
    const toastTopRight = useRef<Toast>(null);
    const toastTopCenter = useRef<Toast>(null);
    const [content, setContent] = useState<React.ReactNode | ((props: ContentProps) => React.ReactNode)>();

    const show = (message: ToastMessage) => {
        setContent(message.content);
        switch (message.position) {
            case undefined:
            case 'top-right':
                toastTopRight.current?.show(message as PrimeToastMessage);
                break;
            case 'top-center':
                toastTopCenter.current?.show(message as PrimeToastMessage);
                break;
            default:
                console.warn(`Position ${message.position} not implemented as toast`)

        }
    };

    const clear = () => {
        toastTopRight.current?.clear();
        toastTopRight.current?.clear();
    };

    const value = {
        show,
        clear
    };

    return (
        <ToastContext.Provider value={value}>
            <Toast ref={toastTopRight} baseZIndex={10000} content={content} />
            <Toast ref={toastTopCenter} baseZIndex={10000} position="top-center" />
            {children}
        </ToastContext.Provider>
    );
};
