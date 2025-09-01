import React from 'react';
import { FadeIn } from '../components/FadeIn';

const AboutPage = () => (
  <FadeIn>
    <div className="bg-[#FFFDF6] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">About Studio 37</h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-700">
                Studio 37 is your premier Houston photographer for portrait, event, and product sessions that capture your story with a blend of vintage warmth and cutting-edge quality.
            </p>
        </div>
    </div>
  </FadeIn>
);

export default AboutPage;