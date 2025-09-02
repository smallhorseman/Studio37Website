import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 text-center">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <FadeIn>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-6xl">Timeless Images, Modern Vision.</h1>
                    <p className="mt-6 text-lg leading-8 text-gray-700">Your premier Houston photographer for portrait, event, and product sessions that capture your story with a blend of vintage warmth and cutting-edge quality.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <button onClick={() => navigate('/contact')} className="rounded-md bg-faded-teal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-soft-charcoal">Book a Consultation</button>
                        <button onClick={() => navigate('/portfolio')} className="text-sm font-semibold leading-6 text-soft-charcoal">View Our Work <span aria-hidden="true">→</span></button>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

const FeaturedWork = () => (
    <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeIn>
                <div className="text-center mx-auto max-w-2xl">
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">Featured Work</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-700">A few of our favorite moments, captured forever.</p>
                </div>
            </FadeIn>
            <div className="mt-16 flex justify-center items-center gap-4 sm:gap-8 flex-wrap">
                <PolaroidImage src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg" alt="Portrait" caption="Golden Hour Session" rotation={-3} />
                <PolaroidImage src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1756078425/IMG_4184_convert.io_5_sjszhb.jpg" alt="Close up portrait" caption="Houston, TX" rotation={2} />
                <PolaroidImage src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077375/54708498315_242445c364_k_q9qsvb.jpg" alt="Event photography" caption="Sept. 2025" rotation={-1} />
            </div>
        </div>
    </div>
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
    </>
  );
}