import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const { email, organizationName, walletAddress } = await request.json();

    if (!email || !walletAddress || !organizationName) {
      return new Response(
        JSON.stringify({
          message: "Email, Wallet Address, and Organization Name are required",
        }),
        { status: 400 }
      );
    }
    // Check if issuer already exists
    const existingIssuer = await prisma.user.findUnique({ where: { email } });
    if (existingIssuer) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    // Create new issuer
    const newIssuer = await prisma.issuer.create({
      data: {
        email,
        walletAddress,
        organizationName,
        role: "ISSUING_AUTHORITY",
      },
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        userId: newIssuer.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
