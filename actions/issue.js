"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function issueDocument(info) {
  try {
    const { title, content, issuedAt, blockchainHash, ownerId, issuerId, type } = info;

    const newDoc = await prisma.document.create({
      data: {
        title,
        content,
        issuedAt: new Date(issuedAt),
        blockchainHash,
        ownerId,
        issuerId,
        type
      }
    });

    console.log("Doc added to db");
    return 200;
  } catch (e) {
    console.log("error:", e);
    return 500;
  }
}
