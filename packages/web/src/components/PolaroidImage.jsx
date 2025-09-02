import React from 'react';
import { FadeIn } from './FadeIn';

export const PolaroidImage = ({ src, alt, caption, rotation, className }) => {
  const style = { transform: `rotate(${rotation || 0}deg)` };

  return (
    <FadeIn>
      <div 
        className={`bg-white p-4 pb-16 shadow-xl rounded-xl relative inline-block transition-transform hover:scale-105 hover:z-10 ${className}`}
        style={style}
      >
        <img src={src} alt={alt} className="w-full h-auto object-cover rounded" />
        {caption && (
          <p className="absolute bottom-4 left-4 right-4 text-center font-handwriting text-lg text-soft-charcoal">
            {caption}
          </p>
        )}
      </div>
    </FadeIn>
  );
};