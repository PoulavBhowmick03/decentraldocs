export const runtime = 'node';
import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const { email, walletAddress, organizationName } = await request.json();

    if (!email || !walletAddress || !organizationName) {
      return new Response(
        JSON.stringify({
          message: "Email, Wallet Address, and Organization Name are required",
        }),
        { status: 400 }
      );
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        walletAddress,
        organizationName,
        role: "INDIVIDUAL",
      },
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        userId: newUser.id,
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
