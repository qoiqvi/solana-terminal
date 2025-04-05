import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Solana Swap Terminal',
  description: 'Swap tokens on Solana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col h-screen">
            <div className="overflow-auto">{children}</div>
            {/* <div className="h-16 bg-gray-100">
              <div className="flex items-center justify-center">
                <p>Footer</p>
              </div>
            </div> */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
