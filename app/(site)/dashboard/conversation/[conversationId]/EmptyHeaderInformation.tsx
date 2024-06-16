'use client';

import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const EmptyHeaderInformation: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
    return (
        <>
            <Skeleton shape="circle" size="4rem" className="mr-2" borderRadius="30px" />
            <div className="flex flex-column m-2">
                <Skeleton width="10rem" className="mb-2" />
                <Skeleton width="5rem" className="mb-2" />
            </div>
        </>
    );
};

export default EmptyHeaderInformation;
