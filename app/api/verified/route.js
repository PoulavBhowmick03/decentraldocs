// api/verified/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const documentId = url.searchParams.get('id');

    if (!documentId) {
      return new Response('Document ID is required', { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { isVerified: true },
    });

    if (!document) {
      return new Response('Document not found', { status: 404 });
    }

    return new Response(JSON.stringify({ isVerified: document.isVerified }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching document verification status:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
