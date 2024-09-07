"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function issueDocument(data) {
  console.log("Received data in issueDocument:", data);
  try {
    const { blockchainHash, ownerId, issuerId, verifierId, description, name } = data;

    // First, ensure the issuer exists
    const issuer = await prisma.issuer.findUnique({
      where: { userId: issuerId },
    });

    if (!issuer) {
      return { success: false, message: "Issuer not found" };
    }

    const newDoc = await prisma.document.create({
      data: {
        name,
        description,
        blockchainHash,
        ownerId,
        issuerId: issuer.userId,
        verifierId,
      }
    });

    console.log("Document added to db:", newDoc);
    return { success: true, message: "Document issued successfully", document: newDoc };
  } catch (e) {
    console.error("Error in issueDocument:", e);
    return { success: false, message: e.message };
  }
}