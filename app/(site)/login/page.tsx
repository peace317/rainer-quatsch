/* eslint-disable @next/next/no-img-element */
'use client';
import { CookieType } from '@/types';
import clsx from 'clsx';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password, PasswordProps } from 'primereact/password';
import { useContext, useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useCookies } from 'next-client-cookies';
import { useTranslations } from 'next-intl';
import { LayoutContext } from '@/layout/context/LayoutContext';
import { LoadingContext } from '@/layout/context/LoadingContext';
import { VscWarning } from 'react-icons/vsc';

type FormValues = {
    username: string;
    password: string;
    rememberMe: boolean;
};

const LoginPage = () => {
    const cookies = useCookies();
    const { layoutConfig } = useContext(LayoutContext);
    const { setLoading } = useContext(LoadingContext);
    const t = useTranslations();
    const router = useRouter();
    const session = useSession();
    const rememberedLogin = useMemo(() => cookies.get(CookieType.REMEMBERED_LOGIN) === 'true', [cookies]);

    const defaultValues = {
        username: '',
        password: '',
        rememberMe: rememberedLogin
    };

    const { control, handleSubmit } = useForm<FormValues>({ defaultValues });

    useEffect(() => {
        if (session?.status === 'unauthenticated' && cookies.get(CookieType.SHOW_SESSION_EXPIRED_MSG) === 'true') {
            cookies.remove(CookieType.SHOW_SESSION_EXPIRED_MSG);
            toast(t('SESSION_EXPIRED'), {
                style: { maxWidth: '400px' },
                icon: <VscWarning size={20} color={'FireBrick'} />
            });
        }
        if (session?.status === 'authenticated' && rememberedLogin) {
            setLoading(true);
            router.push('/dashboard');
        }
    }, [session?.status, router, rememberedLogin, cookies, t, setLoading]);

    const containerClassName = clsx('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setLoading(true);
        signIn('credentials', { username: data.username, password: data.password, redirect: false })
            .then((response) => {
                if (response?.error && response?.error !== 'undefined') {
                    toast.error(response.error);
                    setLoading(false);
                    return;
                }

                if (response?.ok) {
                    cookies.set(CookieType.REMEMBERED_LOGIN, String(data.rememberMe));
                    toast.success('Logged in');
                    // callback url must be extracted from query
                    const callbackUrl = new URL(window.location.href).searchParams.get('callbackUrl');
                    if (callbackUrl) {
                        router.push(callbackUrl);
                    } else {
                        router.push('/dashboard');
                    }
                }
            })
            .catch((error) => {
                toast.error('Fatal error occured during sign in!');
                console.error('Error occured during sign in', error);
                setLoading(false);
            });
    };

    const handleKeyPress = (event: PasswordProps | Readonly<PasswordProps>) => {
        if (event.key === 'Enter') {
            handleSubmit(onSubmit);
        }
    };

    return (
        <div className={containerClassName}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <img
                        src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
                        alt="Sakai logo"
                        className="mb-5 w-6rem flex-shrink-0"
                    />
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}>
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
                                <span className="text-600 font-medium">Sign in to continue</span>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                    Username
                                </label>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            id="username"
                                            type="text"
                                            placeholder="Username"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className={clsx('w-full md:w-30rem mb-5', { 'p-invalid': fieldState.invalid })}
                                            style={{ padding: '1rem' }}
                                        />
                                    )}
                                />

                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    Password
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState }) => (
                                        <Password
                                            inputId="password"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder="Password"
                                            toggleMask
                                            className="w-full mb-5"
                                            inputClassName={clsx('w-full p-3 md:w-30rem', { 'p-invalid': fieldState.invalid })}
                                            feedback={false}
                                            onKeyDown={handleKeyPress}></Password>
                                    )}
                                />

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Controller
                                            name="rememberMe"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Checkbox
                                                    inputId="rememberMe"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.checked ?? false)}
                                                    className="mr-2"
                                                />
                                            )}
                                        />
                                        <label htmlFor="rememberMe">Remember me</label>
                                    </div>
                                    <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Forgot password?
                                    </a>
                                </div>

                                <Button type="submit" label="Sign In" className="w-full p-3 text-xl" />
                            </div>

                            <div className="mt-5 flex justify-content-center">
                                <span>New to RainerQuatsch?</span>
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                    onClick={() => router.push('/register')}>
                                    Create an account
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
