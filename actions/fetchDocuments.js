// actions/fetchDocuments.js
"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchIssuedDocuments(issuerWalletAddress) {
  try {
    const issuer = await prisma.user.findUnique({
      where: { walletAddress: issuerWalletAddress },
      include: { issuer: true },
    });

    if (!issuer || !issuer.issuer) {
      return { success: false, message: "Issuer not found" };
    }

    const documents = await prisma.document.findMany({
      where: { issuerId: issuer.issuer.id },
      include: {
        owner: true,
        verifier: {
          include: { user: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return {
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        issueDate: doc.issuedAt.toISOString(),
        status: doc.verifier ? 'Verified' : 'Pending',
        ownerAddress: doc.owner.walletAddress,
        verifierAddress: doc.verifier?.user.walletAddress || 'Not assigned',
        blockchainHash: doc.blockchainHash,
        isVerified: doc.isVerified,
      })),
    };
  } catch (error) {
    console.error("Error fetching issued documents:", error);
    return { success: false, message: "Error fetching documents" };
  }
}