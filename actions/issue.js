"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function issueDocument(data, res) {
  try {
    const {  blockchainHash, ownerId, issuerId, verifierId } = data;
    const {  description, name } = res

    const newDoc = await prisma.document.create({
      data: {
        name,
        description,
        // issuedAt: new Date(issuedAt),
        blockchainHash,
        ownerId,
        issuerId,
        verifierId,
        // verifier,
        // certificate_type
      }
    });

    console.log("Doc added to db");
    return 200;
  } catch (e) {
    console.log("error:", e);
    return 500;
  }
}
