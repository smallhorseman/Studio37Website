import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const portfolioImages = [
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg', caption: 'Houston, TX' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756078425/IMG_4184_convert.io_5_sjszhb.jpg', caption: 'Senior Portraits' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077375/54708498315_242445c364_k_q9qsvb.jpg', caption: 'Family Session' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077413/54681762735_f45c949a98_h_jadlln.jpg', caption: 'Events' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077261/54707332078_c4a60a9e45_k_per4mx.jpg', caption: 'Product Photography' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756081262/Untitled_convert.io_jnf0gn_aclplu.jpg', caption: 'City Lights' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1724213264/IMG_4281_1_vq6zsv.jpg', caption: 'Nature Walk' },
  { src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1724213260/IMG_4279_1_gacggr.jpg', caption: 'Candid Moments' },
];

export default function PortfolioPage() {
  const [index, setIndex] = useState(-1);

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">A Glimpse Into Our Gallery</h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">Every photo tells a story. Click on any image to view it in full detail.</p>
          </div>
        </FadeIn>
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {portfolioImages.map((photo, idx) => (
            <div key={idx} onClick={() => setIndex(idx)} className="cursor-pointer">
              <PolaroidImage src={photo.src} alt={`Portfolio image ${idx + 1}`} caption={photo.caption} />
            </div>
          ))}
        </div>
        <Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={portfolioImages.map(p => ({ src: p.src }))} />
      </div>
    </div>
  );
}