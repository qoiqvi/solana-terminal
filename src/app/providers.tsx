'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { Buffer } from 'buffer';

globalThis.Buffer = Buffer;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
  });

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#fcf917',
          loginMessage: 'Welcome to new Solana Swap Terminal',
          walletChainType: 'solana-only',
          showWalletLoginFirst: true,
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        solanaClusters: [
          {
            name: 'mainnet-beta',
            rpcUrl: process.env.NEXT_PUBLIC_RPC_SERVER!,
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
};
