"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SOLBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey || !connection) {
      setBalance(null);
      return;
    }

    try {
      setLoading(true);
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch SOL balance");
    } finally {
      setLoading(false);
    }
  };

  const requestAirdrop = async () => {
    if (!publicKey || !connection) return;

    try {
      setAirdropping(true);
      toast.info("Requesting airdrop... This may take a few seconds.");

      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      toast.success("Airdrop successful! 2 SOL added to your wallet.");

      // Refresh balance
      await fetchBalance();
    } catch (error: any) {
      console.error("Airdrop failed:", error);

      if (error.message?.includes("airdrop request limit exceeded")) {
        toast.error("Airdrop limit exceeded. Please try again later or use a different wallet.");
      } else if (error.message?.includes("blockhash not found")) {
        toast.error("Network congestion. Please try again in a moment.");
      } else {
        toast.error(`Airdrop failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setAirdropping(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    // Auto-refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  if (!publicKey) {
    return null;
  }

  const isLowBalance = balance !== null && balance < 0.01;
  const hasNoBalance = balance !== null && balance === 0;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          SOL Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {loading ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Checking...
              </Badge>
            ) : balance !== null ? (
              <Badge
                variant={isLowBalance ? "destructive" : "default"}
                className={
                  !isLowBalance
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100"
                    : ""
                }
              >
                {balance.toFixed(4)} SOL
              </Badge>
            ) : (
              <Badge variant="secondary">Unknown</Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBalance}
              disabled={loading}
              className="h-7 px-2"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* Only show airdrop button for local development */}
            {connection.rpcEndpoint.includes("127.0.0.1") && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestAirdrop}
                disabled={airdropping || loading}
                className="h-7 px-2 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                {airdropping ? "Airdropping..." : "Airdrop"}
              </Button>
            )}
          </div>
        </div>

        {/* Balance status messages */}
        {hasNoBalance && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
            ⚠️ No SOL balance! You need SOL to pay for transactions.
            {connection.rpcEndpoint.includes("127.0.0.1") && (
              <> Click "Airdrop" to get free SOL for testing.</>
            )}
          </div>
        )}

        {isLowBalance && !hasNoBalance && (
          <div className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-950 p-2 rounded">
            ⚠️ Low SOL balance! You may need more SOL for transactions.
            {connection.rpcEndpoint.includes("127.0.0.1") && (
              <> Click "Airdrop" to get more SOL for testing.</>
            )}
          </div>
        )}

        {balance !== null && balance >= 0.01 && (
          <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950 p-2 rounded">
            ✅ Sufficient balance for certificate transactions.
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Minimum required: 0.01 SOL for certificate issuance
        </div>
      </CardContent>
    </Card>
  );
}
