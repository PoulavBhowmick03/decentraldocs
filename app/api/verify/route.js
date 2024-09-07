import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(request) {
  const { documentId, verifierAddress } = await request.json();

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { issuer: true, owner: true },
    });

    if (!document) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    const verifier = await prisma.verifier.findFirst({
      where: { userId: verifierAddress },
    });

    if (!verifier) {
      return NextResponse.json({ success: false, message: "Verifier not found" }, { status: 404 });
    }

    // Call the prediction API
    const predictionData = {
      blockchainHash: document.blockchainHash,
      issuerAddress: document.issuer.userId,
      ownerAddress: document.owner.id,
      verifierAddress: verifier.userId,
      issueDate: document.issuedAt.toISOString(),
    };

    const predictionResponse = await axios.post("http://localhost:5000/predict", predictionData);

    if (!predictionResponse.data.outlier) {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          verifierId: verifier.id,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: "Document verified successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Anomaly detected in the document" });
    }
  } catch (error) {
    console.error("Error in document verification:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}