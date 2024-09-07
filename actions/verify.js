import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyDocument(documentId) {
  try {
    // Simulate AI verification process
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay

    // Update the document status in the database
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        isVerified: true,
      },
    });

    if (updatedDocument) {
      return { success: true, verified: true, message: "Document verified successfully" };
    } else {
      return { success: false, message: "Failed to update document status" };
    }
  } catch (error) {
    console.error("Error verifying document:", error);
    return { success: false, message: `Error during document verification: ${error.message}` };
  }
}