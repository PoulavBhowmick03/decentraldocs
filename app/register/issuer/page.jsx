"use client";
import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";

export default function IssuerRegistration() {
  const router = useRouter();
  const { account } = useWallet();

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
      const submissionData = {
        ...data,
        walletAddress: account, // Add the wallet address to the submission data
      };

      const response = await fetch("/api/register/issuer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        router.push("/login");
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
