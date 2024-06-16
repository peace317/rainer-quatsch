'use Server';
import z from 'zod';

const environmentVariables = z.object({
    DATABASE_URL: z.string().url(),
    DATABASE_SCHEMA: z.string(),
    NEXTAUTH_SECRET: z.string(),
    ENCRYPTION_SALT: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: 'Expected number, received a string'
    }),
    ENV_HOST: z.string(),
    ENV_PORT: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: 'Expected number, received a string'
    }),
    ENV_URL: z.string().url(),
    WEBSOCKET_PORT: z.string().optional().refine((val) => !Number.isNaN(parseInt(val || "0", 10)), {
        message: 'Expected number, received a string'
    }),
    SESSION_MAX_AGE: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: 'Expected number, received a string'
    }),
    WEBSOCKET_HOST: z.string().optional(),
    WEBSOCKET_TOKEN: z.string(),
    NEXT_PUBLIC_API_ARCHIVE: z.string().optional(),
    NEXT_PUBLIC_API_CALL: z.string().optional(),
    NEXT_PUBLIC_API_MESSAGES: z.string().optional(),
    NEXT_PUBLIC_API_REGISTER: z.string().optional(),
    NEXT_PUBLIC_API_SCHEDULE: z.string().optional(),
    NEXT_PUBLIC_API_CONVERSATION: z.string().optional(),
    NEXT_PUBLIC_API_MESSAGE_SEEN: z.string().optional(),
});

const parsedResults = environmentVariables.safeParse(process.env);

if (!parsedResults.success) {
    console.error(parsedResults.error);
    throw new Error("Environment variables don't match the schema.", parsedResults.error);
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof environmentVariables> {}
    }
}
