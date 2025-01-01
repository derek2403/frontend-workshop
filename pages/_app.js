import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletProvider } from '../context/WalletContext';
import dynamic from 'next/dynamic';

import '@solana/wallet-adapter-react-ui/styles.css';
import '../styles/globals.css';

// Dynamically import wallet components to prevent SSR
const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }) {
  return (
    <WalletConnectionProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
