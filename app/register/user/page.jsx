"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Building, AlertCircle } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/UseContract";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import ConnectWallet from "@/components/ConnectWallet";

export default function UserRegistration() {
  const router = useRouter();
  const contract = useContract();
  const { account, connect, disconnect, switchWallet } = useWallet();
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!contract) {
      toast.error("Contract not connected");
      return;
    }
    if (!email || !organizationName) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const submissionData = {
        email,
        walletAddress: account,
        organizationName,
      };

      // Blockchain interaction
      const tx = await contract.registerUser(email, 1, organizationName);
      toast.loading("Registering on blockchain...");
      await tx.wait();
      toast.success("Registered on blockchain");

      // Backend API call
      const response = await fetch("/api/register/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        toast.success("Registration successful!");
        router.push("/user");
      } else {
        const errorData = await response.json();
        toast.error(`Registration failed: ${errorData.message}`);
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
          Register as a User
        </motion.h1>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Enter your details to register</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
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
              disabled={loading || !account}
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