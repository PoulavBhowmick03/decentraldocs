import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConnectWallet from "./ConnectWallet";
import useWallet from "@/hooks/useWallet";
import Link from "next/link";

export default function IssuerRegistrationForm({ onSubmit }) {
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
          <select
            value={settings.language}
            onChange={handleLanguageChange}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
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
            <div className="text-primary">Already have an account? Login</div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
