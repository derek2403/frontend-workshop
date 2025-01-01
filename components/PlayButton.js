import { useWallet } from '@solana/wallet-adapter-react';

const PlayButton = ({ isMobile, onPlay }) => {
  const { connected } = useWallet();

  const handlePlay = () => {
    if (connected) {
      onPlay();
    }
  };

  const buttonClasses = `
    py-6 px-12 
    bg-purple-700 hover:bg-purple-600 
    rounded-xl 
    transform hover:scale-105 
    transition-all duration-300 
    shadow-lg hover:shadow-purple-500/30
    ${isMobile ? 'text-3xl' : 'text-4xl'}
    font-fontdiner text-white
  `;

  return (
    <button
      onClick={handlePlay}
      className={buttonClasses}
    >
      PLAY NOW
    </button>
  );
};

export default PlayButton; 