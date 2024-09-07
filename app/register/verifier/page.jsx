"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button"; 
import ConnectWallet from "@/components/ConnectWallet";

const verifierTypeToEnum = {
  GOVERNMENT_OFFICE: 0,
  BANK: 1,
  LEGAL_ENTITY: 2,
  EDUCATIONAL_INSTITUTION: 3,
  CORPORATE_ENTITY: 4,
  OTHER: 5
};

export default function VerifierRegistration() {
  const router = useRouter();
  const contract = useContract();
  const [verifierType, setVerifierType] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { account, connect, disconnect, switchWallet } = useWallet();

  const onSubmit = async () => {
    if (!account) {
      setError("Wallet not connected");
      return;
    }
    if (verifierType === null) {
      setError("Verifier Type not selected");
      return;
    }
    if (!organizationName) {
      setError("Organization Name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const verifierTypeEnum = verifierTypeToEnum[verifierType];

      // Blockchain interaction
      const tx = await contract.registerVerifier(verifierTypeEnum);
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Verifier registered on blockchain");

      // Backend API call
      const response = await fetch("/api/register/verifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          walletAddress: account, 
          organizationType: verifierType,
          organizationName: organizationName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/verifier");
      } else {
        setError(`${data.message}: ${data.error || 'Unknown error'}`);
        console.error("Registration failed:", data.message, data.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(`Error during registration: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        <label htmlFor="verifierType" className="text-gray-300">
          Select Verifier Type
        </label>

        <Select
          onValueChange={(value) => setVerifierType(value)}
        >
          <SelectTrigger className="border border-gray-300 p-2 rounded">
            <SelectValue placeholder="Choose verifier type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GOVERNMENT_OFFICE">Government Office</SelectItem>
            <SelectItem value="BANK">Bank</SelectItem>
            <SelectItem value="LEGAL_ENTITY">Legal Entity</SelectItem>
            <SelectItem value="EDUCATIONAL_INSTITUTION">Educational Institution</SelectItem>
            <SelectItem value="CORPORATE_ENTITY">Corporate Entity</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>

        <label htmlFor="organizationName" className="text-gray-300">
          Organization Name
        </label>
        <input
          type="text"
          id="organizationName"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          placeholder="Enter organization name"
        />
      </div>
      <ConnectWallet
        account={account}
        connect={connect}
        disconnect={disconnect}
        switchWallet={switchWallet}
      />

      <div className="mt-6">
        <Button
          onClick={onSubmit}
          disabled={loading || !account || verifierType === null || !organizationName}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register as Verifier"}
        </Button>
      </div>
    </div>
  );
}