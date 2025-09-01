import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';

export default function AboutPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 items-center">
          <FadeIn>
            <div>
              <h2 className="text-base font-semibold leading-7 text-warm-tan tracking-widest">OUR STORY</h2>
              <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">
                More Than a Photo, It's a Feeling
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-700">
                Studio 37 was born from a passion for storytelling. We believe the best photographs are the ones that transport you back to a moment—the laughter, the joy, the quiet connection. Our approach combines the timeless, tangible feel of vintage film with the precision of modern digital photography.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-700">
                Based right here in Houston, we find beauty in the city's diverse landscapes and the unique stories of its people. We're not just taking pictures; we're crafting memories with a blend of vintage warmth and cutting-edge quality.
              </p>
            </div>
          </FadeIn>
          <div className="flex justify-center">
             <PolaroidImage
                src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1724213256/IMG_4278_1_v83qfs.jpg"
                alt="Lead Photographer"
                caption="Ponyboy, Lead Photographer"
                rotation={2}
             />
          </div>
        </div>
      </div>
    </div>
  );
}