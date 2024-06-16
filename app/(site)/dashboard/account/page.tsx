'use client';
import FileUpload from '@/components/archive/FileUpload';
import Avatar from '@/components/user/Avatar';
import useCurrentUser from '@/hooks/useCurrentUser';
import { FileUploadEvent } from '@/types';
import { apiUrl } from '@/util/js-helper';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { FileUploadOptions } from 'primereact/fileupload';

const AccountPage = () => {
    const t = useTranslations();
    const currentUser = useCurrentUser();
    const session = useSession();

    const chooseOptions: FileUploadOptions = {
        icon: '',
        iconOnly: false,
        className: 'p-button-link p-button-rounded p-button-outlined'
    };

    const onFileUpload = () => {
        session.update();
    }

    const onAvatarRemove = () => {
        if (currentUser.avatar) {
            axios.delete(apiUrl("archive", currentUser.avatar)).then(() => {
                session.update();
            });
        }
    }

    return (
        <div className="w-full">
            <div className="grid">
                <div className="tile-card col-12 xl:col-12">
                    <h3>{t('ACCOUNT')}</h3>
                    <p>{t('MANAGE_ACCOUNT')}</p>

                    <h5>{t('PROFILE')}</h5>
                    <Divider />
                    <div className="ml-3 flex align-items-center gap-2">
                        <Avatar user={currentUser} />
                        <div className="min-w-0 pl-1 pt-2 min-w-0 flex-1">
                            <div className="mb-0" style={{ marginLeft: '.75rem' }}>
                                <p>{currentUser.displayName}</p>
                            </div>
                            <div className="flex align-items-center ml-0">
                                <FileUpload
                                    mode="basic"
                                    auto
                                    chooseLabel={t('UPLOAD_PROFILE_IMAGE')}
                                    accept="image/*"
                                    chooseOptions={chooseOptions}
                                    fileUploadEvent={FileUploadEvent.USER_AVATAR}
                                    onUpload={onFileUpload}
                                    pt={{
                                        chooseIcon: {
                                            className: 'hidden'
                                        }
                                    }}
                                />
                                {currentUser.avatar &&
                                    <Button label={t('REMOVE_PROFILE_IMAGE')} severity="danger" rounded text onClick={onAvatarRemove} />
                                }
                            </div>
                        </div>
                    </div>

                    <h5>{t('EMAIL')}</h5>
                    <Divider />
                    <div className="ml-3">
                        <p>{currentUser.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
