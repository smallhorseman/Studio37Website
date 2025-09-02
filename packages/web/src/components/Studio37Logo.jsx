import React from 'react';

const Studio37Logo = ({ className, color = "#36454F" }) => (
    <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M85,25 L85,15 A2.5,2.5 0 0,0 82.5,12.5 L17.5,12.5 A2.5,2.5 0 0,0 15,15 L15,30 A2.5,2.5 0 0,0 17.5,32.5 L82.5,32.5 A2.5,2.5 0 0,0 85,30 L85,25" />
            <path d="M22.5,15 L22.5,10 L32.5,10 L32.5,15" />
            <circle cx="50" cy="22.5" r="8" />
            <circle cx="50" cy="22.5" r="4" />
            <rect x="68" y="15" width="8" height="3" />
            <path d="M85,25 L90,25 L90,30 L85,30" />
        </g>
        <text x="50" y="38" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={color}>studio 37</text>
    </svg>
);

export default Studio37Logo;