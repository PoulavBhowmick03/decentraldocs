"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button"; 
import ConnectWallet from "@/components/ConnectWallet";

export default function IssuerRegistration() {
  const router = useRouter();
  const contract = useContract();
  const [organizationType, setOrganizationType] = useState(null); 
  const [loading, setLoading] = useState(false);
  const { account, connect, disconnect, switchWallet } = useWallet();

  const onSubmit = async () => {
    if (!account) {
      console.error("Wallet not connected");
      return;
    }
    if (!organizationType) {
      console.error("Organization Type not selected");
      return;
    }

    try {
      setLoading(true);
      
      const tx = await contract.registerIssuer(organizationType);
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Issuer registered on blockchain");

      const response = await fetch("/api/register/issuer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, organizationType }),
      });

      if (response.ok) {
        router.push("/issuer");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      {/* Organization Type Select */}
      <div className="flex flex-col space-y-4">
        <label htmlFor="organizationType" className="text-gray-300">
          Select Organization Type
        </label>

        <Select
          onValueChange={(value) => setOrganizationType(parseInt(value))} // Set the selected value
        >
          <SelectTrigger className="border border-gray-300 p-2 rounded">
            <SelectValue placeholder="Choose organization type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Government</SelectItem> {/* Enum value 0 */}
            <SelectItem value="1">Private</SelectItem> {/* Enum value 1 */}
            <SelectItem value="2">Non-Profit</SelectItem> {/* Enum value 2 */}
          </SelectContent>
        </Select>
      </div>
      <ConnectWallet
            account={account}
            connect={connect}
            disconnect={disconnect}
            switchWallet={switchWallet}
          />

      {/* Submit Button */}
      <div className="mt-6">
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Registering..." : "Register as Issuer"}
        </Button>
      </div>
    </div>
  );
}
