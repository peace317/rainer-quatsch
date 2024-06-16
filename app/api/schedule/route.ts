import getCurrentUser from '@/actions/getCurrentUser';
import { emitNewConversation } from '@/actions/trigger';
import prisma from '@/libs/prismadb';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const userId = request.nextUrl.searchParams.get('userId');

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const scheduleUserId: string = userId || currentUser.id;

        const scheduleEntries = await prisma.schedule.findMany({
            where: {
                participantIds: { has: scheduleUserId }
            }
        });

        return NextResponse.json(scheduleEntries, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error: ' + error, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { title, startDate, endDate, participants, scheduleInformation } = body;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const schedule = await prisma.schedule.create({
            data: {
                creatorId: currentUser.id,
                title: title || '',
                start: startDate,
                end: endDate,
                scheduleInformation: scheduleInformation || '',
                participants: {
                    connect: [
                        ...participants.map((participant: User) => ({
                            id: participant.id
                        })),
                        {
                            id: currentUser.id
                        }
                    ]
                }
            },
            include: {
                participants: true
            }
        });

        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error: ' + error, { status: 500 });
    }
}
