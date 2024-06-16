import { FullConfig } from '@playwright/test';

import prisma from '@/libs/prismadb';


async function globalTeardown(_config: FullConfig) {

}

export default globalTeardown;
