"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface TroubleshootingItem {
  id: string;
  title: string;
  problem: string;
  solution: string[];
  severity: "high" | "medium" | "low";
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    id: "insufficient-sol",
    title: "Insufficient SOL Balance",
    problem: "Transaction failed with 'Attempt to debit an account but found no record of a prior credit' or 'insufficient funds' error.",
    solution: [
      "Check your SOL balance in the balance widget above",
      "For local development: Click the 'Airdrop' button to get 2 SOL for testing",
      "For devnet: Visit https://faucet.solana.com and request SOL",
      "For mainnet: Purchase SOL from an exchange and transfer to your wallet",
      "Minimum required: 0.01 SOL for certificate transactions"
    ],
    severity: "high"
  },
  {
    id: "wallet-connection",
    title: "Wallet Connection Issues",
    problem: "Unable to connect wallet or wallet disconnects frequently.",
    solution: [
      "Ensure you have Phantom or Solflare wallet installed",
      "Check that your wallet is unlocked",
      "Switch your wallet network to match the app (localnet/devnet)",
      "Try refreshing the page and reconnecting",
      "Clear browser cache and cookies if issues persist"
    ],
    severity: "medium"
  },
  {
    id: "certificate-exists",
    title: "Certificate ID Already Exists",
    problem: "Error when issuing certificate: 'Certificate with this ID already exists'.",
    solution: [
      "Choose a different, unique certificate ID",
      "Certificate IDs must be unique across all certificates",
      "Consider using a timestamp or UUID in your certificate ID",
      "Example: 'CERT-2024-001' or 'BLOCKCHAIN-COURSE-12345'"
    ],
    severity: "medium"
  },
  {
    id: "invalid-address",
    title: "Invalid Student Wallet Address",
    problem: "Error: 'Invalid student wallet address' when issuing certificate.",
    solution: [
      "Verify the wallet address is exactly 44 characters long",
      "Ensure no extra spaces at the beginning or end",
      "Check that the address contains only valid base58 characters",
      "Ask the student to copy their address directly from their wallet",
      "Example valid address: 'B7vYXGjRvZ5tUJhp...' (44 characters total)"
    ],
    severity: "medium"
  },
  {
    id: "certificate-not-found",
    title: "Certificate Not Found",
    problem: "When searching for a certificate, it shows 'Certificate not found'.",
    solution: [
      "Double-check the certificate ID spelling and case sensitivity",
      "Ensure the certificate has been successfully issued on-chain",
      "Wait a few moments for blockchain confirmation",
      "Try refreshing the page and searching again",
      "Verify you're connected to the correct network (localnet/devnet)"
    ],
    severity: "low"
  },
  {
    id: "network-issues",
    title: "Network Connection Problems",
    problem: "Unable to fetch data or transactions timeout.",
    solution: [
      "Check if your local Solana validator is running (for local development)",
      "Verify the RPC endpoint is accessible: http://127.0.0.1:8899",
      "Try restarting your local validator: 'solana-test-validator'",
      "Check your internet connection",
      "Wait a moment and try again - network congestion can cause delays"
    ],
    severity: "high"
  },
  {
    id: "program-not-deployed",
    title: "Program Not Found",
    problem: "Errors related to program not being found or invalid program ID.",
    solution: [
      "Ensure the Certify program is deployed to your local validator",
      "Verify the program ID matches: 8gdhx9xwLSiBmSjqnGxPAGhDoZeJu1SWX9oLDr9qvWUb",
      "Redeploy the program if necessary using Anchor",
      "Check that you're using the correct network configuration",
      "Restart your local validator and redeploy the program"
    ],
    severity: "high"
  }
];

export default function TroubleshootingHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100";
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">Troubleshooting Guide</CardTitle>
              <CardDescription>
                Common issues and solutions for the Certify app
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Hide
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                Show Help
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Click on any issue below to see the solution:
          </div>

          {troubleshootingItems.map((item) => (
            <Collapsible key={item.id}>
              <CollapsibleTrigger
                className="w-full"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {item.severity === "high" ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <HelpCircle className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-medium text-left">{item.title}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={getSeverityColor(item.severity)}
                    >
                      {item.severity}
                    </Badge>
                  </div>
                  {openItems.includes(item.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-2 p-4 bg-background border rounded-lg space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Problem:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.problem}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Solution:
                    </h4>
                    <ul className="space-y-1">
                      {item.solution.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary font-medium min-w-[1.5rem]">
                            {index + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Additional Resources:
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Solana Documentation: https://docs.solana.com</li>
              <li>• Anchor Framework: https://www.anchor-lang.com</li>
              <li>• Solana Faucet (Devnet): https://faucet.solana.com</li>
              <li>• Phantom Wallet: https://phantom.app</li>
              <li>• Solflare Wallet: https://solflare.com</li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Still having issues? Check the browser console for detailed error messages.
          </div>
        </CardContent>
      )}
    </Card>
  );
}
