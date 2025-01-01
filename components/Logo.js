import React from 'react';

const Logo = () => {
  const title = "SOLtris Battle";
  
  return (
    <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 z-10">
      <h1 className="text-9xl font-fontdiner flex text-indigo-800">
        {title.split('').map((letter, index) => (
          <span 
            key={index}
            className="drop-shadow-[0_0_15px_rgba(79,70,229,0.4)] animate-wavy"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              textShadow: '3px 3px 0px rgba(79,70,229,0.3)'
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Logo; 