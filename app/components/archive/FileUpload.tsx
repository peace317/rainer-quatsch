'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import useConversationId from '@/hooks/useConversationId';
import { useToastContext } from '@/layout/context/ToastContext';
import { FileUploadEvent } from '@/types';
import { apiUrl } from '@/util/js-helper';
import { useTranslations } from 'next-intl';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import {
    FileUploadBeforeSendEvent,
    FileUploadErrorEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions,
    FileUpload as PrimeFileUpload,
    FileUploadProps as PrimeFileUploadProps
} from 'primereact/fileupload';
import { useRef } from 'react';

interface FileUploadProps extends PrimeFileUploadProps {
    fileUploadEvent: FileUploadEvent;
}

const fileAccept = 'image/*, .pdf';

const FileUpload: React.FC<FileUploadProps> = ({ fileUploadEvent, ...props }) => {
    const t = useTranslations();
    const conversationId = useConversationId(true);
    const uploaderRef = useRef<PrimeFileUpload>(null);
    const { show, clear } = useToastContext();

    const emptyTemplate = () => {
        return (
            <>
                <p className="m-0">{t('DRAG_AND_DROP_FILES_HERE')}</p>
            </>
        );
    };

    const onBeforeUpload = (e: FileUploadBeforeSendEvent) => {
        e.formData.append('fileUploadEvent', fileUploadEvent.toString());
        switch (fileUploadEvent) {
            case FileUploadEvent.CONVERSATION:
                e.formData.append('conversationId', conversationId);
                break;
            default:
                break;
        }
    };

    const onTemplateRemove = (e: any, file: File, _props: ItemTemplateOptions) => {
        if (!uploaderRef.current) return;
        const currentUploadedFiles = [...uploaderRef.current.getUploadedFiles()];
        const fileIndexToRemove = currentUploadedFiles.findIndex(
            (uploadedFile) => uploadedFile.name === file.name && uploadedFile.size === file.size && uploadedFile.lastModified === file.lastModified
        );
        // if the file was uploaded, it has to be removed from the uploaderRef
        if (fileIndexToRemove !== -1) {
            currentUploadedFiles.splice(fileIndexToRemove, 1);
            uploaderRef.current.setUploadedFiles(currentUploadedFiles);
            if (props.onRemove)
                props.onRemove({
                    file,
                    originalEvent: e
                });
        } else {
            _props.onRemove(e);
        }
    };

    const itemTemplate = (file: any, props: ItemTemplateOptions) => {
        return (
            <div className="flex align-items-center flex-wrap" style={{ maxHeight: '82px' }}>
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} style={{ width: '100px', maxHeight: '54px' }} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <div>
                            <small>{props.formatSize}</small>
                            <Badge
                                className="p-fileupload-file-badge"
                                value={file.badgeValue || 'pending'}
                                severity={file.badgeSeverity || 'warning'}
                            />
                        </div>
                    </span>
                </div>
                <Button
                    type="button"
                    icon="pi pi-times"
                    text
                    className="p-button-rounded p-button-danger ml-auto"
                    onClick={(e) => onTemplateRemove(e, file, props)}
                />
            </div>
        );
    };

    const onError = (e: FileUploadErrorEvent) => {
        e.files.forEach((file: any) => {
            file.badgeValue = t('ERROR');
            file.badgeSeverity = 'danger';
        });
        //console.log(uploaderRef.current?.getUploadedFiles());
        //console.log(uploaderRef.current?.getFiles());
        //uploaderRef.current?.setFiles(e.files);
        //uploaderRef.current?.setUploadedFiles(e.files);
        clear();
        setTimeout(
            () =>
                show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Upload was not successful (${e.xhr.status}: ${e.xhr.statusText})`,
                    sticky: true
                }),
            400
        );

        if (props.onError) props.onError(e);
    };

    const onUpload = (e: FileUploadUploadEvent) => {
        e.files.forEach((file: any) => {
            file.badgeValue = t('SUCCESS');
            file.badgeSeverity = 'success';
        });
        show({
            severity: 'success',
            summary: t('SUCCESS'),
            detail: `Upload was successful.`
        });
        if (props.onUpload) props.onUpload(e);
    };

    return (
        <PrimeFileUpload
            ref={uploaderRef}
            name="archives"
            url={apiUrl("archive")}
            accept={fileAccept}
            aria-label="Insert Image"
            maxFileSize={10000000}
            multiple
            chooseLabel={t('BROWSE')}
            uploadLabel={t('UPLOAD')}
            cancelLabel={t('CANCEL')}
            {...props}
            onBeforeUpload={onBeforeUpload}
            emptyTemplate={emptyTemplate}
            itemTemplate={itemTemplate}
            onError={onError}
            onUpload={onUpload}
        />
    );
};

export default FileUpload;
