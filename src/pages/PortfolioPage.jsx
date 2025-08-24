import React, { useState } from 'react';
import { FadeIn } from '../App'; // Assuming FadeIn is exported from App.jsx
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Sample images for the portfolio. Replace these with your actual photos.
const portfolioImages = [
  { src: 'https://placehold.co/800x600/468289/FFFDF6?text=Portrait+1' },
  { src: 'https://placehold.co/600x800/36454F/FFFDF6?text=Event+1' },
  { src: 'https://placehold.co/800x600/D2B48C/FFFDF6?text=Product+1' },
  { src: 'https://placehold.co/600x800/A9A9A9/FFFDF6?text=Family+Portrait' },
  { src: 'https://placehold.co/800x600/468289/FFFDF6?text=Candid+Moment' },
  { src: 'https://placehold.co/600x800/36454F/FFFDF6?text=Wedding+Detail' },
  { src: 'https://placehold.co/800x600/D2B48C/FFFDF6?text=Artwork+Photo' },
  { src: 'https://placehold.co/600x800/A9A9A9/FFFDF6?text=Couple+Shoot' },
];

export default function PortfolioPage() {
  const [index, setIndex] = useState(-1);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#D2B48C] tracking-widest">OUR WORK</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">
              A Glimpse Into Our Gallery
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Every photo tells a story. Explore our collection of moments captured for our wonderful clients. Click on any image to view it in full detail.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolioImages.map((photo, idx) => (
              <FadeIn key={photo.src + idx}>
                <div 
                  className="group cursor-pointer"
                  onClick={() => setIndex(idx)}
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={photo.src}
                      alt={`Portfolio image ${idx + 1}`}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={portfolioImages}
        />
      </div>
    </div>
  );
}
