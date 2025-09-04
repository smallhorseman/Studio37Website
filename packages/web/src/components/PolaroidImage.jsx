import React from 'react';

export function PolaroidImage({ src, alt, caption, rotation = 0, ...props }) {
  return (
    <div className="p-4 bg-white shadow-lg" style={{ transform: `rotate(${rotation}deg)` }}>
      <img src={src} alt={alt} {...props} />
      {caption && <p className="text-center mt-2 font-handwriting">{caption}</p>}
    </div>
  );
}