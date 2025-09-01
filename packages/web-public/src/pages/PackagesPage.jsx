import React from 'react';
import { useNavigate } from 'react-router-dom';      // 1. Import the navigate hook
import { FadeIn } from '../components/FadeIn';        // 2. Corrected import path for FadeIn

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

export default function PackagesPage() { // 3. Removed the setPage prop
  const navigate = useNavigate(); // 4. Initialize the navigate function

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
            <h3 className="text-2xl font-bold text-center tracking-tight text-[#36454F] mb-8 font-serif">
                Portrait Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {portraitPackages.map((pkg, idx) => (
                    <div
                        key={pkg.name}
                        className={`rounded-xl shadow-lg p-8 bg-white flex flex-col items-center border-2 ${
                            pkg.highlight
                                ? 'border-yellow-400 scale-105'
                                : 'border-gray-200'
                        } transition-transform duration-200`}
                    >
                        <h4 className="text-xl font-bold mb-2 font-serif text-[#36454F]">{pkg.name}</h4>
                        <p className="text-gray-600 mb-4">{pkg.duration}</p>
                        <ul className="mb-6 text-gray-700 list-disc list-inside text-left">
                            {pkg.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <div className="text-2xl font-bold text-[#36454F] mb-4">{pkg.price}</div>
                        <button
                            className="bg-[#36454F] text-white px-6 py-2 rounded-lg hover:bg-[#222f3e] transition"
                            onClick={() => navigate('/contact')}
                        >
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}