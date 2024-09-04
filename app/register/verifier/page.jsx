"use client";
import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";

export default function VerifierRegistration() {
  const router = useRouter();
  const { account } = useWallet();

  const additionalFields = [
    {
      name: "organizationName",
      label: "Organization Name",
      type: "text",
      validation: { required: "Organization name is required" },
    },
    {
      name: "organizationType",
      label: "Organization Type",
      type: "select",
      options: [
        { value: "GOVERNMENT_OFFICE", label: "Government Office" },
        { value: "BANK", label: "Bank" },
        { value: "LEGAL_ENTITY", label: "Legal Entity" },
        { value: "EDUCATIONAL_INSTITUTION", label: "Educational Institution" },
        { value: "CORPORATE_ENTITY", label: "Corporate Entity" },
        { value: "OTHER", label: "Other" },
      ],
      defaultValue: "",
      onChange: (value) => console.log(value),
    },
    {
      name: "licenseNumber",
      label: "License Number",
      type: "text",
      validation: { required: "License number is required" },
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

      const response = await fetch("/api/register/verifier", {
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
        accountType="verifier"
        onSubmit={onSubmit}
        additionalFields={additionalFields}
      />
    </div>
  );
}
