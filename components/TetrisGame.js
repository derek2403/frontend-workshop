import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey, Connection } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PROGRAM_ID, GAME_POOL_SEED, NETWORK } from '../constants';
import idl from '../idl/mysolprogram.json';

// Dynamically import Phaser with no SSR
const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false
});

const TouchControls = ({ onLeft, onRight, onDown, onRotate }) => {
  const [activeButtons, setActiveButtons] = useState({});

  const handleButtonPress = (action) => ({
    onTouchStart: () => {
      setActiveButtons(prev => ({ ...prev, [action]: true }));
      switch (action) {
        case 'left': onLeft(); break;
        case 'right': onRight(); break;
        case 'down': onDown(); break;
        case 'rotate': onRotate(); break;
      }
    },
    onTouchEnd: () => {
      setActiveButtons(prev => ({ ...prev, [action]: false }));
    },
    onMouseDown: () => {
      setActiveButtons(prev => ({ ...prev, [action]: true }));
      switch (action) {
        case 'left': onLeft(); break;
        case 'right': onRight(); break;
        case 'down': onDown(); break;
        case 'rotate': onRotate(); break;
      }
    },
    onMouseUp: () => {
      setActiveButtons(prev => ({ ...prev, [action]: false }));
    }
  });

  const buttonStyle = {
    touchAction: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
  };

  const getButtonClass = (action) => `
    bg-gray-800 rounded-lg p-4 
    ${activeButtons[action] ? 'bg-gray-700' : ''} 
    text-white text-2xl select-none 
    active:bg-gray-700 
    transition-colors
  `;

  return (
    <div className="grid grid-cols-3 mt-[-100px] gap-2 w-full" style={{ touchAction: 'none' }}>
      <button
        className={getButtonClass('left')}
        style={buttonStyle}
        {...handleButtonPress('left')}
      >
        ◀
      </button>
      <div className="grid grid-cols-1 gap-2">
        <button
          className={getButtonClass('rotate')}
          style={buttonStyle}
          {...handleButtonPress('rotate')}
        >
          ⟳
        </button>
        <button
          className={getButtonClass('down')}
          style={buttonStyle}
          {...handleButtonPress('down')}
        >
          ▼
        </button>
      </div>
      <button
        className={getButtonClass('right')}
        style={buttonStyle}
        {...handleButtonPress('right')}
      >
        ▶
      </button>
    </div>
  );
};

