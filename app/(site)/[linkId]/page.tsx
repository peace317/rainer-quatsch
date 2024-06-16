/* eslint-disable @next/next/no-img-element */
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CallPage = () => {
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
      router.push("/notfound")
    }, [router]);

    return (
        <div>
            <h1>Link ID: {params?.callId}</h1>
        </div>
    );
};

export default CallPage;
