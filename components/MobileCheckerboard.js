import React, { useEffect, useState } from 'react';

const MobileCheckerboard = () => {
  const rows = 15; // Increased rows to better fill screen
  const cols = 7;
  const boxes = Array.from({ length: rows * cols });

  const colors = [
    'bg-blue-300 shadow-inner', 
    'bg-green-300 shadow-inner', 
    'bg-red-300 shadow-inner', 
    'bg-yellow-300 shadow-inner', 
    'bg-purple-300 shadow-inner'
  ];
  
  const hoverColors = [
    'bg-blue-600', 
    'bg-green-600', 
    'bg-red-600', 
    'bg-yellow-500', 
    'bg-purple-600'
  ];
  
  const glowColors = [
    'shadow-[0_0_25px_rgba(37,99,235,0.8)]', 
    'shadow-[0_0_25px_rgba(22,163,74,0.8)]', 
    'shadow-[0_0_25px_rgba(220,38,38,0.8)]', 
    'shadow-[0_0_25px_rgba(234,179,8,0.8)]',
    'shadow-[0_0_25px_rgba(147,51,234,0.8)]'
  ];

  const [boxColors, setBoxColors] = useState([]);
  const [hoveredBoxes, setHoveredBoxes] = useState(new Set());

  useEffect(() => {
    const generatedColors = boxes.map(() => Math.floor(Math.random() * colors.length));
    setBoxColors(generatedColors);
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredBoxes(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      setTimeout(() => {
        setHoveredBoxes(current => {
          const updated = new Set(current);
          updated.delete(index);
          return updated;
        });
      }, 2000);
      return newSet;
    });
  };

  return (
    <div className="grid grid-cols-7 gap-0 w-full h-full">
      {boxes.map((_, index) => (
        <div
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          className={`w-full relative 
            ${colors[boxColors[index]]} transition-all duration-300 
            ${hoveredBoxes.has(index) ? 
              `${hoverColors[boxColors[index]]} ${glowColors[boxColors[index]]}` : 
              ''
            }`}
          style={{ paddingBottom: '100%' }}
        />
      ))}
    </div>
  );
};

export default MobileCheckerboard; 