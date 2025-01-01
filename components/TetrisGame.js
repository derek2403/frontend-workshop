import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

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
  const [isClient, setIsClient] = useState(false);
  const gameRef = useRef(null);
  const [gameScene, setGameScene] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      <div className="relative bg-gray-900 p-4 rounded-lg max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-purple-400 text-xl"
        >
          ✕
        </button>
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
          {isClient && <PhaserGame isMobile={isMobile} ref={gameRef} />}
          <div className="space-y-2">
            {isMobile && (
              <TouchControls
                onLeft={() => handleControl('left')}
                onRight={() => handleControl('right')}
                onDown={() => handleControl('down')}
                onRotate={() => handleControl('rotate')}
              />
            )}
            <div className={`${isMobile ? 'flex flex-row justify-between' : 'w-28'} bg-gray-800 rounded-lg p-3`}>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">NEXT</h2>
                <div id="next-block" className="w-20 h-20 bg-gray-900 rounded"></div>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">SCORE</h2>
                <p className="text-xl font-mono text-white" id="score">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame; 