"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building, CheckSquare, AlertCircle } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import ConnectWallet from "@/components/ConnectWallet";

const verifierTypeToEnum = {
  GOVERNMENT_OFFICE: 0,
  BANK: 1,
  LEGAL_ENTITY: 2,
  EDUCATIONAL_INSTITUTION: 3,
  CORPORATE_ENTITY: 4,
  OTHER: 5
};

const verifierTypes = [
  { value: "GOVERNMENT_OFFICE", label: "Government Office", icon: Building },
  { value: "BANK", label: "Bank", icon: Building },
  { value: "LEGAL_ENTITY", label: "Legal Entity", icon: Building },
  { value: "EDUCATIONAL_INSTITUTION", label: "Educational Institution", icon: Building },
  { value: "CORPORATE_ENTITY", label: "Corporate Entity", icon: Building },
  { value: "OTHER", label: "Other", icon: CheckSquare },
];

export default function VerifierRegistration() {
  const router = useRouter();
  const contract = useContract();
  const [verifierType, setVerifierType] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const { account, connect, disconnect, switchWallet } = useWallet();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const cardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    in: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (verifierType === null) {
      toast.error("Please select a verifier type");
      return;
    }
    if (!organizationName) {
      toast.error("Please enter your organization name");
      return;
    }

    try {
      setLoading(true);

      const verifierTypeEnum = verifierTypeToEnum[verifierType];

      // Blockchain interaction
      const tx = await contract.registerVerifier(verifierTypeEnum);
      toast.loading("Registering on blockchain...");
      await tx.wait();
      toast.success("Registered on blockchain");

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
        toast.success("Registration successful!");
        router.push("/verifier");
      } else {
        toast.error(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(`Error during registration: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="container mx-auto mt-20 pt-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-8 text-center text-primary"
        >
          Register as a Verifier
        </motion.h1>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Verifier Information</CardTitle>
                <CardDescription>Select your verifier type and enter your organization name</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  onValueChange={(value) => setVerifierType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose verifier type" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifierTypes.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Building className="text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Organization Name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Connect Wallet</CardTitle>
                <CardDescription>Connect your wallet to complete registration</CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectWallet
                  account={account}
                  connect={connect}
                  disconnect={disconnect}
                  switchWallet={switchWallet}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={loading || !account || verifierType === null || !organizationName}
              className="w-full"
            >
              {loading ? "Registering..." : "Complete Registration"}
            </Button>
          </form>

          {!account && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-yellow-100 rounded-md flex items-center"
            >
              <AlertCircle className="text-yellow-500 mr-2" />
              <p className="text-sm text-yellow-700">Please connect your wallet to complete registration.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  );
}