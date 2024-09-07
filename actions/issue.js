"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function issueDocument(data) {
  try {
    // Step 1: Find or create the issuer
    let issuer = await prisma.user.findUnique({
      where: { walletAddress: data.issuerId },
      include: { issuer: true },
    });

    if (!issuer) {
      // Create a new User if not found
      issuer = await prisma.user.create({
        data: {
          walletAddress: data.issuerId,
          email: `${data.issuerId}@placeholder.com`, // You might want to handle this differently
          role: "ISSUING_AUTHORITY",
          issuer: {
            create: {
              organizationName: "Default Organization", // You might want to handle this differently
              organizationType: "OTHER",
            },
          },
        },
        include: { issuer: true },
      });
    } else if (!issuer.issuer) {
      // If User exists but Issuer doesn't, create Issuer
      await prisma.issuer.create({
        data: {
          userId: issuer.id,
          organizationName: "Default Organization", // You might want to handle this differently
          organizationType: "OTHER",
        },
      });
      issuer = await prisma.user.findUnique({
        where: { id: issuer.id },
        include: { issuer: true },
      });
    }

    // Step 2: Find or create the owner
    let owner = await prisma.user.findUnique({
      where: { walletAddress: data.ownerId },
    });

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          walletAddress: data.ownerId,
          email: `${data.ownerId}@placeholder.com`, // You might want to handle this differently
          role: "INDIVIDUAL",
        },
      });
    }

    // Step 3: Find or create the verifier (if provided)
    let verifier = null;
    if (data.verifierId) {
      verifier = await prisma.user.findUnique({
        where: { walletAddress: data.verifierId },
        include: { verifier: true },
      });

      if (!verifier) {
        verifier = await prisma.user.create({
          data: {
            walletAddress: data.verifierId,
            email: `${data.verifierId}@placeholder.com`, // You might want to handle this differently
            role: "VERIFYING_AUTHORITY",
            verifier: {
              create: {
                organizationName: "Default Verifier", // You might want to handle this differently
                organizationType: "OTHER",
              },
            },
          },
          include: { verifier: true },
        });
      } else if (!verifier.verifier) {
        await prisma.verifier.create({
          data: {
            userId: verifier.id,
            organizationName: "Default Verifier", // You might want to handle this differently
            organizationType: "OTHER",
          },
        });
        verifier = await prisma.user.findUnique({
          where: { id: verifier.id },
          include: { verifier: true },
        });
      }
    }

    // Step 4: Create the document in the database
    const document = await prisma.document.create({
      data: {
        blockchainHash: data.blockchainHash,
        owner: { connect: { id: owner.id } },
        issuer: { connect: { id: issuer.issuer.id } },
        verifier: verifier ? { connect: { id: verifier.verifier.id } } : undefined,
        description: data.description,
        name: data.name,
        type: data.type || "OTHER",
        issuedAt: new Date(),
      },
    });

    return {
      success: true,
      document: document,
    };
  } catch (error) {
    console.error("Error issuing document:", error);
    return { success: false, message: error.message || "Error issuing document" };
  }
}