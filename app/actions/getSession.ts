import { authOptions } from "@/libs/auth";
import { isServer } from "@/util/js-helper";
import { getServerSession } from "next-auth";
import { getSession as getClientSession } from "next-auth/react";

export default async function getSession() {
    if (isServer()) {
        return  await getServerSession(authOptions);
    } else {
        return await getClientSession();
    }
}