import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';

export default function BlogPostPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <FadeIn>
          <p className="text-base font-semibold leading-7 text-[#468289]">Photography Tips</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">The Ultimate Guide to Portrait Photography in Houston's Northern Parks</h1>
          <p className="mt-6 text-xl leading-8">Houston is known for its vibrant city life, but just a short drive north lies a world of natural beauty perfect for your next photoshoot. As professional Houston photographers, we believe that the stunning landscapes of our local state parks and national forests provide the perfect backdrop for timeless portrait photography.</p>
        </FadeIn>
        <div className="mt-10 max-w-2xl">
          <FadeIn>
            <p>Whether you're planning a family session, an engagement shoot, or senior pictures, this is the first post in our series dedicated to helping you discover the best local spots for your outdoor photography session.</p>
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-[#36454F] font-serif">Sam Houston National Forest: A Portrait Photographer's Dream</h2>
            <p className="mt-6">Covering over 163,000 acres, the Sam Houston National Forest is a versatile and breathtaking choice for portrait photography. The towering pine trees create a magical, light-dappled effect that is perfect for both morning and late afternoon sessions.</p>
            <figure className="mt-10 border-l border-[#468289] pl-9">
              <blockquote className="font-semibold text-gray-900"><p>“The forest's natural diffusion of light creates a soft, flattering look that is difficult to replicate in a studio. It’s a truly magical place for portraits.”</p></blockquote>
              <figcaption className="mt-6 flex gap-x-4"><div className="text-sm leading-6"><strong className="font-semibold text-gray-900">Studio 37</strong> – Lead Photographer</div></figcaption>
            </figure>
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-[#36454F] font-serif">Huntsville State Park: Lakeside Serenity</h2>
            <p className="mt-6">Just a bit further north, Huntsville State Park is an oasis built around the stunning Lake Raven. The park's iconic boat house and fishing piers offer a classic Texan backdrop that's hard to beat.</p>
            <div className="mt-16"><button onClick={() => navigate('/blog')} className="text-sm font-semibold leading-6 text-[#468289]">&larr; Back to Blog</button></div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}