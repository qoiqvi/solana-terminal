import { useEffect, useState } from 'react';
import TokenSelect from './token-select';
import Image from 'next/image';
import { Token } from '@/shared';
import { getQuote, getTokenByMintAddress, swapTokens } from '@/shared/api';
import { fromAtomicAmount, toAtomicAmount, truncateAddress } from '@/shared/utils';
import { useAuth } from '@/shared/hooks';
import { JupiterQuoteResponse } from '@/shared/types/jupiter';

interface TerminalProps {
  firstToken: string;
  secondToken: string;
}

export default function Terminal({ firstToken, secondToken }: TerminalProps) {
  const [firstTokenInfo, setFirstTokenInfo] = useState<Token>({} as Token);
  const [secondTokenInfo, setSecondTokenInfo] = useState<Token>({} as Token);
  const [isLoading, setIsLoading] = useState(false);
  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [quoteResponse, setQuoteResponse] = useState<JupiterQuoteResponse | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTokens() {
      setIsLoading(true);
      const [firstTokenInfo, secondTokenInfo] = await Promise.all([
        getTokenByMintAddress(firstToken),
        getTokenByMintAddress(secondToken),
      ]);
      setFirstTokenInfo(firstTokenInfo);
      setSecondTokenInfo(secondTokenInfo);
      setIsLoading(false);
    }
    fetchTokens();
  }, [firstToken, secondToken]);

  function handleFirstTokenAmountChange(amount: string) {
    setFirstTokenAmount(amount);
    getQuote(
      firstTokenInfo.address,
      secondTokenInfo.address,
      toAtomicAmount(Number(amount), firstTokenInfo.decimals)
    ).then(data => {
      setQuoteResponse(data);
      setSecondTokenAmount(String(fromAtomicAmount(data.outAmount, secondTokenInfo.decimals)));
    });
  }

  function handleSecondTokenAmountChange(amount: string) {
    setSecondTokenAmount(amount);
    getQuote(
      secondTokenInfo.address,
      firstTokenInfo.address,
      toAtomicAmount(Number(amount), secondTokenInfo.decimals)
    ).then(data => {
      setQuoteResponse(data);
      setFirstTokenAmount(String(fromAtomicAmount(data.outAmount, firstTokenInfo.decimals)));
    });
  }

  function handleReverse() {
    const temp = firstTokenInfo;
    setFirstTokenInfo(secondTokenInfo);
    setSecondTokenInfo(temp);
  }

  function handleSwapTokens() {
    if (!quoteResponse || !user?.wallet?.address) {
      return;
    }
    swapTokens(quoteResponse, user.wallet);
  }

  return (
    <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Image src="/solana.png" alt="logo" width={50} height={50} className="rounded-full" />
          <span className="text-xl font-semibold text-gray-800">Swap here</span>
        </div>
        <button
          onClick={() =>
            window.open(`https://solscan.io/address/${user?.wallet?.address}`, '_blank')
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors"
        >
          {truncateAddress(user?.wallet?.address || '')}
        </button>
      </div>

      {/* Token Input Field */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <TokenSelect
          selectedTokenInfo={firstTokenInfo}
          isLoading={isLoading}
          tokenAmount={firstTokenAmount}
          setTokenAmount={handleFirstTokenAmountChange}
          onSelect={setFirstTokenInfo}
        />
      </div>

      {/* Swap Icon */}
      <div className="flex justify-center my-4">
        <button
          onClick={handleReverse}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>
      </div>

      {/* Token Output Field */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <TokenSelect
          tokenAmount={secondTokenAmount}
          setTokenAmount={handleSecondTokenAmountChange}
          isLoading={isLoading}
          selectedTokenInfo={secondTokenInfo}
          onSelect={setSecondTokenInfo}
        />
      </div>

      {/* Connect Wallet Button */}
      <button
        onClick={handleSwapTokens}
        className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 cursor-pointer transition-colors"
      >
        {isLoading && 'Loading...'}
        {!isLoading && 'Swap'}
      </button>
    </div>
  );
}
