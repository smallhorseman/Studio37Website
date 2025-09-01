import React from 'react';

const Studio37Logo = ({ className, color = "#36454F" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M85,45 L85,30 A5,5 0 0,0 80,25 L20,25 A5,5 0 0,0 15,30 L15,65 A5,5 0 0,0 20,70 L80,70 A5,5 0 0,0 85,65 L85,55" />
            <path d="M25,30 L25,20 L35,20 L35,30" />
            <circle cx="50" cy="47" r="12" />
            <circle cx="50" cy="47" r="6" />
            <rect x="68" y="30" width="10" height="5" />
            <path d="M20,70 L80,70 L75,80 L25,80 Z" />
            <path d="M85,45 L90,45 L90,55 L85,55" />
        </g>
        <text x="50" y="92" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={color}>studio 37</text>
        <text x="50" y="99" textAnchor="middle" fontFamily="monospace" fontSize="4" fill={color}>Capture create. connect.</text>
    </svg>
);

export default Studio37Logo;