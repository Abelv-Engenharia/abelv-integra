import React from 'react';

interface ExtintorIconProps {
  className?: string;
  size?: number;
}

export const ExtintorIcon: React.FC<ExtintorIconProps> = ({ 
  className = "", 
  size = 150 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Corpo principal do extintor */}
      <rect
        x="70"
        y="60"
        width="60"
        height="110"
        rx="8"
        fill="hsl(var(--destructive))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
      />
      
      {/* Topo do extintor */}
      <rect
        x="75"
        y="45"
        width="50"
        height="20"
        rx="4"
        fill="hsl(var(--foreground))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
      />
      
      {/* Bico do extintor */}
      <rect
        x="95"
        y="25"
        width="10"
        height="25"
        fill="hsl(var(--foreground))"
      />
      
      {/* Alavanca */}
      <path
        d="M 90 35 L 85 25 L 115 25 L 110 35"
        fill="hsl(var(--muted-foreground))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
      />
      
      {/* Manômetro (círculo) */}
      <circle
        cx="100"
        cy="80"
        r="12"
        fill="hsl(var(--background))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
      />
      
      {/* Ponteiro do manômetro */}
      <line
        x1="100"
        y1="80"
        x2="106"
        y2="74"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      
      {/* Etiqueta branca */}
      <rect
        x="80"
        y="100"
        width="40"
        height="50"
        rx="2"
        fill="hsl(var(--background))"
        stroke="hsl(var(--border))"
        strokeWidth="1"
      />
      
      {/* Linhas simulando texto na etiqueta */}
      <line x1="85" y1="110" x2="115" y2="110" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
      <line x1="85" y1="120" x2="115" y2="120" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
      <line x1="85" y1="130" x2="110" y2="130" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
      <line x1="85" y1="140" x2="115" y2="140" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
      
      {/* Base do extintor */}
      <ellipse
        cx="100"
        cy="170"
        rx="35"
        ry="8"
        fill="hsl(var(--foreground))"
      />
      
      {/* Alça de transporte */}
      <path
        d="M 70 50 Q 65 40 70 30 L 130 30 Q 135 40 130 50"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
