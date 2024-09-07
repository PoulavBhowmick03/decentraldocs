"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button"; 
import ConnectWallet from "@/components/ConnectWallet";

const organizationTypeToEnum = {
  GOVERNMENT_AGENCY: 0,
  PRIVATE_COMPANY: 1,
  NON_PROFIT: 2,
};

export default function IssuerRegistration() {
  const router = useRouter();
  const contract = useContract();
  const [organizationType, setOrganizationType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { account, connect, disconnect, switchWallet } = useWallet();

  const onSubmit = async () => {
    if (!account) {
      setError("Wallet not connected");
      return;
    }
    if (organizationType === null) {
      setError("Organization Type not selected");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const organizationTypeEnum = organizationTypeToEnum[organizationType];

      // Blockchain interaction
      const tx = await contract.registerIssuer(organizationTypeEnum);
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Issuer registered on blockchain");

      // Backend API call
      const response = await fetch("/api/register/issuer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, organizationType }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/issuer");
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
        <label htmlFor="organizationType" className="text-gray-300">
          Select Organization Type
        </label>

        <Select
          onValueChange={(value) => setOrganizationType(value)}
        >
          <SelectTrigger className="border border-gray-300 p-2 rounded">
            <SelectValue placeholder="Choose organization type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GOVERNMENT_AGENCY">Government Agency</SelectItem>
            <SelectItem value="PRIVATE_COMPANY">Private Company</SelectItem>
            <SelectItem value="NON_PROFIT">Non-Profit</SelectItem>
          </SelectContent>
        </Select>
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
          disabled={loading || !account || organizationType === null}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register as Issuer"}
        </Button>
      </div>
    </div>
  );
}