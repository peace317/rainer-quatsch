'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="grid w-full">
            <div className="col-12 xl:col-12">
                <div className="card">
                    <div
                        className="w-full surface-card  flex flex-column align-items-center"
                        style={{ borderRadius: '53px' }}>
                        <img src="/images/error/logo-error.svg" alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                        <span className="text-blue-500 font-bold text-3xl">404</span>
                        <h1 className="text-900 font-bold text-5xl mb-2">Not Found</h1>
                        <div className="text-600 mb-5">Requested resource is not available</div>
                        <div style={{width: '50%'}}>
                            <Link href="/" className="w-full flex align-items-center py-5 border-300 border-bottom-1">
                                <span
                                    className="flex justify-content-center align-items-center bg-orange-400 border-round"
                                    style={{ height: '3.5rem', width: '3.5rem' }}>
                                    <i className="pi pi-fw pi-question-circle text-50 text-2xl"></i>
                                </span>
                                <span className="ml-4 flex flex-column">
                                    <span className="text-900 lg:text-xl font-medium mb-1">Solution Center</span>
                                    <span className="text-600 lg:text-lg">Phasellus faucibus scelerisque eleifend.</span>
                                </span>
                            </Link>
                            <Link href="/" className="w-full flex align-items-center mb-5 py-5 border-300 border-bottom-1">
                                <span
                                    className="flex justify-content-center align-items-center bg-indigo-400 border-round"
                                    style={{ height: '3.5rem', width: '3.5rem' }}>
                                    <i className="pi pi-fw pi-unlock text-50 text-2xl"></i>
                                </span>
                                <span className="ml-4 flex flex-column">
                                    <span className="text-900 lg:text-xl font-medium mb-1">Permission Manager</span>
                                    <span className="text-600 lg:text-lg">Accumsan in nisl nisi scelerisque</span>
                                </span>
                            </Link>
                        </div>
                        <Button icon="pi pi-arrow-left" label="Go to Dashboard" text onClick={() => router.push('/dashboard')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
