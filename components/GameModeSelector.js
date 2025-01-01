import React, { useState } from 'react';
import TetrisGame from './TetrisGame';

const gameModes = [
  {
    name: 'Casual',
    image: '/images/casual-placeholder.png',
    description: 'Play for fun'
  },
  {
    name: 'Ranked',
    image: '/images/ranked-placeholder.png',
    description: 'Compete to win'
  },
  {
    name: 'Solo',
    image: '/images/solo-placeholder.png',
    description: 'Practice alone'
  },
  {
    name: 'Tutorial',
    image: '/images/tutorial-placeholder.png',
    description: 'Learn to play'
  }
];

const GameModeSelector = ({ isMobile }) => {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  if (isMobile) {
    return (
      <>
        <div className="absolute top-[300px] left-1/2 transform -translate-x-1/2 z-20 w-[80%]">
          <div className="flex flex-col gap-4">
            {gameModes.map((mode) => (
              <button
                key={mode.name}
                onClick={() => handleModeSelect(mode.name)}
                className="w-full py-4 px-6 bg-purple-900 hover:bg-purple-800 
                  rounded-lg transition-all duration-300 transform hover:scale-105
                  text-xl font-fontdiner text-white shadow-lg
                  hover:shadow-[0_0_15px_rgba(65,30,125,0.4)]"
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>
        {selectedMode === 'Casual' && (
          <TetrisGame 
            onClose={() => setSelectedMode(null)} 
            isMobile={isMobile} 
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="absolute top-[320px] left-1/2 transform -translate-x-1/2 z-20 w-full max-w-6xl px-8">
        <div className="grid grid-cols-4 gap-10">
          {gameModes.map((mode) => (
            <div 
              key={mode.name}
              onClick={() => handleModeSelect(mode.name)}
              className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-square relative rounded-lg overflow-hidden bg-purple-900">
                {/* Placeholder for image - replace src with actual images */}
                <div className="w-full h-full bg-opacity-50 flex items-center justify-center">
                  <span className="text-6xl text-white opacity-80 font-fontdiner">
                    {mode.name[0]}
                  </span>
                </div>
                
                {/* Overlay with text */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-fontdiner text-white mb-2">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-purple-200">
                    {mode.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedMode === 'Casual' && (
        <TetrisGame 
          onClose={() => setSelectedMode(null)} 
          isMobile={isMobile} 
        />
      )}
    </>
  );
};

export default GameModeSelector; 