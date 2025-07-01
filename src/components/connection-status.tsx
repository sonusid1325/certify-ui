"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletAddress from "@/components/wallet-address";

export default function ConnectionStatus() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [isValidating, setIsValidating] = useState(false);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (!connection) return;

      try {
        setIsValidating(true);
        const height = await connection.getBlockHeight();
        setBlockHeight(height);
      } catch (error) {
        console.error("Connection check failed:", error);
        setBlockHeight(null);
      } finally {
        setIsValidating(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [connection]);

  const getConnectionStatus = () => {
    if (isValidating) return { status: "checking", color: "yellow" };
    if (blockHeight !== null) return { status: "connected", color: "green" };
    return { status: "disconnected", color: "red" };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Network:</span>
              <Badge
                variant={connectionStatus.color === "green" ? "default" : "secondary"}
                className={`${
                  connectionStatus.color === "green"
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                    : connectionStatus.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800"
                    : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800"
                }`}
              >
                {connectionStatus.status === "connected" ? "Connected" :
                 connectionStatus.status === "checking" ? "Checking..." : "Disconnected"}
              </Badge>
            </div>

            {blockHeight && (
              <div className="text-muted-foreground">
                Block: {blockHeight.toLocaleString()}
              </div>
            )}
          </div>

          {connected && publicKey && (
            <div className="border-t pt-3">
              <WalletAddress
                address={publicKey.toString()}
                label="Your ID (Student/Issuer)"
                showFull={true}
              />
              <div className="text-xs text-muted-foreground mt-2">
                This wallet address serves as your unique identifier on the blockchain
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
