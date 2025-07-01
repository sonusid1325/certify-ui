"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getProgram, getCertificatePDA } from "@/lib/anchor";
import WalletAddress from "@/components/wallet-address";

export default function IssuerPage() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [formData, setFormData] = useState({
    certificateId: "",
    course: "",
    studentPublicKey: "",
  });

  // Check SOL balance whenever wallet connects
  useEffect(() => {
    const checkBalance = async () => {
      if (!publicKey || !connection) {
        setSolBalance(null);
        return;
      }

      try {
        setCheckingBalance(true);
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error checking balance:", error);
        setSolBalance(null);
      } finally {
        setCheckingBalance(false);
      }
    };

    checkBalance();
    // Check balance every 30 seconds
    const interval = setInterval(checkBalance, 30000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const issueCertificate = async () => {
    if (!publicKey || !wallet) {
      toast.error("Please connect your wallet");
      return;
    }

    if (
      !formData.certificateId ||
      !formData.course ||
      !formData.studentPublicKey
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if wallet has sufficient SOL
    if (solBalance !== null && solBalance < 0.01) {
      toast.error(
        "Insufficient SOL balance. You need at least 0.01 SOL to issue a certificate. Please add SOL to your wallet."
      );
      return;
    }

    try {
      setIsLoading(true);

      // Validate student public key
      let studentPubkey: PublicKey;
      try {
        studentPubkey = new PublicKey(formData.studentPublicKey);
      } catch (error) {
        toast.error("Invalid student wallet address. Please check the address and try again.");
        return;
      }

      const { program } = await getProgram(wallet.adapter);
      const certificatePDA = getCertificatePDA(formData.certificateId);

      // Check if certificate already exists
      try {
        await (program.account as any).certificate.fetch(certificatePDA);
        toast.error("Certificate with this ID already exists. Please use a different certificate ID.");
        return;
      } catch (error) {
        // Certificate doesn't exist, which is what we want
      }

      const tx = await program.methods
        .issueCertificate(formData.certificateId, formData.course)
        .accounts({
          certificate: certificatePDA,
          issuer: publicKey,
          student: studentPubkey,
          systemProgram: new PublicKey("11111111111111111111111111111111"),
        })
        .rpc();

      toast.success(`Certificate issued successfully! Transaction: ${tx}`);

      // Reset form
      setFormData({
        certificateId: "",
        course: "",
        studentPublicKey: "",
      });

      // Refresh balance after transaction
      if (connection) {
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
    } catch (error: any) {
      console.error("Error issuing certificate:", error);

      // Better error handling
      if (error.message?.includes("insufficient funds") ||
          error.message?.includes("Attempt to debit an account but found no record")) {
        toast.error("Insufficient SOL balance. Please add SOL to your wallet to pay for transaction fees.");
      } else if (error.message?.includes("already in use")) {
        toast.error("Certificate ID already exists. Please use a different ID.");
      } else if (error.message?.includes("invalid")) {
        toast.error("Invalid input. Please check all fields and try again.");
      } else {
        toast.error(`Failed to issue certificate: ${error.message || "Unknown error occurred"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Issue Certificate
          </CardTitle>
          <CardDescription>
            Issue a new certificate on the Solana blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!publicKey ? (
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">
                Connect your wallet to issue certificates
              </p>
              <WalletMultiButton />
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                <WalletAddress
                  address={publicKey.toString()}
                  label="Your Issuer ID"
                  showFull={true}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your wallet address (issuer identity)
                </p>

                {/* SOL Balance Display */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs">SOL Balance:</span>
                  {checkingBalance ? (
                    <Badge variant="secondary">Checking...</Badge>
                  ) : solBalance !== null ? (
                    <Badge
                      variant={solBalance >= 0.01 ? "default" : "destructive"}
                      className={solBalance >= 0.01 ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100" : ""}
                    >
                      {solBalance.toFixed(4)} SOL
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Unknown</Badge>
                  )}
                </div>
                {solBalance !== null && solBalance < 0.01 && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Low balance! You need at least 0.01 SOL to issue certificates.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <Input
                    id="certificateId"
                    name="certificateId"
                    placeholder="Enter unique certificate ID"
                    value={formData.certificateId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course Name</Label>
                  <Input
                    id="course"
                    name="course"
                    placeholder="Enter course name"
                    value={formData.course}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentPublicKey">Student ID (Wallet Address)</Label>
                  <Input
                    id="studentPublicKey"
                    name="studentPublicKey"
                    placeholder="Enter student's wallet address (their unique ID)"
                    value={formData.studentPublicKey}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    The student's Solana wallet address serves as their unique student ID
                  </p>
                </div>

                <Button
                  onClick={issueCertificate}
                  disabled={
                    isLoading ||
                    !formData.certificateId ||
                    !formData.course ||
                    !formData.studentPublicKey
                  }
                  className="w-full"
                >
                  {isLoading ? "Issuing Certificate..." : "Issue Certificate"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
