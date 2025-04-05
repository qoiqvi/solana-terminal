import { Wallet } from '@privy-io/react-auth';
import { JupiterQuoteResponse } from '@/shared/types/jupiter';

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

export async function swapTokens(quoteResponse: JupiterQuoteResponse, wallet: Wallet) {
  const response = await fetch(`https://api.jup.ag/swap/v1/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quoteResponse, userPublicKey: wallet.address }),
  });
  const data = await response.json();
  sendAndSignTransaction(data.swapTransaction, wallet);
  return data;
}

export async function sendAndSignTransaction(swapTransaction: string, wallet: Wallet) {
  const swapTransactionBuffer = Buffer.from(swapTransaction);
}
