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
    const existingVerifier = await prisma.verifier.findUnique({
      where: { walletAddress },
    });

    if (existingVerifier) {
      return new Response(
        JSON.stringify({ message: "Verifier already exists" }),
        { status: 400 }
      );
    }

    // Create new verifier
    const newVerifier = await prisma.verifier.create({
      data: {
        walletAddress,
        organizationType,
      },
    });

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Issuer registered successfully",
        issuerId: newVerifier.id,
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
