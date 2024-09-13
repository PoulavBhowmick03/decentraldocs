export const runtime = 'node';
import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const { walletAddress, organizationType, organizationName } = await request.json();

    console.log("Received data:", { walletAddress, organizationType, organizationName });

    if (!walletAddress || !organizationType || !organizationName) {
      return new Response(
        JSON.stringify({
          message: "Wallet Address, Organization Type, and Organization Name are required",
        }),
        { status: 400 }
      );
    }

    // Check if user already exists
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!user) {
        // Create new user if not exists
        user = await prisma.user.create({
          data: {
            walletAddress,
            email: `${walletAddress}@example.com`, // Placeholder email
            role: "VERIFYING_AUTHORITY",
          },
        });
      }
    } catch (userError) {
      console.error("Error in user operations:", userError);
      return new Response(
        JSON.stringify({ message: "Error in user operations", error: userError.message }),
        { status: 500 }
      );
    }

    // Check if verifier already exists
    try {
      const existingVerifier = await prisma.verifier.findUnique({
        where: { userId: user.id },
      });
      
      if (existingVerifier) {
        return new Response(
          JSON.stringify({ message: "Verifier already exists" }),
          { status: 400 }
        );
      }
    } catch (verifierCheckError) {
      console.error("Error checking existing verifier:", verifierCheckError);
      return new Response(
        JSON.stringify({ message: "Error checking existing verifier", error: verifierCheckError.message }),
        { status: 500 }
      );
    }

    // Create new verifier
    try {
      const newVerifier = await prisma.verifier.create({
        data: {
          userId: user.id,
          organizationName,
          organizationType,
        },
      });

      return new Response(
        JSON.stringify({
          message: "Verifier registered successfully",
          verifierId: newVerifier.id,
        }),
        { status: 201 }
      );
    } catch (verifierCreateError) {
      console.error("Error creating new verifier:", verifierCreateError);
      return new Response(
        JSON.stringify({ message: "Error creating new verifier", error: verifierCreateError.message }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in registration process:", error);
    return new Response(
      JSON.stringify({ message: "Unexpected error in registration process", error: error.message }),
      { status: 500 }
    );
  }
}
