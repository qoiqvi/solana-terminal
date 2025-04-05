'use client';
import { Token } from '@/shared';
import { useClickOutside } from '@/shared/hooks';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Skeleton from '@/shared/ui/skeleton';

const defaultTokenImage =
  'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';

interface TokenSelectProps {
  selectedTokenInfo: Token;
  tokenAmount: string;
  setTokenAmount: (amount: string) => void;
  onSelect: (token: Token) => void;
  isLoading: boolean;
}

export default function TokenSelect(props: TokenSelectProps) {
  const { isLoading, selectedTokenInfo, onSelect, tokenAmount, setTokenAmount } = props;
  const [query, setQuery] = useState('trump');
  const [suggestions, setSuggestions] = useState<Token[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsListLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tokens/search?query=${debouncedQuery}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setSuggestions([]);
      } finally {
        setIsListLoading(false);
      }
    };

    if (debouncedQuery) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div
      ref={containerRef}
      className="relative flex justify-between items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-300"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-3 hover:bg-gray-50 p-2.5 hover:cursor-pointer rounded-xl transition-all duration-300 min-w-fit whitespace-nowrap group"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton width={36} height={36} />
            <Skeleton width={60} height={28} />
          </div>
        ) : (
          <>
            <div className="relative">
              <Image
                className="rounded-full select-none flex-shrink-0 w-9 h-9 group-hover:scale-105 transition-transform duration-300"
                src={selectedTokenInfo.logoURI || defaultTokenImage}
                alt="Token"
                width={40}
                height={40}
              />
              <div className="absolute inset-0 rounded-full shadow-inner"></div>
            </div>
            <span className="text-lg font-semibold select-none text-gray-900">
              {selectedTokenInfo.symbol}
            </span>
          </>
        )}
        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-all duration-300',
            isOpen && 'transform rotate-180'
          )}
        />
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/2 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 top-full left-0 w-96 mt-2 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 animate-slideDown">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search tokens..."
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  onClick={e => e.stopPropagation()}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div
              className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
              onClick={e => e.stopPropagation()}
            >
              {isListLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-3 text-gray-500">Loading tokens...</p>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-lg font-medium">No tokens found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="p-2">
                  {suggestions.map(token => (
                    <div
                      key={token.address}
                      onClick={e => {
                        e.stopPropagation();
                        onSelect(token);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-300 group"
                    >
                      <div className="relative">
                        <Image
                          className="rounded-full flex-shrink-0 w-10 h-10 group-hover:scale-105 transition-transform duration-300"
                          src={token.logoURI || defaultTokenImage}
                          alt={token.symbol}
                          width={40}
                          height={40}
                        />
                        <div className="absolute inset-0 rounded-full shadow-inner"></div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {token.symbol}
                        </span>
                        <span className="text-sm text-gray-500 truncate">{token.name}</span>
                      </div>
                      {token.daily_volume > 0 && (
                        <div className="ml-auto text-right">
                          <div className="text-xs text-gray-500">Volume 24h</div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(token.daily_volume / 10000).toFixed(1)}k
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div className="flex-1">
        <input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={tokenAmount}
          onChange={e => setTokenAmount(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}
