'use client';

import React  from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useRef } from 'react';

interface BodyProps {}

const EmptyBody: React.FC<BodyProps> = () => {
    const messages = Array(10).fill(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView();
        }
    }, []);

    return (
        <div className="mb-2 messageBody w-full">
            <ScrollPanel style={{ height: 'calc(100vh - 405px)' }}>
                <ul className="p-0 mt-4 list-none">
                    {messages.map((message, index) => (
                        <li key={index} className="mb-3">
                            <div className="flex flex-row-reverse">
                                {index % 2 === 0 ? (
                                    <div style={{ flex: '1' }}>
                                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                                        <Skeleton width="75%"></Skeleton>
                                    </div>
                                ) : null}
                                <Skeleton shape="circle" size="4rem" className="mr-2" borderRadius="30px"></Skeleton>
                                {index % 2 === 1 ? (
                                    <div className="flex flex-column align-items-end mr-2">
                                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                                        <Skeleton width="30rem"></Skeleton>
                                    </div>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
                <div ref={bottomRef} />
            </ScrollPanel>
        </div>
    );
};

export default EmptyBody;
