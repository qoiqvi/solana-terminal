import { ConnectedSolanaWallet } from '@privy-io/react-auth';
import { JupiterQuoteResponse, JupiterSwapTransactionResponse } from '@/shared/types/jupiter';
import { Connection, VersionedTransaction } from '@solana/web3.js';

export async function getTokenByMintAddress(mintAddress: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/token?mintAddress=${mintAddress}`
  );
  const data = await response.json();
  return data;
}

export async function getQuote(inputMint: string, outputMint: string, amount: number) {
  const response = await fetch(
    `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&restrictIntermediateTokens=true`
  );
  const data = await response.json();
  return data;
}

export async function swapTokens(
  quoteResponse: JupiterQuoteResponse,
  wallet: ConnectedSolanaWallet
) {
  console.log(wallet, 'wallet');
  const response = await fetch(`https://api.jup.ag/swap/v1/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.address,
      dynamicComputeUnitLimit: true,
      dynamicSlippage: true,
    }),
  });
  const data = await response.json();
  sendAndSignTransaction(data, wallet);
}

export async function sendAndSignTransaction(
  swapTransactionData: JupiterSwapTransactionResponse,
  wallet: ConnectedSolanaWallet
) {
  console.log(swapTransactionData, 'swapTransaction');
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_SERVER!, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
  });

  try {
    const swapTransactionBuffer = Buffer.from(swapTransactionData.swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuffer);

    console.log(transaction, 'transaction');

    const signedTransaction = await wallet.signTransaction!(transaction);
    const rawTransaction = signedTransaction.serialize();

    console.log(rawTransaction, 'rawTransaction');

    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 3,
    });

    console.log(signature, 'sent transaction');

    await connection.confirmTransaction({
      signature,
      blockhash: transaction.message.recentBlockhash,
      lastValidBlockHeight: swapTransactionData.lastValidBlockHeight,
    });

    console.log('confirmed');
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}
