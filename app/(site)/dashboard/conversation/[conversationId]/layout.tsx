import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Error from './error';

export default async function ConversationLayout({ children }: React.PropsWithChildren) {
    return (
        <React.Fragment>
            <ErrorBoundary fallback={<Error />}>{children}</ErrorBoundary>
        </React.Fragment>
    );
}
