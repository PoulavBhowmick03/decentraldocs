"use server";

import axios from 'axios';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyDocument(documentId, verifierAddress) {
  try {
    // Fetch the document from the database
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        issuer: {
          include: { user: true },
        },
        owner: true,
        verifier: {
          include: { user: true },
        },
      },
    });

    if (!document) {
      return { success: false, message: "Document not found" };
    }

    // Safely access nested properties
    const issuerWalletAddress = document.issuer?.user?.walletAddress;
    const ownerWalletAddress = document.owner?.walletAddress;

    if (!issuerWalletAddress || !ownerWalletAddress) {
      return { success: false, message: "Invalid document data: missing issuer or owner information" };
    }

    // Prepare the data for the Flask API
    const apiData = {
      blockchainHash: document.blockchainHash,
      issuerAddress: issuerWalletAddress,
      ownerAddress: ownerWalletAddress,
      verifierAddress: verifierAddress,
      issueDate: document.issuedAt?.toISOString(),
      // Add any other relevant fields from your document model
    };

    // Make a POST request to the Flask API
    const response = await axios.post("http://localhost:5000/predict", apiData);

    // Check the verification result
    if (response.data.outlier === false) {
      // Update the document status in the database
      await prisma.document.update({
        where: { id: documentId },
        data: {
          verifierId: verifierAddress,
          // Add any other fields you want to update, e.g., status
        },
      });

      return { success: true, verified: true, message: "Document verified successfully" };
    } else {
      return { success: true, verified: false, message: "Document verification failed: Anomaly detected" };
    }
  } catch (error) {
    console.error("Error verifying document:", error);
    return { success: false, message: `Error during document verification: ${error.message}` };
  }
}