'use client';

import { User } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import React, { Dispatch, SetStateAction, useContext } from 'react';

import { LoadingContext } from '@/layout/context/LoadingContext';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button';
import { Dialog, DialogProps } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import UserSearch from '../user/UserSearch';
import clsx from 'clsx';
import { ConversationType, Optional } from '@/types';
import { apiUrl } from '@/util/js-helper';

interface GroupChatModalProps extends Optional<DialogProps, 'onHide'> {
    display?: boolean;
    setDisplay: Dispatch<SetStateAction<boolean>>;
    callback?: (conversation: ConversationType) => void;
}

type FormValues = {
    title: string;
    participants: User[];
    description: string;
};

const defaultValues = {
    title: '',
    participants: [],
    description: ''
};

const NewConversation: React.FC<GroupChatModalProps> = ({
    id,
    display,
    setDisplay,
    callback = () => {},
    ...props
}) => {
    const t = useTranslations();
    const { setLoading } = useContext(LoadingContext);
    const { control, reset, handleSubmit } = useForm<FormValues>({ defaultValues });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setLoading(true);
        axios
            .post(apiUrl('conversation'), {
                name: data.title,
                members: data.participants,
            })
            .then((e: AxiosResponse) => {
                callback(e.data as ConversationType);
            })
            .catch(() => {
                setLoading(false);
                toast.error('Something went wrong!');
            })
            .finally(onHide);
    };

    const renderFooter = () => {
        return (
            <div className="mt-2">
                <Button label={t('CLOSE')} icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button type="submit" label={t('SAVE')} autoFocus onClick={handleSubmit(onSubmit)} />
            </div>
        );
    };

    const onHide = () => {
        reset();
        setDisplay(false);
    };

    return (
        <Dialog
            id={id}
            header={t('NEW_CONVERSATION')}
            visible={display}
            footer={renderFooter()}
            style={{ width: '40rem' }}
            onHide={onHide}
            {...props}>
            <form>
                <div id={id + ':wrapper'} className="m-2">
                    <div id={id + ':conversationTitleWrapper'} className="field">
                        <p id={id + ':conversationTitleWrapper:label'} className="label-h4">
                            {t('TITLE')} *
                        </p>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: true }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id={id + ':conversationTitleWrapper:inputtext'}
                                    value={field.value}
                                    className={clsx({ 'p-invalid': fieldState.invalid })}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            )}
                        />
                    </div>

                    <div id={id + ':memberSearchWrapper'} className="field w-full flex flex-column">
                        <p id={id + ':memberSearchWrapper:label'} className="label-h4">
                            {t('PARTICIPANTS')} *
                        </p>
                        <div className="w-full flex">
                            <Controller
                                name="participants"
                                control={control}
                                rules={{ required: true }}
                                render={({ field, fieldState }) => (
                                    <UserSearch
                                        id="userSearch"
                                        className={clsx('mr-2 w-full flex', { 'p-invalid': fieldState.invalid })}
                                        showCreateNewUserButton
                                        onUserSelect={(newUser) => {
                                            const updatedParticipants = [...field.value, newUser];
                                            field.onChange(updatedParticipants);
                                        }}
                                        onUserRemove={(removedUser) => {
                                            const updatedParticipants = field.value.filter((participant) => participant !== removedUser);
                                            field.onChange(updatedParticipants);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div id={id + ':conversationDescriptionWrapper'} className="field">
                        <p id={id + ':conversationDescriptionWrapper:label'} className="label-h4">
                            {t('DESCRIPTION')}
                        </p>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id={id + ':conversationDescriptionWrapper:inputtextarea'}
                                    value={field.value}
                                    className="h-full w-full"
                                    style={{ resize: 'none' }}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            )}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default NewConversation;
