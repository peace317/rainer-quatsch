'use client';

import { User } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

import UserSearch from '@/components/user/UserSearch';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SlotInfo } from 'react-big-calendar';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ScheduleType } from '@/types';
import { apiUrl } from '@/util/js-helper';

interface ScheduleModalProps {
    display?: boolean;
    setDisplay: Dispatch<SetStateAction<boolean>>;
    callback?: (schedule: ScheduleType) => void;
    slotInfo?: SlotInfo;
}

type FormValues = {
    title: string;
    startDate: Date;
    endDate: Date;
    participants: User[];
    scheduleInformation: string;
};

const NewSchedule: React.FC<ScheduleModalProps> = ({ slotInfo, display, setDisplay, callback = () => {} }) => {
    const t = useTranslations();

    const {
        control,
        reset,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>();

    useEffect(() => {
        if (slotInfo) {
            setValue('startDate', slotInfo.start, { shouldValidate: true });
            setValue('endDate', slotInfo.end, { shouldValidate: true });
            setValue('title', t('NEW_CONVERSATION'));
            setValue('participants', []);
            setValue('scheduleInformation', '');
        }
    }, [slotInfo, setValue, t]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {

        axios
            .post(apiUrl("schedule"), data)
            .then((e: AxiosResponse) => {
                callback(e.data);
            })
            .catch(() => {
                toast.error('Something went wrong!');
            })
            .finally(() => {
                reset();
                onHide();
            });
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
        setDisplay(false);
    };

    return (
        <Dialog
            header={t('NEW_SCHEDULE')}
            visible={display}
            onHide={() => onHide()}
            footer={renderFooter()}
            style={{ width: '40rem' }}>
            <form className="grid">
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="field col-12">
                            <p id={field.name} className="label-h4">
                                {t('TITLE')}
                            </p>
                            <InputText
                                id="conversationTitle"
                                className="col-12"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        </div>
                    )}
                />
                <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="field col-6">
                            <p id={field.name} className="label-h4">
                                {t('FROM')}
                            </p>
                            <Calendar
                                id="startDate"
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                showTime
                                showIcon
                                readOnlyInput
                                hourFormat="24"
                            />
                        </div>
                    )}
                />
                <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="field col-6">
                            <p id={field.name} className="label-h4">
                                {t('TO')}
                            </p>
                            <Calendar
                                id="endDate"
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                showTime
                                showIcon
                                readOnlyInput
                                hourFormat="24"
                            />
                        </div>
                    )}
                />
                <Controller
                    name="participants"
                    control={control}
                    render={({ field }) => (
                        <div className="field col-12">
                            <p id={field.name} className="label-h4">
                                {t('PARTICIPANTS')}
                            </p>
                            <UserSearch
                                id="userSearch"
                                onUserSelect={(newUser) => {
                                    const updatedParticipants = [...field.value, newUser];
                                    field.onChange(updatedParticipants);
                                }}
                                onUserRemove={(removedUser) => {
                                    const updatedParticipants = field.value.filter(
                                        (participant) => participant !== removedUser
                                    );
                                    field.onChange(updatedParticipants);
                                }}
                            />
                        </div>
                    )}
                />
                <Controller
                    name="scheduleInformation"
                    control={control}
                    render={({ field }) => (
                        <div className="field col-12">
                            <p id={field.name} className="label-h4">
                                {t('SCHEDULE_INFORMATIONS')}
                            </p>
                            <InputTextarea
                                className="w-full"
                                style={{ resize: 'none' }}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}
                />
            </form>
        </Dialog>
    );
};

export default NewSchedule;
