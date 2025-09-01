import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn'; // Using the component from our new components folder

// --- Hero Section ---
const Hero = () => {
    return (
        <div className="bg-off-white">
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-warm-tan to-faded-teal opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <FadeIn>
                        <div className="text-center">
                            <h1 className="text-4xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-6xl">Timeless Images, Modern Vision.</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-700">Your premier Houston photographer for portrait, event, and product sessions that capture your story with a blend of vintage warmth and cutting-edge quality.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link to="/contact" className="rounded-md bg-faded-teal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-soft-charcoal">Book a Consultation</Link>
                                <Link to="/portfolio" className="text-sm font-semibold leading-6 text-soft-charcoal">View Our Work <span aria-hidden="true">→</span></Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

// --- Services Highlight Section ---
const services = [
    { name: 'Portrait Photography', href: '/services', description: 'Authentic portraits for individuals, families, and professionals.', imageUrl: 'https://placehold.co/600x600/468289/FFFDF6?text=Portrait', rotation: 'transform -rotate-2' },
    { name: 'Event Photography', href: '/services', description: 'Dynamic coverage of your special events, from corporate to personal.', imageUrl: 'https://placehold.co/600x600/36454F/FFFDF6?text=Event', rotation: 'transform rotate-2' },
    { name: 'Art & Product Photography', href: '/services', description: 'Creative shots of your products or artwork for e-commerce.', imageUrl: 'https://placehold.co/600x600/D2B48C/FFFDF6?text=Product', rotation: 'transform rotate-1' },
    { name: 'Professional Services', href: '/packages', description: 'Comprehensive brand packages including photography and strategy.', imageUrl: 'https://placehold.co/600x600/A9A9A9/FFFDF6?text=Brand', rotation: 'transform -rotate-1' }
];

const ServicesHighlight = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-warm-tan tracking-widest">WHAT WE DO</h2>
                        <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">Our Photographic Services</p>
                        <p className="mt-6 text-lg leading-8 text-gray-700">We provide a range of creative services to capture your most important moments and build your brand's visual identity.</p>
                    </div>
                </FadeIn>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <FadeIn>
                        <div className="grid grid-cols-1 gap-y-16 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
                            {services.map((service) => (
                                <Link to={service.href} key={service.name} className="group flex flex-col items-center text-center">
                                    <div className={`bg-white p-4 pb-8 shadow-lg transition-transform duration-300 group-hover:shadow-2xl group-hover:scale-105 ${service.rotation}`}>
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-auto object-cover" />
                                        <h3 className="mt-6 text-xl font-serif font-semibold text-soft-charcoal">{service.name}</h3>
                                    </div>
                                    <p className="mt-6 text-base leading-7 text-gray-600 px-4">{service.description}</p>
                                </Link>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

// --- Portrait Packages Section ---
const portraitPackages = [
    { name: 'The Mini Reel', duration: '15 Minute Session', features: ['15 Edited & Polished Photos', '1 Free Polaroid Print On-Site', '1 Minute Video Free of Charge', 'Option to Add Photo Book'], price: '$150' },
    { name: 'The Full Episode', duration: '30 Minute Session', features: ['30 Edited & Polished Photos', '1 Free Polaroid Print On-Site', '1 Minute Video Free of Charge', 'Option to Add Photo Book'], price: '$275', highlight: true },
    { name: 'The Epic Saga', duration: '1 Hour Session', features: ['60 Edited & Polished Photos', '1 Free Polaroid Print On-Site', '1 Minute Video Free of Charge', 'Option to Add Photo Book'], price: '$500' },
];

const PortraitPackages = () => {
    return (
        <div className="bg-off-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">Portrait Packages</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-700">Perfect for individuals, couples, and families. Choose a package that tells your story.</p>
                    </div>
                </FadeIn>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {portraitPackages.map((pkg) => (
                        <FadeIn key={pkg.name}>
                            <div className={`rounded-3xl p-8 ring-1 xl:p-10 ${pkg.highlight ? 'ring-2 ring-faded-teal bg-gray-50' : 'ring-gray-200'}`}>
                                <h3 className="text-lg font-semibold leading-8 text-soft-charcoal">{pkg.name}</h3>
                                <p className="mt-4 text-sm leading-6 text-gray-600">{pkg.duration}</p>
                                <p className="mt-6 flex items-baseline gap-x-1"><span className="text-4xl font-bold tracking-tight text-soft-charcoal">{pkg.price}</span></p>
                                <Link to="/contact" className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm ${pkg.highlight ? 'bg-faded-teal text-white hover:bg-soft-charcoal' : 'bg-white text-faded-teal ring-1 ring-inset ring-faded-teal hover:bg-gray-50'}`}>Book Now</Link>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                                    {pkg.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <svg className="h-6 w-5 flex-none text-faded-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Portfolio Unlock Section ---
const PortfolioUnlock = () => {
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState('');
    const handleUnlock = (e) => { e.preventDefault(); if (password === 'password123') { setIsUnlocked(true); setError(''); } else { setError('Incorrect password. Please try again.'); } };
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <FadeIn>
                    <div>
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">Unlock Our Full Portfolio<br />See the stories we've told.</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-700">Our full portfolio is available to prospective clients. Enter the password provided during your consultation to view our gallery of past work.</p>
                    </div>
                </FadeIn>
                <FadeIn>
                    <div className="mt-10 lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                        {isUnlocked ? (
                            <div className="text-center p-8 bg-gray-50 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold text-green-600">Access Granted!</h3>
                                <p className="mt-4 text-gray-600">Redirecting you to our portfolio...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleUnlock} className="sm:flex max-w-md">
                                <input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-faded-teal sm:text-sm sm:leading-6" placeholder="Enter password" />
                                <button type="submit" className="mt-3 sm:mt-0 sm:ml-4 flex-none rounded-md bg-faded-teal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-soft-charcoal">Unlock</button>
                            </form>
                        )}
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};


// --- Main HomePage Component ---
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesHighlight />
      <PortraitPackages />
      <PortfolioUnlock />
    </>
  );
}