import React from 'react';
import { FadeIn } from '../App'; // Assuming FadeIn is exported from App.jsx

const services = [
  {
    name: 'Portrait Photography',
    description:
      'We create authentic, natural portraits that capture your unique personality. Whether it’s for individuals, families, or professional headshots, our sessions are relaxed and designed to bring out your best. We focus on genuine moments and beautiful light to create images you’ll cherish forever.',
    imageUrl: 'https://placehold.co/800x600/468289/FFFDF6?text=Portraits',
  },
  {
    name: 'Event Photography',
    description:
      'From corporate gatherings to intimate family celebrations, we provide dynamic and discreet coverage of your most important events. We focus on capturing the energy and emotion of the day, delivering a comprehensive gallery that tells the complete story of your occasion.',
    imageUrl: 'https://placehold.co/800x600/36454F/FFFDF6?text=Events',
  },
  {
    name: 'Art & Product Photography',
    description:
      'Showcase your work in the best possible light. We provide clean, creative, and high-impact photography for artists and businesses. Whether for e-commerce, catalogs, or promotional materials, our meticulous approach ensures your products and artwork look stunning and professional.',
    imageUrl: 'https://placehold.co/800x600/D2B48C/FFFDF6?text=Products',
  },
];

export default function ServicesPage({ setPage }) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#D2B48C] tracking-widest">OUR SERVICES</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">
              What We Offer
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              We provide a range of creative services to capture your most important moments and build your brand's visual identity.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 space-y-20">
          {services.map((service, index) => (
            <FadeIn key={service.name}>
              <div className={`flex flex-col lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} items-center gap-x-8 gap-y-10`}>
                <div className="lg:w-1/2">
                  <img src={service.imageUrl} alt={service.name} className="w-full h-auto object-cover rounded-xl shadow-lg" />
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold font-serif text-[#36454F]">{service.name}</h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">{service.description}</p>
                  <button
                    onClick={() => setPage('packages')}
                    className="mt-6 rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F]"
                  >
                    View Packages
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
