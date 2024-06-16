'use client';

import clsx from 'clsx';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import React, { Dispatch, DragEvent, SetStateAction, useRef, useState } from 'react';
import { Control, Controller, ControllerRenderProps, FieldErrors, FieldValues } from 'react-hook-form';
import FileUpload from '../archive/FileUpload';
import Quill from 'quill';
import { EmitterSource } from 'quill/core/emitter';

export interface MessageInputProps extends React.HTMLAttributes<HTMLDivElement> {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    files?: File[];
    onFilesAdd: Dispatch<SetStateAction<File[]>>;
    control: Control<FieldValues, FieldValues>;
    errors: FieldErrors;
    inputType?: 'simple' | 'komplex';
}

const MessageInput: React.FC<MessageInputProps> = ({ placeholder, id, type, required, control, files, onFilesAdd, inputType, ...props }) => {
    const [showHeader, setShowHeader] = useState(false);
    const editorRef = useRef<Editor>(null);
    const [editorHeight, setEditorHeight] = useState('auto');
    const editor = clsx(!inputType && 'hidden md:block');
    const simpleInput = clsx('font-light py-2 px-4 w-full', !inputType && 'block md:hidden');

    const editorHeader = () => {
        return (
            <div>
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered" aria-label="Ordered List" />
                    <button className="ql-list" value="bullet" aria-label="Unordered List" />
                    <select className="ql-align">
                        <option className="ql-selected"></option>
                        <option value="center"></option>
                        <option value="right"></option>
                        <option value="justify"></option>
                    </select>
                </span>
                <span className="ql-formats">
                    <button className="ql-link" aria-label="Insert Link" />

                    <button className="ql-code-block" aria-label="Insert Code Block" />
                </span>
            </div>
        );
    };

    const onEditorTextChange = (field: ControllerRenderProps<FieldValues, 'blog'>, e: EditorTextChangeEvent) => {
        const editorContent = document.querySelector('.ql-editor');

        const sh = editorContent?.scrollHeight || 0;
        const oh = editorContent?.clientHeight || 0;

        const height = sh > oh || sh > 180 ? 180 + 'px' : 'auto';
        setEditorHeight(height);
        field.onChange(e.htmlValue);
    };

    const onEditorLoad = () => {
        const quill: Quill = editorRef.current?.getQuill();
        quill.on('text-change', (source: EmitterSource) => {
            if (source === 'api') {
                const images = quill.container.querySelectorAll('img');
                images.forEach((image) => {
                    image.style.maxWidth = '40%';
                    image.style.height = 'auto';
                    image.style.maxHeight = '100px';
                });
            }
        });
    };

    const onFileRemove = (file: File, callback: () => void) => {
        callback();
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const itemTemplate = (file: any) => {
        /**
         * <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onFileRemove(file, props.onRemove)}
                />
         */
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
            </div>
        );
    };

    const onFilesAddHandler = (files: File[]) => {
        onFilesAdd((prevFiles) => [...prevFiles, ...files]);
        files.forEach((file) => {
            if (file.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataURL = reader.result as string;
                    editorRef.current?.getQuill().insertEmbed(10, 'image', dataURL);
                };
                reader.readAsDataURL(file);
            } else {
                //editorRef.current?.getQuill().addContainer(domNode)
            }
        });
    };

    const onDragEnter = (e: DragEvent) => {
        //$('.fileupload').attr('drop-active', 'true');
        // $('.nopointer').attr('drop-active', 'true');
        console.log(e);
    };

    const onDragLeave = (e: DragEvent) => {
        const target: any = e.target;
        if (target.id === 'box') {
            console.log(e);
            //   $('.nopointer').removeAttr('drop-active');
            //$('.fileupload').removeAttr('drop-active');
        }
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        onFilesAddHandler(Array.from(e.dataTransfer.files));
    };

    return (
        <div className="relative w-full nopointer" onDrop={onDrop} {...props}>
            <Controller
                name="blog"
                control={control}
                rules={{ required: required }}
                render={({ field }) => (
                    <div>
                        {inputType !== 'simple' && (
                            <Editor
                                id={field.name}
                                name={field.name}
                                value={field.value}
                                placeholder={placeholder}
                                onLoad={onEditorLoad}
                                ref={editorRef}
                                onTextChange={(e) => onEditorTextChange(field, e)}
                                className={editor}
                                headerTemplate={editorHeader()}
                                pt={{
                                    content: { style: { height: `${editorHeight}`, maxHeight: '180px' } },
                                    toolbar: { className: 'surface-ground' }
                                }}
                            />
                        )}
                        {inputType !== 'komplex' && (
                            <InputText
                                id={field.name}
                                name={field.name}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                type={type}
                                autoComplete={id}
                                placeholder={placeholder}
                                aria-label={placeholder}
                                className={simpleInput}
                            />
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default MessageInput;
