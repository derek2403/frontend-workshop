import React, { useEffect, useState } from 'react';

const Checkerboard = () => {
  const rows = 21;
  const cols = 40;
  const boxes = Array.from({ length: rows * cols });

  // Softer Tetris colors
  const colors = ['bg-blue-300', 'bg-green-300', 'bg-red-300', 'bg-yellow-300', 'bg-purple-300'];

  const [boxColors, setBoxColors] = useState([]);

  useEffect(() => {
    const generatedColors = boxes.map(() => colors[Math.floor(Math.random() * colors.length)]);
    setBoxColors(generatedColors);
  }, []);

  return (
    <div className="grid grid-cols-40 w-full h-screen">
      {boxes.map((_, index) => (
        <div
          key={index}
          className={`w-full ${boxColors[index]} hover:opacity-75 transition-opacity`}
          style={{ paddingBottom: '100%' }}
        />
      ))}
    </div>
  );
};

export default Checkerboard; 