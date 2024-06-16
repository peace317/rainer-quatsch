import { FullConfig } from '@playwright/test';
import { getDb } from '@/libs/dbcon';
import { UserRole } from '@prisma/client';
import { genSalt, hashSync } from 'bcryptjs';
import { ADMIN, CONVERSATION, USER } from './constants';
import { UserFactory } from './UserFactory';
import { ConversationFactory } from './ConversationFactory';

async function globalSetup(_config: FullConfig) {
    
    const conn = await getDb();
    await conn.dropDatabase();

    const salt = await genSalt(Number.parseInt(process.env.ENCRYPTION_SALT));

    const _admin = await UserFactory.create({
        id: ADMIN.id,
        email: ADMIN.email,
        displayName: ADMIN.displayName,
        username: ADMIN.username,
        userRole: UserRole.ADMIN,
        hashedPassword: hashSync(ADMIN.password, salt)
    });

    const _user = await UserFactory.create({
        id: USER.id,
        email: USER.email,
        displayName: USER.displayName,
        username: USER.username,
        userRole: UserRole.USER,
        hashedPassword: hashSync(USER.password, salt)
    });

    await ConversationFactory.create({
        name: CONVERSATION.name,
        users: {
            connect: [
                {
                    id: _user.id
                },
                {
                    id: _admin.id
                }
            ]
        }
    });
}

export default globalSetup;
