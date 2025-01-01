import { useEffect, forwardRef } from 'react';
import Phaser from 'phaser';
import TetrisScene from './TetrisScene';

const PhaserGame = forwardRef(({ isMobile }, ref) => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'tetris-container',
      width: 300,
      height: 600,
      backgroundColor: '#000000',
      scene: TetrisScene,
    };

    const game = new Phaser.Game(config);
    if (ref) {
      ref.current = game;
    }

    return () => {
      game.destroy(true);
    };
  }, [isMobile, ref]);

  const containerStyle = {
    transform: isMobile ? 'scale(0.8)' : 'none',
    transformOrigin: 'top center'
  };

  return (
    <div 
      id="tetris-container" 
      className="border-2 border-gray-700 rounded-lg"
      style={containerStyle}
    ></div>
  );
});

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame; 