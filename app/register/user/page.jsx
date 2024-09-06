"use client";
import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";

export default function UserRegistration() {
  const contract = useContract();
  const router = useRouter();
  const { account } = useWallet();

  const onSubmit = async (data) => {
    if (!account) {
      console.error("Wallet not connected");
      return;
    }

    if (!contract) {
      console.error("Contract not connected");
      return;
    }

    try {
      const { email, organizationName } = data;
      const submissionData = {
        ...data,
        walletAddress: account,
      };

      const tx = await contract.registerUser(email, 1, organizationName);
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("User registered on blockchain");

      const response = await fetch("/api/register/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        router.push("/user");
      } else {
        console.error("Registration failed on backend");
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
