import React from 'react';
import { FadeIn } from '../App'; // Assuming FadeIn is exported from App.jsx

const portraitPackages = [
    {
        name: 'The Mini Reel',
        duration: '15 Minute Session',
        features: [
            '15 Edited & Polished Photos',
            '1 Free Polaroid Print On-Site',
            '1 Minute Video Free of Charge',
            'Option to Add Photo Book',
        ],
        price: '$150',
    },
    {
        name: 'The Full Episode',
        duration: '30 Minute Session',
        features: [
            '30 Edited & Polished Photos',
            '1 Free Polaroid Print On-Site',
            '1 Minute Video Free of Charge',
            'Option to Add Photo Book',
        ],
        price: '$275',
        highlight: true,
    },
    {
        name: 'The Epic Saga',
        duration: '1 Hour Session',
        features: [
            '60 Edited & Polished Photos',
            '1 Free Polaroid Print On-Site',
            '1 Minute Video Free of Charge',
            'Option to Add Photo Book',
        ],
        price: '$500',
    },
];

export default function PackagesPage({ setPage }) {
  return (
    <div className="bg-[#FFFDF6] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">
              Our Photography Packages
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Simple, transparent pricing to fit your needs. Custom packages are available upon request.
            </p>
          </div>
        </FadeIn>

        {/* Portrait Packages Section */}
        <div className="mt-16">
            <h3 className="text-2xl font-bold text-center tracking-tight text-[#36454F] font-serif">Portrait Packages</h3>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {portraitPackages.map((pkg) => (
                    <FadeIn key={pkg.name}>
                        <div className={`rounded-3xl p-8 ring-1 xl:p-10 ${pkg.highlight ? 'ring-2 ring-[#468289] bg-gray-50' : 'ring-gray-200'}`}>
                            <h3 className="text-lg font-semibold leading-8 text-[#36454F]">{pkg.name}</h3>
                            <p className="mt-4 text-sm leading-6 text-gray-600">{pkg.duration}</p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-[#36454F]">{pkg.price}</span>
                            </p>
                            <button
                                onClick={() => setPage('contact')}
                                className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${pkg.highlight ? 'bg-[#468289] text-white hover:bg-[#36454F]' : 'bg-white text-[#468289] ring-1 ring-inset ring-[#468289] hover:bg-gray-50'}`}
                            >
                                Book Now
                            </button>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                                {pkg.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <svg className="h-6 w-5 flex-none text-[#468289]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>

        {/* Placeholder for Event Packages */}
        <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-[#36454F] font-serif">Event & Commercial Packages</h3>
            <p className="mt-4 text-lg leading-8 text-gray-600">
                Coverage for events and commercial projects is customized to your specific needs. Please get in touch for a detailed quote.
            </p>
            <button
                onClick={() => setPage('contact')}
                className="mt-6 rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F]"
            >
                Request a Quote
            </button>
        </div>
      </div>
    </div>
  );
}
