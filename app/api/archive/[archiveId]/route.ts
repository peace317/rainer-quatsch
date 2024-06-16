import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';
import { deleteArchive, readArchive } from '@/services/ArchiveService';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

interface IParams {
    archiveId?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { archiveId } = params;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const archive = await prisma.archive.findUnique({
            where: {
                id: archiveId as string
            }
        });
        console.log(archiveId);
        if (!archive) {
            return new NextResponse('Archive does not exist.', { status: 404 });
        }
        const fileBuffer = await readArchive(new ObjectId(archiveId as string));

        return new NextResponse(fileBuffer, { status: 201, headers: { 'Content-Type': archive.mimetype } });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error: ' + error, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { archiveId } = params;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const archive = await prisma.archive.findUnique({
            where: {
                id: archiveId as string
            }
        });

        if (!archive) {
            return new NextResponse('Archive does not exist.', { status: 404 });
        }

        // delete Metadata reference
        await prisma.archive.delete({
            where: {
                id: archiveId as string
            }
        });

        // find user, if it is his avatar that we delete
        const userAvatar = await prisma.user.findMany({
            where: {
                avatar: archiveId as string
            }
        });

        if (userAvatar.length > 1)
            throw new Error("Found multiple users with the same avatar id. This should not happen.")

        // update users avatar
        if (userAvatar.length === 1) {
            await prisma.user.update({
                where: {
                    id: userAvatar[0].id
                },
                data: {
                    avatar: null
                }
            });
        }

        // delete file
        await deleteArchive(archive);

        return new NextResponse('success', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error: ' + error, { status: 500 });
    }
}
