import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const { walletAddress, organizationType } = await request.json();

    // Validate input
    if (!walletAddress || organizationType === undefined) {
      return new Response(
        JSON.stringify({
          message: "Wallet Address and Organization Type are required",
        }),
        { status: 400 }
      );
    }

    // Check if issuer already exists in the issuer table
    const existingIssuer = await prisma.issuer.findUnique({
      where: { walletAddress },
    });

    if (existingIssuer) {
      return new Response(
        JSON.stringify({ message: "Issuer already exists" }),
        { status: 400 }
      );
    }

    // Create new issuer
    const newIssuer = await prisma.issuer.create({
      data: {
        walletAddress,
        organizationType,
      },
    });

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Issuer registered successfully",
        issuerId: newIssuer.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