const TetrisGame = ({ onClose, isMobile }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = wallet;
  const [depositAmount, setDepositAmount] = useState('');
  const [totalPool, setTotalPool] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const gameRef = useRef(null);
  const [gameScene, setGameScene] = useState(null);
  const SCORE_TO_BEAT = 14500;

  const [gamePoolPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(GAME_POOL_SEED)],
    PROGRAM_ID
  );

  // Create provider
  const getProvider = () => {
    if (!wallet || !connection || !publicKey) return null;
    
    return new AnchorProvider(
      connection,
      wallet,
      { 
        commitment: 'processed',
        preflightCommitment: 'processed'
      }
    );
  };

  const depositSOL = async (amount) => {
    if (!publicKey || !sendTransaction) {
      console.error("Please connect your wallet!");
      return;
    }

    try {
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('57MPqv1F2cFw8zUEw4JeYJassnGnCR6XoHCwWkoAWTAp'),
          lamports: lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log('Sending transaction...');
      const signature = await sendTransaction(transaction, connection);
      
      console.log("Transaction sent:", signature);
      const confirmation = await connection.confirmTransaction(signature);
      console.log("Transaction confirmed:", confirmation);

      // Update total pool amount after successful transaction
      setTotalPool(prevTotal => prevTotal + amount);
      setDepositAmount(''); // Clear input after successful transaction

    } catch (error) {
      console.error("Error sending SOL:", error);
      console.error("Error details:", {
        publicKey: publicKey?.toString(),
        error: error.toString()
      });
    }
  };

  const getPoolBalance = async () => {
    if (!publicKey) return;

    try {
      const provider = getProvider();
      if (!provider) return;

      const program = new Program(idl, PROGRAM_ID, provider);
      const account = await program.account.gamePool.fetch(gamePoolPDA);
      setPoolBalance(account.totalPool / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error getting pool balance:", error);
    }
  };

  const initializeGamePool = async () => {
    if (!publicKey || !sendTransaction) {
      console.error("Please connect your wallet!");
      return;
    }

    try {
      const provider = getProvider();
      if (!provider) {
        console.error("Provider not initialized");
        return;
      }

      // Get PDA
      const [gamePoolPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("game_pool")],  // Match the seeds in Rust program
        new PublicKey(PROGRAM_ID)
      );

      console.log('Initializing with:', {
        gamePoolPDA: gamePoolPDA.toString(),
        authority: publicKey.toString(),
      });

      // Create program instance
      const program = new Program(
        idl,
        new PublicKey(PROGRAM_ID),
        provider
      );

      // Create transaction
      const tx = await program.methods
        .initialize()
        .accounts({
          gamePool: gamePoolPDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Initialization sent:", tx);
      
      const confirmation = await connection.confirmTransaction(tx);
      console.log("Initialization confirmed:", confirmation);

      await getPoolBalance();
    } catch (error) {
      console.error("Error initializing game pool:", error);
      console.error("Error details:", {
        publicKey: publicKey?.toString(),
        programId: PROGRAM_ID.toString(),
        error: error.toString()
      });
    }
  };

  
  const checkGamePool = async () => {
    if (!publicKey) return;

    try {
      const [gamePoolPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID
      );

      const accountInfo = await connection.getAccountInfo(gamePoolPDA);
      console.log('Game Pool Account:', {
        exists: !!accountInfo,
        address: gamePoolPDA.toString(),
        data: accountInfo
      });
    } catch (error) {
      console.error("Error checking game pool:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (publicKey) {
      getPoolBalance();
    }
  }, [publicKey]);

  useEffect(() => {
    if (gameRef.current?.scene?.scenes[0]) {
      setGameScene(gameRef.current.scene.scenes[0]);
    }
  }, [isClient]);

  const handleControl = (key) => {
    if (!gameScene) return;
    
    try {
      gameScene.handleMobileControl(key);
    } catch (error) {
      console.error('Error handling control:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-gray-900 p-3 rounded-lg">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-purple-400 text-xl"
        >
          ✕
        </button>
        <div className={`flex ${isMobile ? 'flex-col gap-1' : 'flex-row gap-4'}`}>
          {isClient && <PhaserGame isMobile={isMobile} ref={gameRef} />}
          <div className="space-y-1">
            {isMobile && (
              <TouchControls
                onLeft={() => handleControl('left')}
                onRight={() => handleControl('right')}
                onDown={() => handleControl('down')}
                onRotate={() => handleControl('rotate')}
              />
            )}
            <div className={`${isMobile ? 'flex flex-row justify-between' : 'w-28'} bg-gray-800 rounded-lg p-2`}>
              <div className="space-y-1">
                <h2 className="text-xs font-bold text-white">NEXT</h2>
                <div id="next-block" className="w-16 h-16 bg-gray-900 rounded"></div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-bold text-white">SCORE</h2>
                <p className="text-lg font-mono text-white" id="score">0</p>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-gray-400">Score to beat</p>
                  <p className="text-xs font-mono text-purple-400">{SCORE_TO_BEAT}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">POOL</p>
                  <p className="text-sm font-mono text-white">{totalPool.toFixed(2)} SOL</p>
                </div>
                <button 
                  onClick={() => depositSOL(parseFloat(depositAmount))}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
                  disabled={!publicKey || !depositAmount || parseFloat(depositAmount) <= 0}
                >
                  Send
                </button>
              </div>
              <input 
                type="number" 
                placeholder="Amount in SOL"
                className="w-full bg-gray-900 text-white rounded px-2 py-1 text-xs mt-1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame; 