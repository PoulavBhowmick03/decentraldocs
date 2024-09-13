import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const { walletAddress, organizationType } = await request.json();

    console.log("Received data:", { walletAddress, organizationType });

    if (!walletAddress || !organizationType) {
      return new Response(
        JSON.stringify({
          message: "Wallet Address and Organization Type are required",
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
            role: "ISSUING_AUTHORITY",
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

    // Check if issuer already exists
    try {
      const existingIssuer = await prisma.issuer.findUnique({
        where: { userId: user.id },
      });
      
      if (existingIssuer) {
        return new Response(
          JSON.stringify({ message: "Issuer already exists" }),
          { status: 400 }
        );
      }
    } catch (issuerCheckError) {
      console.error("Error checking existing issuer:", issuerCheckError);
      return new Response(
        JSON.stringify({ message: "Error checking existing issuer", error: issuerCheckError.message }),
        { status: 500 }
      );
    }

    // Create new issuer
    try {
      const newIssuer = await prisma.issuer.create({
        data: {
          userId: user.id,
          organizationName: "Default Organization", // You might want to add this to the frontend form
          organizationType,
        },
      });

      return new Response(
        JSON.stringify({
          message: "Issuer registered successfully",
          issuerId: newIssuer.id,
        }),
        { status: 201 }
      );
    } catch (issuerCreateError) {
      console.error("Error creating new issuer:", issuerCreateError);
      return new Response(
        JSON.stringify({ message: "Error creating new issuer", error: issuerCreateError.message }),
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