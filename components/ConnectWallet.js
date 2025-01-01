import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState, useEffect } from 'react';

const ConnectWallet = ({ isMobile }) => {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`absolute ${isMobile ? 'top-4 right-4' : 'top-8 right-8'} z-20`}>
      <WalletMultiButton 
        className={`wallet-adapter-button-custom ${
          connected ? 'wallet-adapter-button-connected' : ''
        }`}
      />
    </div>
  );
};

export default ConnectWallet; 