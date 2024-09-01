"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletPage() {
  const [isConnected, setIsConnected] = useState(false);

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
        <CardContent>
          {isConnected ? (
            <div>
              <p className="text-green-500 mb-4">Wallet Connected</p>
              <p>Address: 0x1234...5678</p>
              <Button onClick={() => setIsConnected(false)} className="mt-4">
                Disconnect
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                Connect your wallet to securely store and manage your digital
                certificates on the blockchain.
              </p>
              <Button onClick={handleConnect}>Connect Wallet</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
