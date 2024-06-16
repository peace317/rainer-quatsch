'use client';

import MessageInput, { MessageInputProps } from '@/components/message/MessageInput';
import useConversationId from '@/hooks/useConversationId';
import { apiUrl } from '@/util/js-helper';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import React, { useRef, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane } from 'react-icons/hi2';

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {
    inputType?: 'simple' | 'komplex';
} 

const MessageForm: React.FC<FormProps> = ({inputType, ...props} ) => {
    const conversationId = useConversationId();
    const fileUploadRef = useRef(null);
    const [files, setFiles] = useState<File[]>([]);

    const t = useTranslations();
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            blog: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setValue('blog', '', { shouldValidate: true });
        const msg = data.blog;
        axios.post(apiUrl("messages"), {
            message: msg,
            conversationId: conversationId
        });
    };

    const handleUpload = (ev: FileUploadUploadEvent) => {
        /* axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId
    })*/
        console.log('upload');
    };


    return (
        <div id="messageFormWrapper" className="w-full" {...props}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex align-items-center gap-2 w-full">
                <MessageInput
                    id="message"
                    control={control}
                    errors={errors}
                    onFilesAdd={setFiles}
                    required
                    placeholder={t('WRITE_A_MESSAGE')}
                    files={files}
                    inputType={inputType}
                />
                <FileUpload
                    mode="basic"
                    className="block md:hidden"
                    name="demo[]"
                    url={apiUrl("archive")}
                    accept="image/*"
                    maxFileSize={1000000}
                    onUpload={handleUpload}
                    auto
                    chooseLabel="Browse"
                    // customUpload
                />
                <Button id="submitButton" type="submit" className="p-2 min-w-0">
                    <HiPaperAirplane size={18} className="text-white" />
                </Button>
            </form>
        </div>
    );
};

export default MessageForm;
