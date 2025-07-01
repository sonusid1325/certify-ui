"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletAddressProps {
  address: string;
  label?: string;
  showFull?: boolean;
  className?: string;
}

export default function WalletAddress({
  address,
  label,
  showFull = false,
  className = ""
}: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  const displayAddress = showFull
    ? address
    : `${address.slice(0, 8)}...${address.slice(-8)}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="text-sm font-medium">{label}</div>
      )}
      <div className="flex items-center gap-2 bg-muted p-2 rounded group">
        <code className="text-xs font-mono flex-1 break-all">
          {displayAddress}
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      {!showFull && (
        <div className="text-xs text-muted-foreground">
          Click the copy button to copy the full address
        </div>
      )}
    </div>
  );
}
