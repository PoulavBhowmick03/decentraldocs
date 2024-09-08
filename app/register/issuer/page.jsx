"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building, CheckSquare, AlertCircle } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import ConnectWallet from "@/components/ConnectWallet";

const organizationTypeToEnum = {
  GOVERNMENT_AGENCY: 0,
  PRIVATE_COMPANY: 1,
  NON_PROFIT: 2,
};

const organizationTypes = [
  { value: "GOVERNMENT_AGENCY", label: "Government Agency", icon: Building },
  { value: "PRIVATE_COMPANY", label: "Private Company", icon: Building },
  { value: "NON_PROFIT", label: "Non-Profit Organization", icon: CheckSquare },
];

export default function IssuerRegistration() {
  const router = useRouter();
  const contract = useContract();
  const [organizationType, setOrganizationType] = useState(null);
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

  const onSubmit = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (organizationType === null) {
      toast.error("Please select an organization type");
      return;
    }

    try {
      setLoading(true);

      const organizationTypeEnum = organizationTypeToEnum[organizationType];

      // Blockchain interaction
      const tx = await contract.registerIssuer(organizationTypeEnum);
      toast.loading("Registering on blockchain...");
      await tx.wait();
      toast.success("Registered on blockchain");

      // Backend API call
      const response = await fetch("/api/register/issuer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, organizationType }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        router.push("/issuer");
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
          Register as an Issuer
        </motion.h1>
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Organization Type</CardTitle>
              <CardDescription>Choose the type that best describes your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) => setOrganizationType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map(({ value, label, icon: Icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            onClick={onSubmit}
            disabled={loading || !account || organizationType === null}
            className="w-full"
          >
            {loading ? "Registering..." : "Complete Registration"}
          </Button>

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