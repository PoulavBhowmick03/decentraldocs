export const runtime = 'node';

import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get('account');

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { issuerId: account },
          { ownerId: account },
        ],
      },
      include: {
        issuer: true,
        owner: true,
        verifier: true,
      },
    });

    return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}