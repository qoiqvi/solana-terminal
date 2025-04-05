// 'use client';
// import { Token } from '@/shared';
// import {
//   Combobox,
//   ComboboxButton,
//   ComboboxInput,
//   ComboboxOption,
//   ComboboxOptions,
// } from '@headlessui/react';
// import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import clsx from 'clsx';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';

// const defaultTokenImage =
//   'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';

// const tokens: Token[] = [
//   {
//     address: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
//     symbol: 'TRUMP',
//     name: 'OFFICIAL TRUMP',
//     decimals: 6,
//     logoURI: 'https://arweave.net/VQrPjACwnQRmxdKBTqNwPiyo65x7LAT773t8Kd7YBzw',
//     tags: ['birdeye-trending', 'community', 'verified'],
//     daily_volume: 37437678.81760947,
//     created_at: '2025-01-17T14:19:04.321773Z',
//     freeze_authority: null,
//     mint_authority: null,
//     permanent_delegate: null,
//     minted_at: '2025-01-17T14:00:59Z',
//     extensions: {
//       coingeckoId: 'official-trump',
//     },
//   },
//   {
//     address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
//     symbol: 'USDT',
//     name: 'USDT',
//     decimals: 6,
//     logoURI:
//       'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
//     tags: ['community', 'strict', 'verified'],
//     daily_volume: 131736308.17216945,
//     created_at: '2024-04-26T10:56:58.893768Z',
//     freeze_authority: 'Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi',
//     mint_authority: 'Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi',
//     permanent_delegate: null,
//     minted_at: '2024-04-26T10:56:58.893768Z',
//     extensions: {
//       coingeckoId: 'tether',
//     },
//   },
// ];

// export default function TokenSelect() {
//   const [query, setQuery] = useState('');
//   const [selected, setSelected] = useState<Token>(tokens[0]);
//   const [suggestions, setSuggestions] = useState<Token[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [debouncedQuery, setDebouncedQuery] = useState(query);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDebouncedQuery(query);
//     }, 300);
//     return () => clearTimeout(timeout);
//   }, [query]);

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/tokens/search?query=${debouncedQuery}`
//         );
//         const data = await response.json();
//         setSuggestions(data);
//       } catch (error) {
//         console.error('Error fetching tokens:', error);
//         setSuggestions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (debouncedQuery) {
//       fetchSuggestions();
//     } else {
//       setSuggestions([]);
//     }
//   }, [debouncedQuery]);

//   return (
//     <div className="w-full">
//       <Combobox<Token, false> value={selected} onChange={value => value && setSelected(value)}>
//         <div className="relative">
//           <div className="relative w-full">
//             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//               <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
//                 <img
//                   src={selected.logoURI || defaultTokenImage}
//                   alt={selected.symbol}
//                   width={24}
//                   height={24}
//                   className="object-contain"
//                 />
//               </div>
//             </div>
//             <ComboboxInput
//               className={clsx(
//                 'w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-20 text-sm text-gray-800',
//                 'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40',
//                 'placeholder:text-gray-400'
//               )}
//               displayValue={(token: Token) => `${token.symbol}`}
//               onChange={event => setQuery(event.target.value)}
//               placeholder="Search token..."
//             />
//             <div className="absolute inset-y-0 right-0 flex items-center pr-2">
//               <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg mr-1">
//                 <span className="text-xs font-medium text-gray-500">{selected.symbol}</span>
//               </div>
//               <ComboboxButton className="flex items-center p-1 hover:bg-gray-100 rounded-lg transition-colors">
//                 <ChevronDownIcon className="h-4 w-4 text-gray-400" />
//               </ComboboxButton>
//             </div>
//           </div>

//           <ComboboxOptions
//             className={clsx(
//               'absolute z-10 mt-2 w-full overflow-auto rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5',
//               'focus:outline-none',
//               'divide-y divide-gray-100'
//             )}
//           >
//             <div className="px-3 pb-2">
//               <div className="relative">
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   className={clsx(
//                     'w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800',
//                     'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40',
//                     'placeholder:text-gray-400'
//                   )}
//                   placeholder="Search by name or paste address"
//                   value={query}
//                   onChange={e => setQuery(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="max-h-60 overflow-auto py-2">
//               {isLoading ? (
//                 <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
//               ) : suggestions.length === 0 ? (
//                 <div className="px-3 py-2 text-sm text-gray-500">No tokens found</div>
//               ) : (
//                 suggestions.map(token => (
//                   <ComboboxOption
//                     key={token.address}
//                     value={token}
//                     className={({ active }) =>
//                       clsx(
//                         'relative cursor-default select-none py-2 pl-3 pr-3',
//                         active ? 'bg-blue-50' : 'text-gray-900'
//                       )
//                     }
//                   >
//                     {({ selected, active }) => (
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
//                           <img
//                             src={token.logoURI || defaultTokenImage}
//                             alt={token.symbol}
//                             width={32}
//                             height={32}
//                             className="object-contain"
//                           />
//                         </div>
//                         <div className="flex flex-col min-w-0">
//                           <div className="flex items-center gap-2">
//                             <span
//                               className={clsx(
//                                 'truncate font-medium',
//                                 active ? 'text-blue-600' : 'text-gray-900'
//                               )}
//                             >
//                               {token.symbol}
//                             </span>
//                             {selected && (
//                               <CheckIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
//                             )}
//                           </div>
//                           <span className="text-sm text-gray-500 truncate">{token.name}</span>
//                         </div>
//                         {token.daily_volume > 0 && (
//                           <div className="ml-auto text-right flex-shrink-0">
//                             <span className="text-xs text-gray-500">Daily Volume</span>
//                             <div className="text-sm font-medium text-gray-900">
//                               ${(token.daily_volume / 1000).toFixed(1)}k
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </ComboboxOption>
//                 ))
//               )}
//             </div>
//           </ComboboxOptions>
//         </div>
//       </Combobox>
//     </div>
//   );
// }
