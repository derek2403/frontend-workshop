import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { NETWORK } from '../constants';

// Import required styles
import '@solana/wallet-adapter-react-ui/styles.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const network = WalletAdapterNetwork.Devnet; // or Testnet
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={NETWORK}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900">
            <Component {...pageProps} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
