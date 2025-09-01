import React from 'react';
import { useNavigate } from 'react-router-dom';     // 1. Import the navigate hook
import { FadeIn } from '../components/FadeIn';       // 2. Corrected import path

export default function BlogPost1() {
  const navigate = useNavigate(); // 3. Initialize the navigate function

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <FadeIn>
          <p className="text-base font-semibold leading-7 text-[#468289]">Photography Tips</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">
            The Ultimate Guide to Portrait Photography in Houston's Northern Parks
          </h1>
          <p className="mt-6 text-xl leading-8">
            Houston is known for its vibrant city life, but just a short drive north of the 77362 area lies a world of natural beauty perfect for your next photoshoot. As professional Houston photographers, we believe that the stunning landscapes of our local state parks and national forests provide the perfect backdrop for timeless portrait photography.
          </p>
        </FadeIn>
        <div className="mt-10 max-w-2xl">
          <FadeIn>
            <p>
              Whether you're planning a family session, an engagement shoot, or senior pictures, this is the first post in our series dedicated to helping you discover the best local spots for your outdoor photography session.
            </p>

            <h2 className="mt-16 text-2xl font-bold tracking-tight text-[#36454F] font-serif">
              Sam Houston National Forest: A Portrait Photographer's Dream
            </h2>
            <p className="mt-6">
              Covering over 163,000 acres, the Sam Houston National Forest is a versatile and breathtaking choice for portrait photography. The towering pine trees create a magical, light-dappled effect that is perfect for both morning and late afternoon sessions.
            </p>
            <figure className="mt-10 border-l border-[#468289] pl-9">
              <blockquote className="font-semibold text-gray-900">
                <p>
                  “The forest's natural diffusion of light creates a soft, flattering look that is difficult to replicate in a studio. It’s a truly magical place for portraits.”
                </p>
              </blockquote>
              <figcaption className="mt-6 flex gap-x-4">
                <div className="text-sm leading-6"><strong className="font-semibold text-gray-900">Studio 37</strong> – Lead Photographer</div>
              </figcaption>
            </figure>
            <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
              <li className="flex gap-x-3">
                <span>
                  <strong className="font-semibold text-gray-900">Best For:</strong> Family portraits, individual headshots, and rustic engagement photos.
                </span>
              </li>
              <li className="flex gap-x-3">
                <span>
                  <strong className="font-semibold text-gray-900">Top Spots:</strong> The shores of Lake Conroe offer beautiful waterfront views, while the Lone Star Hiking Trail provides miles of secluded, wooded scenery.
                </span>
              </li>
            </ul>

            <h2 className="mt-16 text-2xl font-bold tracking-tight text-[#36454F] font-serif">
              Huntsville State Park: Lakeside Serenity
            </h2>
            <p className="mt-6">
              Just a bit further north, Huntsville State Park is an oasis built around the stunning Lake Raven. The park's iconic boat house and fishing piers offer a classic Texan backdrop that's hard to beat.
            </p>
            <figure className="mt-10">
              <img
                className="aspect-video w-full rounded-xl bg-gray-50 object-cover"
                src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1724213253/IMG_4275_1_b3zb2s.jpg"
                alt="Huntsville State Park"
              />
              <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
                The pier at Lake Raven during golden hour.
              </figcaption>
            </figure>
            <p className="mt-8">
              <strong className="font-semibold text-gray-900">Best For:</strong> Senior portraits and romantic couple's photography. The calm waters and lush greenery create a peaceful and intimate setting.
            </p>
             <p className="mt-6">
              <strong className="font-semibold text-gray-900">Pro Tip:</strong> Plan your session for the "golden hour"—the hour just before sunset—to capture the warm, golden light reflecting off the lake.
            </p>

            <h2 className="mt-16 text-2xl font-bold tracking-tight text-[#36454F] font-serif">
              Planning Your Park Photoshoot
            </h2>
            <p className="mt-6">
              While national and state parks are fantastic venues, it's important to remember that they are protected natural areas. Many parks require photographers to obtain a permit for commercial sessions, especially for larger setups that could be considered event photography. We handle all the necessary permits and location scouting for our clients to ensure a seamless and enjoyable experience.
            </p>
            <div className="mt-16">
              {/* 4. Use navigate for the back button */}
              <button onClick={() => navigate('/blog')} className="text-sm font-semibold leading-6 text-[#468289]">
                &larr; Back to Blog
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}