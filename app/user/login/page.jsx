"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useWallet from "@/hooks/useWallet";
import ConnectWallet from "@/components/ConnectWallet";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [authenticated, setAuthenticated] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { account, connect, disconnect, switchWallet } = useWallet();

  useEffect(() => {
    if (authenticated) {
      router.push('/user');
    }
  }, [authenticated, router]);

  const onSubmit = async (data) => {
    const submissionData = {
      ...data,
      walletAddress: account,
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        setAuthenticated(true);
        console.log("Login successful, token:", token);
        router.push("/user");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  if (authenticated) {
    return null; // Or you could return a loading indicator here
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <ConnectWallet
            account={account}
            connect={connect}
            disconnect={disconnect}
            switchWallet={switchWallet}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}