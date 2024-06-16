import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { getDb } from '@/libs/dbcon';
import prisma from '../libs/prismadb';
import { Archive } from '@prisma/client';
import { emitConversationUpdate, emitConversationUpdateForUser } from '@/actions/trigger';

export const storeArchive = async (file: File) => {
    const db = await getDb();

    const gfs = new GridFSBucket(db, {
        bucketName: getBucketName()
    });
    const dateiStream = gfs.openUploadStream(file.name, {
        metadata: { contentType: file.type }
    });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });
    stream.pipe(dateiStream);
    return dateiStream.id;
};

export const readArchive = async (archiveId: ObjectId) => {
    const db = await getDb();
    const gfs = new GridFSBucket(db, {
        bucketName: 'archive'
    });
    return new Promise<Buffer>((resolve, reject) => {
        const stream = gfs.openDownloadStream(archiveId);
        let buffer = Buffer.from('');

        stream.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
        });

        stream.on('error', (error) => {
            reject(error);
        });

        stream.on('end', () => {
            resolve(buffer);
        });
    });
};

export const deleteArchive = async (archive: Archive) => {
    const db = await getDb();

    const gfs = new GridFSBucket(db, {
        bucketName: getBucketName()
    });

    await gfs.delete(new ObjectId(archive.id));
};

const getBucketName = () => {
    return 'archive';
};

export const archiveConversationDoc = async (file: File, conversationId: string, userId: string): Promise<Archive> => {
    const id = await storeArchive(file);

    const archive = await prisma.archive.create({
        data: {
            id: id.toString(),
            filename: file.name,
            mimetype: file.type,
            conversation: {
                connect: {
                    id: conversationId
                }
            },
            uploader: {
                connect: {
                    id: userId
                }
            }
        },
        include: {
            uploader: true,
            conversation: true
        }
    });

    if (!archive.conversation) {
        throw new Error("Conversation is undefined, but an archive was attached to one.");
    }

    emitConversationUpdateForUser(archive.uploader.id, archive.conversation);

    return archive;
};

export const archiveUserAvatar = async (file: File, userId: string): Promise<Archive> => {
    const id = await storeArchive(file);
    const archive = await prisma.archive.create({
        data: {
            id: id.toString(),
            filename: file.name,
            mimetype: file.type,
            uploader: {
                connect: {
                    id: userId
                }
            }
        },
        include: {
            uploader: true
        }
    });

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            avatar: archive.id
        }
    });

    return archive;
};
