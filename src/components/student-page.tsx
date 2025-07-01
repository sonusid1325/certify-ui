"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
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
import { toast } from "sonner";
import { getProgram, getCertificatePDA, Certificate } from "@/lib/anchor";
import WalletAddress from "@/components/wallet-address";

export default function StudentPage() {
  const { publicKey, wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [myCertificates, setMyCertificates] = useState<any[]>([]);
  const [loadingMyCerts, setLoadingMyCerts] = useState(false);

  const fetchCertificate = async () => {
    if (!certificateId.trim()) {
      toast.error("Please enter a certificate ID");
      return;
    }

    try {
      setIsLoading(true);

      if (!wallet) {
        toast.error("Please connect your wallet");
        return;
      }

      const { program } = await getProgram(wallet.adapter);
      const certificatePDA = getCertificatePDA(certificateId);

      const certificateAccount = await (
        program.account as any
      ).certificate.fetch(certificatePDA);

      setCertificate({
        student: certificateAccount.student,
        issuer: certificateAccount.issuer,
        certificateId: certificateAccount.certificateId,
        course: certificateAccount.course,
        issuedAt: certificateAccount.issuedAt.toNumber(),
      });

      toast.success("Certificate found!");
    } catch (error: any) {
      console.error("Error fetching certificate:", error);

      if (error.message?.includes("Account does not exist")) {
        toast.error("Certificate not found. Please check the certificate ID.");
      } else if (error.message?.includes("failed to get account")) {
        toast.error("Unable to fetch certificate. Please check your network connection.");
      } else {
        toast.error(`Error fetching certificate: ${error.message || "Unknown error"}`);
      }
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyCertificates = async () => {
    if (!publicKey || !wallet) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setLoadingMyCerts(true);

      const { program } = await getProgram(wallet.adapter);

      // Get all certificate accounts where student matches the connected wallet
      const certificates = await (program.account as any).certificate.all([
        {
          memcmp: {
            offset: 8, // Skip the 8-byte discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      setMyCertificates(certificates);
      toast.success(`Found ${certificates.length} certificate(s)`);
    } catch (error: any) {
      console.error("Error fetching certificates:", error);

      if (error.message?.includes("failed to get account")) {
        toast.error("Unable to fetch certificates. Please check your network connection.");
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Network error while fetching certificates. Please try again.");
      } else {
        toast.error(`Failed to fetch certificates: ${error.message || "Unknown error"}`);
      }
    } finally {
      setLoadingMyCerts(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Search Certificate Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              View Certificate
            </CardTitle>
            <CardDescription>
              Search for a specific certificate by ID to view student details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!publicKey ? (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  Connect your wallet to view certificates
                </p>
                <WalletMultiButton />
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="certificateId">Certificate ID</Label>
                    <Input
                      id="certificateId"
                      placeholder="Enter certificate ID to view student info"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={fetchCertificate}
                      disabled={isLoading || !certificateId}
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>

                {certificate && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Certificate Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Certificate ID
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {certificate.certificateId}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Course</Label>
                          <p className="text-sm text-muted-foreground">
                            {certificate.course}
                          </p>
                        </div>
                        <div>
                          <WalletAddress
                            address={certificate.student.toString()}
                            label="Student ID"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Student's wallet address (unique identifier)
                          </p>
                        </div>
                        <div>
                          <WalletAddress
                            address={certificate.issuer.toString()}
                            label="Issuer ID"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Certificate issuer's wallet address
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium">
                            Issued At
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(certificate.issuedAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* My Certificates Section */}
        {publicKey && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  My Certificates
                </CardTitle>
                <CardDescription>
                  Certificates issued to your wallet address
                </CardDescription>
              </div>
              <Button onClick={fetchMyCertificates} disabled={loadingMyCerts}>
                {loadingMyCerts ? "Loading..." : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent>
              {myCertificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No certificates found. Click "Refresh" to search for
                  certificates.
                </p>
              ) : (
                <div className="space-y-4">
                  {myCertificates.map((cert, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Certificate ID
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {cert.account.certificateId}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Course
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {cert.account.course}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Issued
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(cert.account.issuedAt.toNumber())}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <WalletAddress
                              address={cert.account.student.toString()}
                              label="Student ID (You)"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Your wallet address
                            </p>
                          </div>
                          <div>
                            <WalletAddress
                              address={cert.account.issuer.toString()}
                              label="Issuer ID"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Certificate issuer
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
