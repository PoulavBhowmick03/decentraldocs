"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useWallet from "@/hooks/useWallet";
import ConnectWallet from "@/components/ConnectWallet";

export default function WalletPage() {
  const [isConnected, setIsConnected] = useState(false);
  const { account, connect, disconnect, switchWallet } = useWallet();
  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="space-y-6 p-10 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold">Connect Wallet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Wallet</CardTitle>
        </CardHeader>
        <ConnectWallet
        account={account}
        connect={connect}
        disconnect={disconnect}
        switchWallet={switchWallet}
      />
      </Card>
    </div>
  );
}
