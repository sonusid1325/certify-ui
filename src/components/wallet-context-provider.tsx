"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

export default function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use environment variable for endpoint, fallback to devnet
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(WalletAdapterNetwork.Devnet);
  }, []);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
