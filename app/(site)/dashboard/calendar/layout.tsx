import React from 'react';

export default async function CalendarLayout({ children }: React.PropsWithChildren) {

    return (
        <React.Fragment>
            {children} 
        </React.Fragment>
    );
}