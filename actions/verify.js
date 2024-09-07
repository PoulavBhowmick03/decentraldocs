"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function verifyDocument(data) {
    try {
        const {title, content, issuedAt, blockchainHash, ownerId, issuerId, type} = data;

        

        return 200
    } catch (e) {
        return 500
    }
}