import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConnectWallet from "./ConnectWallet";
import useWallet from "@/hooks/useWallet";
import Link from "next/link";

export default function RegistrationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { account, connect, disconnect, switchWallet } = useWallet();

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      walletAddress: account,
    };
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Organization Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              {...register("organizationName", {
                required: "Organization name is required",
              })}
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm">
                {errors.organizationName.message}
              </p>
            )}
          </div>

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

          <Button type="submit" className="w-full mt-4">
            Register
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link href="/login">
            <a className="text-primary">Already have an account? Login</a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
