# Certify - Blockchain Certificate Management System

A decentralized certificate issuance and verification system built on Solana blockchain using Next.js and shadcn/ui.

## Features

- **Issue Certificates**: Authorized issuers can create certificates on the blockchain
- **Verify Certificates**: Anyone can verify certificate authenticity by certificate ID
- **View My Certificates**: Students can view all certificates issued to their wallet
- **Student ID Display**: Clear display of student IDs (wallet addresses) with copy functionality
- **Wallet Integration**: Support for Phantom and Solflare wallets
- **Dark/Light Theme**: Full dark mode support with system theme detection
- **Real-time Updates**: Instant feedback on certificate issuance and verification
- **Connection Status**: Real-time blockchain connection monitoring

## Prerequisites

- Node.js 18+ installed
- A Solana wallet (Phantom or Solflare)
- Local Solana validator running (for development)
- The Certify program deployed on your local validator

## Setup

1. **Clone and install dependencies**:
```bash
cd certify-ui
npm install
```

2. **Start your local Solana validator**:
```bash
solana-test-validator
```

3. **Deploy the Certify program** (if not already deployed):
   - Make sure your program is deployed to the address: `8gdhx9xwLSiBmSjqnGxPAGhDoZeJu1SWX9oLDr9qvWUb`
   - The RPC endpoint is configured for `http://127.0.0.1:8898`

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### For Issuers

1. Click on the **"Issuer View"** tab
2. Connect your wallet using the "Select Wallet" button
3. Your **Issuer ID** (wallet address) will be displayed for reference
4. Fill in the certificate details:
   - **Certificate ID**: A unique identifier for the certificate
   - **Course Name**: The name of the course/certification
   - **Student ID**: The wallet address of the student receiving the certificate (serves as their unique student ID)
5. Click **"Issue Certificate"** to create the certificate on-chain

### For Students

1. Click on the **"Student View"** tab
2. Connect your wallet using the "Select Wallet" button
3. Your **Student ID** (wallet address) will be displayed in the connection status

#### To Search for a Specific Certificate:
- Enter a **Certificate ID** in the search field
- Click **"Search"** to view the certificate details including student and issuer IDs
- Use the copy button next to wallet addresses to easily copy student/issuer IDs

#### To View All Your Certificates:
- Click the **"Refresh"** button in the "My Certificates" section
- All certificates issued to your wallet address (Student ID) will be displayed
- Each certificate shows your Student ID and the Issuer ID with copy functionality

#### Theme Options:
- Click the **theme toggle button** (sun/moon icon) in the top-right corner
- Choose between Light, Dark, or System theme

## Architecture

### Smart Contract
- **Program ID**: `8gdhx9xwLSiBmSjqnGxPAGhDoZeJu1SWX9oLDr9qvWUb`
- **Instruction**: `issue_certificate`
- **Account**: Certificate PDA derived from `["cert", certificate_id]`

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with dark mode support
- **shadcn/ui** - Modern UI components
- **next-themes** - Dark/light theme management
- **Solana Wallet Adapter** - Wallet integration
- **Anchor** - Solana program interaction
- **Sonner** - Toast notifications

### Key Components
- `IssuerPage` - Certificate issuance interface with issuer ID display
- `StudentPage` - Certificate verification and viewing with student ID emphasis
- `WalletContextProvider` - Wallet connection management
- `ConnectionStatus` - Real-time network and user ID display
- `WalletAddress` - Reusable component for displaying wallet addresses with copy functionality
- `ThemeProvider` & `ThemeToggle` - Dark/light theme management
- `anchor.ts` - Program interaction utilities

## Configuration

The app is configured to connect to:
- **RPC Endpoint**: `http://127.0.0.1:8898` (local validator)
- **Network**: Localnet
- **Supported Wallets**: Phantom, Solflare

To change the network or RPC endpoint, modify:
- `src/lib/anchor.ts` - Program connection
- `src/components/wallet-context-provider.tsx` - Wallet provider endpoint

## Certificate Data Structure

Each certificate contains:
- `student`: PublicKey of the certificate holder (Student ID)
- `issuer`: PublicKey of the certificate issuer (Issuer ID)
- `certificate_id`: Unique string identifier
- `course`: Course/certification name
- `issued_at`: Unix timestamp of issuance

**Note**: The student's wallet address serves as their unique Student ID throughout the system, providing a decentralized identity solution.

## Development

### Adding New Features
1. Update the Solana program if needed
2. Regenerate the IDL file
3. Update TypeScript types in `src/lib/types.ts`
4. Implement UI changes in the respective components

### Testing
1. Ensure your local validator is running
2. Deploy the program with test data
3. Use different wallet addresses for issuer and student roles
4. Test certificate issuance and verification flows

## Troubleshooting

### Common Issues

**Wallet Connection Issues**:
- Ensure your wallet is set to the correct network (localnet)
- Check that your wallet has SOL for transaction fees

**Program Errors**:
- Verify the program is deployed at the correct address
- Check that the RPC endpoint is accessible
- Ensure the certificate ID is unique when issuing

**Transaction Failures**:
- Check wallet SOL balance
- Verify all required fields are filled
- Ensure the student ID (wallet address) is valid

**Theme Issues**:
- Theme preference is saved locally and will persist across sessions
- If theme appears inconsistent, try refreshing the page
- System theme automatically switches based on your OS preference

## License

MIT License - feel free to use this project as a starting point for your own certificate management system.