import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const value = {
    connected,
    setConnected,
    publicKey,
    setPublicKey,
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) return null;

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
} 