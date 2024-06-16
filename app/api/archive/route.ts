import getCurrentUser from '@/actions/getCurrentUser';
import { archiveConversationDoc, archiveUserAvatar, storeArchive } from '@/services/ArchiveService';
import { NextResponse } from 'next/server';
import { FileUploadEvent } from '@/types';
import { Archive } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.formData();
        const files: File[] = body.getAll('archives') as unknown as File[];
        const conversationId = body.get('conversationId') as unknown as string;
        const fileUploadEvent = body.get('fileUploadEvent') as unknown as FileUploadEvent;
        const archives: Archive[] = [];
        console.log(files)

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        for (const file of files) {
            switch (fileUploadEvent) {
                case FileUploadEvent.CONVERSATION:
                    if (!conversationId) return new NextResponse('No conversation id provided', { status: 400 });
                    archives.push(await archiveConversationDoc(file, conversationId, currentUser.id));
                    break;
                case FileUploadEvent.USER_AVATAR:
                    archives.push(await archiveUserAvatar(file, currentUser.id));
                    break;
                default:
                    return new NextResponse('Upload event unsupported.', { status: 500 });
            }
        }

        return NextResponse.json(archives, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error: ' + error, { status: 500 });
    }
}
