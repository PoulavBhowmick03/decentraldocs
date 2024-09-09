"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAccountType(address) {
    try {
        const user = await prisma.user.findUnique({
            where: { walletAddress: address },
        })

        if (user.role === 'INDIVIDUAL') {
            return 0
        } else if (user.role === 'ISSUING_AUTHORITY') {
            return 1
        } else if (user.role === 'VERIFYING_AUTHORITY') {
            return 2
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}