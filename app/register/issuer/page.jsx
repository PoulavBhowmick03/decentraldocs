"use client";
import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";

export default function IssuerRegistration() {
  const router = useRouter();
  const { account } = useWallet();
  const contract = useContract();

  const additionalFields = [
    {
      name: "organizationName",
      label: "Organization Name",
      type: "text",
      validation: { required: "Organization name is required" },
    },
  ];

  const onSubmit = async (data) => {
    if (!account) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const { email, organizationName } = data; // Extract email and org name directly

      const submissionData = {
        ...data,
        walletAddress: account, // Add the wallet address to the submission data
      };
      // Interact with the contract to register the user
      const tx = await contract.registerIssuer(
        email,
        2, // Replace with correct user type if necessary
        organizationName
      );
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Issuer registered on blockchain");

      const response = await fetch("/api/register/issuer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),  // Send submission data to API
      });

      if (response.ok) {
        router.push("/issuer");
      } else {
        // Handle error
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <RegistrationForm
        accountType="issuer"
        onSubmit={onSubmit}
        additionalFields={additionalFields}
      />
    </div>
  );
}
