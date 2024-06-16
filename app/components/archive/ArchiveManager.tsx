'use client';

import Avatar from '@/components/user/Avatar';
import { useConversation } from '@/layout/context/ConversationContext';
import { apiUrl } from '@/util/js-helper';
import { Archive } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { FileUploadSelectEvent, FileUploadUploadEvent } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import FileUpload from './FileUpload';
import { ArchiveType, FileUploadEvent, MimeType } from '@/types';

const ArchiveManager: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
    const t = useTranslations();
    const conversation = useConversation();
    const [archives, setArchives] = useState<Array<Archive>>(conversation.archives || []);
    const [previewImage, setPreviewImage] = useState<string>(archives.length > 0 ? archives[0].id : ''); // für den ersten Render brauch es einen Default Wert mit einer gültigen id
    const [filesAmount, setFilesAmount] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const imageRef = useRef<Image>(null);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        // @ts-expect-error value is added to the object
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const tableHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t('SEARCH')} />
                </span>
            </div>
        );
    };

    const imagePreviewBody = (rowData: ArchiveType) => {
        return (
            <div className="flex align-items-center gap-2" style={{ height: '54px' }}>
                {rowData.mimetype.startsWith('image') && (
                    <img alt="preview" src={apiUrl('archive', rowData.id)} style={{ width: '100px', maxHeight: '54px' }} />
                )}
                <span>{rowData.filename}</span>
            </div>
        );
    };

    const uploaderBody = (rowData: ArchiveType) => {
        return (
            <div className="flex align-items-center gap-2">
                <Avatar user={rowData.uploader} size="normal" />
                <span>{rowData.uploader.displayName}</span>
            </div>
        );
    };

    const uploadDateBody = (rowData: ArchiveType) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{format(rowData.uploadedAt, 'HH:mm dd.MM.yyyy')}</span>
            </div>
        );
    };

    const onFilePreview = (rowData: ArchiveType) => {
        if (rowData.mimetype.startsWith('image')) {
            setPreviewImage(rowData.id);
            imageRef.current?.show();
        }
        if (rowData.mimetype === MimeType.PDF) {
            window.open(apiUrl('archive', rowData.id), '_blank')?.focus();
        }
    };

    const onFileDelete = (rowData: ArchiveType) => {
        axios.delete(apiUrl('archive', rowData.id)).then(() => {
            setArchives((current) => {
                return [...current.filter((archive) => archive.id !== rowData.id)];
            });
        });
    };

    const tableActionsBody = (rowData: ArchiveType) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button icon="pi pi-eye" style={{ width: '2.5rem', height: '2.5rem' }} onClick={() => onFilePreview(rowData)} text rounded />
                <Button
                    icon="pi pi-trash"
                    className="mr-2"
                    style={{ width: '2.5rem', height: '2.5rem' }}
                    onClick={() => onFileDelete(rowData)}
                    text
                    rounded
                />
            </div>
        );
    };

    const onFilesSelect = (e: FileUploadSelectEvent) => {
        setFilesAmount(e.files.length);
    };

    const onFilesRemove = () => {
        setFilesAmount(filesAmount - 1);
    };

    const onFilesUpload = (e: FileUploadUploadEvent) => {
        console.log(e);
        const addedArchives = JSON.parse(e.xhr.response) as Archive[];
        setArchives([...archives, ...addedArchives]);
    };

    return (
        <div className="overflow-hidden" style={{ height: 'calc(100vh - 300px)' }} {...props}>
            <FileUpload
                fileUploadEvent={FileUploadEvent.CONVERSATION}
                contentClassName="overflow-auto"
                onSelect={onFilesSelect}
                onRemove={onFilesRemove}
                onUpload={onFilesUpload}
                contentStyle={{ maxHeight: '280px' }}
            />
            <DataTable
                value={archives}
                className="mt-4"
                // damit bin ich offiziell behindert
                style={{
                    height: `calc(100vh - 540px - ${Math.min(filesAmount, 3) * 82}px + ${Math.min(filesAmount, 1) * 12}px + ${
                        Math.min(Math.max(filesAmount - 2, 0), 1) * 26
                    }px)`
                }}
                scrollable
                scrollHeight={'100%'}
                sortMode="single"
                header={tableHeader}
                filters={filters}
                globalFilterFields={['filename', 'uploader.displayName']}>
                <Column field="filename" header={t('FILE')} body={imagePreviewBody} sortable></Column>
                <Column
                    field="uploader.displayName"
                    filterField="uploader.displayName"
                    header={t('UPLOADED_BY')}
                    body={uploaderBody}
                    sortable></Column>
                <Column field="uploadedAt" header={t('UPLOAD_DATE')} body={uploadDateBody} sortable></Column>
                <Column header={t('ACTIONS')} body={tableActionsBody}></Column>
            </DataTable>
            {previewImage && (
                <>
                    <Image ref={imageRef} src={apiUrl('archive', previewImage)} alt="Image" preview className="hidden" />
                </>
            )}
        </div>
    );
};

export default ArchiveManager;
