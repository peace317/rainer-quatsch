import { Prisma } from "@prisma/client";
import Chance from "chance";
import prisma from '@/libs/prismadb'

type FactoryUpsertArgs = {
    where: Prisma.ConversationUpsertArgs['where'];
    createArgs: Partial<Prisma.ConversationUpsertArgs['create']>;
    updateArgs: Prisma.ConversationUpsertArgs['update'];
    select?: Prisma.ConversationUpsertArgs['select'];
};

const chance = new Chance();

export const ConversationFactory = {
    build: (args: Partial<Prisma.ConversationCreateArgs['data']> = {}, select: Prisma.ConversationCreateArgs['select'] = {id: true}) => {
        
        return {
            data: {
                name: chance.name(),
                ...args
            },
            select
        };
    },

    create: async (args: Partial<Prisma.ConversationCreateArgs['data']> = {}, select: Prisma.ConversationCreateArgs['select'] = null) => {
        const userArgs = ConversationFactory.build(args, select);

        const conversation = await prisma.conversation.create(userArgs);
        return conversation;
    },

    upsert: async ({ where, createArgs = {}, updateArgs = {}, select = null }: FactoryUpsertArgs) => {
        // Grab Build Defaults for Create
        const conversationArgs = ConversationFactory.build(createArgs, select);

        return await prisma.conversation.upsert({
            where,
            create: conversationArgs.data,
            select: conversationArgs.select,
            update: { ...updateArgs }
        });
    }
};
