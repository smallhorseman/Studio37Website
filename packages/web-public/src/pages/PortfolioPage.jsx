import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn'; // Corrected import path
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Sample images for the portfolio.
const portfolioImages = [
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756078425/IMG_4184_convert.io_5_sjszhb.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077375/54708498315_242445c364_k_q9qsvb.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077413/54681762735_f45c949a98_h_jadlln.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077261/54707332078_c4a60a9e45_k_per4mx.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756081262/Untitled_convert.io_jnf0gn_aclplu.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1724213264/IMG_4281_1_vq6zsv.jpg' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1724213260/IMG_4279_1_gacggr.jpg' },
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