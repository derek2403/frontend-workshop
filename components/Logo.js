import React from 'react';

const Logo = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-7xl font-fontdiner">
            <span 
              className="animate-wavy"
              style={{ 
                color: '#411e7d',
                textShadow: '3px 3px 0px rgba(0,0,0,0.2)',
                filter: 'drop-shadow(0 0 15px rgba(65,30,125,0.4))'
              }}
            >
              SOLtris
            </span>
          </h1>
          <h1 className="text-5xl font-fontdiner mt-1">
            <span 
              className="animate-wavy"
              style={{ 
                color: '#411e7d',
                textShadow: '3px 3px 0px rgba(0,0,0,0.2)',
                filter: 'drop-shadow(0 0 15px rgba(65,30,125,0.4))'
              }}
            >
              Battle
            </span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 z-10">
      <h1 className="text-9xl font-fontdiner flex">
        {"SOLtris Battle".split('').map((letter, index) => (
          <span 
            key={index}
            className="animate-wavy"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              color: '#411e7d',
              textShadow: '3px 3px 0px rgba(0,0,0,0.2)',
              filter: 'drop-shadow(0 0 15px rgba(65,30,125,0.4))'
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