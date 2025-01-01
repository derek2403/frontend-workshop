'use client'
import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import Checkerboard from '../components/Checkerboard';
import MobileCheckerboard from '../components/MobileCheckerboard';
import ConnectWallet from '../components/ConnectWallet';

const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

export default function Home() {
  const isMobile = useDeviceDetect();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900">
      {isClient && (
        <>
          <ConnectWallet isMobile={isMobile} />
          <Logo isMobile={isMobile} />
          {isMobile ? (
            <div className="w-full h-screen">
              <MobileCheckerboard />
            </div>
          ) : (
            <Checkerboard />
          )}
        </>
      )}
    </div>
  );
}
