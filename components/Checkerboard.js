import React, { useEffect, useState } from 'react';

const Checkerboard = () => {
  const rows = 21;
  const cols = 40;
  const boxes = Array.from({ length: rows * cols });

  // Softer Tetris colors
  const colors = ['bg-blue-300', 'bg-green-300', 'bg-red-300', 'bg-yellow-300', 'bg-purple-300'];
  const hoverColors = ['hover:bg-blue-500', 'hover:bg-green-500', 'hover:bg-red-500', 'hover:bg-yellow-600', 'hover:bg-purple-500'];
  const glowColors = ['shadow-blue-500', 'shadow-green-500', 'shadow-red-500', 'shadow-yellow-600', 'shadow-purple-500'];

  const [boxColors, setBoxColors] = useState([]);

  useEffect(() => {
    const generatedColors = boxes.map(() => Math.floor(Math.random() * colors.length));
    setBoxColors(generatedColors);
  }, []);

  return (
    <div className="grid grid-cols-40 w-full h-full" style={{ height: '100vh' }}>
      {boxes.map((_, index) => (
        <div
          key={index}
          className={`w-full ${colors[boxColors[index]]} ${hoverColors[boxColors[index]]} transition-all duration-300 ${glowColors[boxColors[index]]} hover:shadow-2xl`}
          style={{ paddingBottom: '100%', animation: 'hoverEffect 3s forwards' }}
        />
      ))}
    </div>
  );
};

export default Checkerboard; 