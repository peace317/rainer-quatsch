/* eslint-disable @next/next/no-img-element */
'use client';
import { UserRole } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Tooltip } from 'primereact/tooltip';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { VscInfo } from 'react-icons/vsc';
import { LayoutContext } from '../../layout/context/LayoutContext';
import { LoadingContext } from '../../layout/context/LoadingContext';
import AuthSocialButton from './AuthSocialButton';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedOnTerms, setAgreedOnTerms] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const { setLoading } = useContext(LoadingContext);
    const router = useRouter();

    const containerClassName = clsx(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const onSubmit = () => {
        setLoading(true);
        const displName = displayName === undefined ? username : displayName;
        axios
            .post('api/register', { email: email, displayName: displName, username: username, password: password, userRole: UserRole.USER })
            .then(() => {
                signIn('credentials', { username: username, password: password, redirect: false }).then((callback) => {
                    if (callback?.error) {
                        toast.error(callback.error);
                        setLoading(false);
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success("Registration successful");
                        router.push('/dashboard');
                    }
                });
            })
            .catch((e: AxiosResponse) => {
                toast.error(e.request.response);
                setLoading(false);
            });
    };

    const socialAction = (action: string) => {};

    return (
        <div className={containerClassName}>
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
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email *
                            </label>
                            <InputText
                                id="email"
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mb-5"
                                style={{ padding: '1rem', height: '44px' }}
                            />
                            <label htmlFor="displayname" className="block text-900 text-xl font-medium mb-2">
                                Displayname
                            </label>
                            <span className="p-input-icon-right inline">
                                <Tooltip target=".displayTooltipIcon" content="This is how others will see you." />
                                <VscInfo className="pi displayTooltipIcon" />
                                <InputText
                                    id="displayname"
                                    type="text"
                                    placeholder="Displayname"
                                    required={true}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full mb-5"
                                    style={{ padding: '1rem', height: '44px' }}
                                />
                            </span>

                            <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                Username *
                            </label>
                            <InputText
                                id="registerUsername"
                                type="text"
                                placeholder="Username"
                                required={true}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full mb-5"
                                style={{ padding: '1rem', height: '44px' }}
                            />

                            <label htmlFor="registerPassword" className="block text-900 font-medium text-xl mb-2">
                                Password *
                            </label>
                            <Password
                                inputId="registerPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full"
                                style={{ height: '44px' }}
                                autoComplete='off'
                            />
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        inputId="rememberMe"
                                        checked={agreedOnTerms}
                                        onChange={(e) => setAgreedOnTerms(e.checked ?? false)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="rememberMe">I agree to the terms and conditions *</label>
                                </div>
                                <div>
                                    <a
                                        id="loginRoute"
                                        onClick={() => router.push('/login')}
                                        className="font-medium underline ml-2 text-right cursor-pointer"
                                        style={{ color: 'var(--primary-color)' }}
                                    >
                                        Already have an account?
                                    </a>
                                </div>
                            </div>
                            <Button
                                label="Register"
                                className="w-full p-3 text-xl"
                                disabled={!agreedOnTerms}
                                onClick={onSubmit}
                            ></Button>
                        </div>
                        <div className="mt-5">
                            <Divider align="center">
                                <span className="text-gray-500">Or continue with</span>
                            </Divider>
                            <div className="mt-5 flex gap-2">
                                <AuthSocialButton icon={BsGithub} label="Github" onClick={() => socialAction('github')} />
                                <AuthSocialButton icon={BsGoogle} label="Google" onClick={() => socialAction('google')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
