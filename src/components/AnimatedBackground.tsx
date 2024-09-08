import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1e293b', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
        
        {/* Floating particles */}
        <g className="animate-float-fast">
          {[...Array(30)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 100 + '%'}
              cy={Math.random() * 100 + '%'}
              r={Math.random() * 2 + 1}
              fill="#4f46e5"
              opacity={Math.random() * 0.5 + 0.25}
            >
              <animate
                attributeName="opacity"
                values="0.25;0.5;0.25"
                dur={`${Math.random() * 2 + 1}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
        
        {/* Pulsing lines */}
        <g className="animate-pulse-fast">
          <path
            d="M0 50 Q 25 0, 50 50 T 100 50"
            stroke="#4f46e5"
            strokeWidth="0.5"
            fill="none"
            opacity="0.2"
          />
          <path
            d="M0 70 Q 25 20, 50 70 T 100 70"
            stroke="#4f46e5"
            strokeWidth="0.5"
            fill="none"
            opacity="0.2"
          />
        </g>
        
        {/* Moving squares */}
        <g className="animate-move-left-fast">
          {[...Array(5)].map((_, i) => (
            <rect
              key={i}
              x={`${i * 25}%`}
              y={Math.random() * 100 + '%'}
              width="2"
              height="2"
              fill="#4f46e5"
              opacity="0.3"
            />
          ))}
        </g>
        
        {/* Rotating triangles */}
        <g className="animate-spin-slow origin-center">
          {[...Array(3)].map((_, i) => (
            <polygon
              key={i}
              points="0,0 20,0 10,17.3"
              fill="#4f46e5"
              opacity="0.1"
              transform={`translate(${50 + i * 100}, ${50 + i * 100}) rotate(${i * 120})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default AnimatedBackground;
