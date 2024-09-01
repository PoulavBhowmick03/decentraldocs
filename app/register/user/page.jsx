"use client";
import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";

export default function UserRegistration() {
  const router = useRouter();
  const { account } = useWallet();

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

      const response = await fetch("/api/register/user", {
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
      <RegistrationForm accountType="user" onSubmit={onSubmit} />
    </div>
  );
}
