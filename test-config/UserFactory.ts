import { genSalt, hashSync } from 'bcryptjs';
import Chance from "chance";
import { Prisma, UserRole } from '@prisma/client';
import prisma from '@/libs/prismadb'

type FactoryUpsertArgs = {
    where: Prisma.UserUpsertArgs['where'];
    createArgs: Partial<Prisma.UserUpsertArgs['create']>;
    updateArgs: Prisma.UserUpsertArgs['update'];
    select?: Prisma.UserUpsertArgs['select'];
};

const chance = new Chance();

export const UserFactory = {
    build: (args: Partial<Prisma.UserCreateArgs['data']> = {}, select: Prisma.UserCreateArgs['select'] = {id: true}) => {
        return {
            data: {
                email: chance.email(),
                userRole: UserRole.USER,
                username: chance.name(),
                displayName: chance.name(),
                hashedPassword: args.hashedPassword || '',
                ...args,
            },
            select
        };
    },

    create: async (args: Partial<Prisma.UserCreateArgs['data']> = {}, select: Prisma.UserCreateArgs['select'] = null) => {
        const userArgs = UserFactory.build(args, select);

        const user = await prisma.user.create(userArgs);
        return user;
    },

    upsert: async ({ where, createArgs = {}, updateArgs = {}, select = null }: FactoryUpsertArgs) => {
        // Grab Build Defaults for Create
        const userArgs = UserFactory.build(createArgs, select);
        const password = updateArgs.hashedPassword ? hashSync(updateArgs.hashedPassword as string, process.env.ENCRYPTION_SALT) : undefined;

        return await prisma.user.upsert({
            where,
            create: userArgs.data,
            select: userArgs.select,
            update: { ...updateArgs, hashedPassword: password }
        });
    }
};
