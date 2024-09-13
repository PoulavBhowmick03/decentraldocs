export const runtime = 'node';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { documentId } = body;

    // Simulate AI verification process (optional)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update the document status in the database
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        isVerified: true,
      },
    });

    return new Response(JSON.stringify({ success: true, message: "Document verified successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error verifying document:", error);
    return new Response(JSON.stringify({ success: false, message: `Error during verification: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
