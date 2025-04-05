import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { Connection, VersionedTransaction } from '@solana/web3.js';

export function useSendTransaction() {
  const { user } = usePrivy();

  const { wallets } = useSolanaWallets();

  const wallet = wallets.find(wallet => wallet.address === user?.wallet?.address);

  const sendTransaction = async (transaction: VersionedTransaction) => {
    if (!wallet) throw new Error('No wallets found');

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_SERVER!);

    return wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
  };

  return {
    sendTransaction,
  };
}
