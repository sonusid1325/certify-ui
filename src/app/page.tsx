"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import WalletContextProvider from "@/components/wallet-context-provider";
import IssuerPage from "@/components/issuer-page";
import StudentPage from "@/components/student-page";
import ConnectionStatus from "@/components/connection-status";
import SOLBalance from "@/components/sol-balance";
import TroubleshootingHelp from "@/components/troubleshooting-help";
import NetworkSwitcher from "@/components/network-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <WalletContextProvider>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold tracking-tight">Certify</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Blockchain-based Certificate Management System
              </p>
            </div>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* <NetworkSwitcher /> */}
          <ConnectionStatus />
          <SOLBalance />
          <TroubleshootingHelp />

          <Tabs defaultValue="student" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student View</TabsTrigger>
              <TabsTrigger value="issuer">Issuer View</TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-6">
              <StudentPage />
            </TabsContent>

            <TabsContent value="issuer" className="mt-6">
              <IssuerPage />
            </TabsContent>
          </Tabs>
        </div>

        <Toaster />
      </main>
    </WalletContextProvider>
  );
}
