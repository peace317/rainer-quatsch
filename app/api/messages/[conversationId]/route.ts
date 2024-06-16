import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import getCurrentUser from '@/actions/getCurrentUser';

interface IParams {
  conversationId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const messages = await prisma.message.findMany({
      where: {
          conversationId: params.conversationId
      },
      include: {
          sender: true,
          seen: true
      },
      orderBy: {
          createdAt: 'asc'
      }
  });

    return NextResponse.json(messages)
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
