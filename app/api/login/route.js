import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, walletAddress } = await request.json();

    // Validate input
    if (!email || !walletAddress) {
      return new Response(JSON.stringify({ message: "Email and walletAddress are required" }), { status: 400 });
    }

    // Find user by Wallet Address
    const user = await prisma.user.findUnique({ where: { walletAddress } });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, walletAddress: user.walletAddress, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
