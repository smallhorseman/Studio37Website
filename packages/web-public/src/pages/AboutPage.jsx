import React from 'react';
import { FadeIn } from '../App'; // Assuming FadeIn is exported from App.jsx

const stats = [
  { label: 'Founded', value: '2023' },
  { label: 'Sessions Completed', value: '500+' },
  { label: 'Happy Clients', value: '100%' },
  { label: 'Miles Traveled', value: '10,000+' },
];

const team = [
  {
    name: 'Christian',
    role: 'Founder / Lead Photographer',
    imageUrl: 'https://placehold.co/500x500/36454F/FFFDF6?text=Christian',
  },
  // Add more team members here if you like
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
          </svg>
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#D2B48C] to-[#468289] opacity-20"
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <FadeIn>
                    <h1 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">
                      We're storytellers who use cameras to write.
                    </h1>
                    <p className="relative mt-6 text-lg leading-8 text-gray-700 sm:max-w-md lg:max-w-none">
                      At Studio 37, we are passionate about capturing the authentic moments that define your story. Our philosophy is simple: create timeless, beautiful images that feel as real and vibrant as the memories themselves. We blend a modern, artistic eye with a deep appreciation for the classic, ensuring every photo is a work of art.
                    </p>
                  </FadeIn>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        src="https://placehold.co/400x600/D2B48C/FFFDF6?text=Portrait"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        src="https://placehold.co/400x600/468289/FFFDF6?text=Event"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://placehold.co/400x600/36454F/FFFDF6?text=Art"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        src="https://placehold.co/400x600/A9A9A9/FFFDF6?text=Product"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://placehold.co/400x600/D2B48C/FFFDF6?text=Family"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-[#36454F] sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg">
                    <dt>{stat.label}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-[#468289] font-serif">{stat.value}</dd>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Team section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">Meet Our Team</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We’re a dynamic group of creatives who are passionate about what we do and dedicated to delivering the best results for our clients.
              </p>
            </div>
          </FadeIn>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none"
          >
            {team.map((person) => (
              <FadeIn key={person.name}>
                <li>
                  <img className="aspect-[3/2] w-full rounded-2xl object-cover" src={person.imageUrl} alt="" />
                  <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-[#36454F]">{person.name}</h3>
                  <p className="text-base leading-7 text-gray-600">{person.role}</p>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}