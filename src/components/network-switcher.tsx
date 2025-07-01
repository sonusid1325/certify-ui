"use client";

import { useState } from "react";
import { Settings, Check, Globe, Laptop, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface NetworkConfig {
  name: string;
  displayName: string;
  rpcEndpoint: string;
  description: string;
  icon: React.ReactNode;
  isTestnet: boolean;
}

const networks: NetworkConfig[] = [
  {
    name: "devnet",
    displayName: "Devnet",
    rpcEndpoint: "https://api.devnet.solana.com",
    description: "Solana test network - use your Phantom wallet balance",
    icon: <TestTube className="h-4 w-4" />,
    isTestnet: true,
  },
  {
    name: "localnet",
    displayName: "Localnet",
    rpcEndpoint: "http://127.0.0.1:8898",
    description: "Local Solana validator for development",
    icon: <Laptop className="h-4 w-4" />,
    isTestnet: true,
  },
  {
    name: "mainnet",
    displayName: "Mainnet",
    rpcEndpoint: "https://api.mainnet-beta.solana.com",
    description: "Solana production network - real SOL required",
    icon: <Globe className="h-4 w-4" />,
    isTestnet: false,
  },
];

export default function NetworkSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  // Get current network from environment or default to devnet
  const currentRpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com";
  const currentNetwork = networks.find(n => n.rpcEndpoint === currentRpcEndpoint) || networks[0];

  const handleNetworkSwitch = (network: NetworkConfig) => {
    toast.info(
      <div className="space-y-2">
        <div className="font-medium">Network Switch Required</div>
        <div className="text-sm text-muted-foreground">
          To switch to {network.displayName}, you need to:
        </div>
        <ol className="text-sm space-y-1 ml-4">
          <li>1. Update your .env.local file</li>
          <li>2. Set NEXT_PUBLIC_RPC_ENDPOINT={network.rpcEndpoint}</li>
          <li>3. Restart the development server</li>
        </ol>
      </div>,
      {
        duration: 8000,
      }
    );
  };

  const copyEnvConfig = (network: NetworkConfig) => {
    const envConfig = `# Network: ${network.displayName}
NEXT_PUBLIC_SOLANA_NETWORK=${network.name}
NEXT_PUBLIC_RPC_ENDPOINT=${network.rpcEndpoint}
NEXT_PUBLIC_PROGRAM_ID=8gdhx9xwLSiBmSjqnGxPAGhDoZeJu1SWX9oLDr9qvWUb
NEXT_PUBLIC_COMMITMENT=processed`;

    navigator.clipboard.writeText(envConfig).then(() => {
      toast.success(`${network.displayName} configuration copied to clipboard!`);
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Network Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Currently connected to {currentNetwork.displayName}
            </CardDescription>
          </div>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {currentNetwork.icon}
                {currentNetwork.displayName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {networks.map((network) => (
                <DropdownMenuItem
                  key={network.name}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => copyEnvConfig(network)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {network.icon}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{network.displayName}</span>
                        {network.isTestnet && (
                          <Badge variant="secondary" className="text-xs">
                            Testnet
                          </Badge>
                        )}
                        {currentNetwork.name === network.name && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {network.description}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {network.rpcEndpoint}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <div className="p-3 text-xs text-muted-foreground">
                Click any network to copy its .env.local configuration
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant={currentNetwork.isTestnet ? "secondary" : "default"}
              className={currentNetwork.isTestnet ? "" : "bg-orange-100 text-orange-800 border-orange-200"}
            >
              {currentNetwork.isTestnet ? "Test Network" : "Production Network"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {currentNetwork.description}
            </span>
          </div>

          {currentNetwork.name === "devnet" && (
            <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950 p-2 rounded">
              ✅ Perfect for testing with your Phantom wallet's devnet SOL balance!
            </div>
          )}

          {currentNetwork.name === "localnet" && (
            <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950 p-2 rounded">
              ⚠️ Make sure your local Solana validator is running: <code>solana-test-validator</code>
            </div>
          )}

          {currentNetwork.name === "mainnet" && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">
              ⚠️ Warning: This is the production network. Real SOL will be used for transactions!
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <strong>RPC Endpoint:</strong> {currentRpcEndpoint}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
