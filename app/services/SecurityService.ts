import { Competence, UserRole } from '@prisma/client';
import prisma from '@/libs/prismadb';

export const grantPermission = async (userRole: UserRole, competence: Competence, dynamicAttribute: string | null) => {
    const permission = await prisma.permissionMatrix.findFirst({
        where: {
            permissionRole: userRole,
            competence,
            dynamicAttribute
        }
    });

    return permission?.authFlag || false;
};
