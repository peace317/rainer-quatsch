import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import getCurrentUser from '@/actions/getCurrentUser';
import { grantPermission } from '@/services/SecurityService';
import { PermissionMatrix } from '@prisma/client';

interface IParams {
  conversationId?: string;
}

export async function POST(
  request: Request
) {
  try {
    /*
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }*/
    
    const body = await request.json()
    console.log(body)
    const { permissionRole: userRole, competence, dynamicAttribute } = body;

    const auth = await grantPermission(userRole, competence, dynamicAttribute);

    return NextResponse.json(auth)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 });
  }
}
