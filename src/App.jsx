import React, { useState, useEffect, useRef } from 'react';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPost1 from './pages/BlogPost1';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import DashboardPage from './pages/DashboardPage'; // Import the new DashboardPage

// Helper Components & Hooks (Exported so other pages can use it)
export const FadeIn = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {children}
    </div>
  );
};

// SVG Logo Component
const Studio37Logo = ({ className, color = "#36454F" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M85,45 L85,30 A5,5 0 0,0 80,25 L20,25 A5,5 0 0,0 15,30 L15,65 A5,5 0 0,0 20,70 L80,70 A5,5 0 0,0 85,65 L85,55" />
            <path d="M25,30 L25,20 L35,20 L35,30" />
            <circle cx="50" cy="47" r="12" />
            <circle cx="50" cy="47" r="6" />
            <rect x="68" y="30" width="10" height="5" />
            <path d="M20,70 L80,70 L75,80 L25,80 Z" />
            <path d="M85,45 L90,45 L90,55 L85,55" />
        </g>
        <text x="50" y="92" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={color}>studio 37</text>
        <text x="50" y="99" textAnchor="middle" fontFamily="monospace" fontSize="4" fill={color}>Capture create. connect.</text>
    </svg>
);

// Site-wide Layout Components
const navigation = [
    { name: 'Services', page: 'services' },
    { name: 'Packages', page: 'packages' },
    { name: 'Portfolio', page: 'portfolio' },
    { name: 'About', page: 'about' },
    { name: 'Blog', page: 'blog' },
    { name: 'Dashboard', page: 'dashboard' }, // Added Dashboard link
];

const Header = ({ setPage }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = (page) => {
        setPage(page);
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    };
    return (
        <header className="bg-[#FFFDF6] sticky top-0 z-40 shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 items-center">
                    <button onClick={() => navigate('home')} className="-m-1.5 p-1.5 flex items-center">
                        <span className="sr-only">Studio 37</span>
                        <Studio37Logo className="h-16 w-auto" />
                        <div className="hidden lg:block ml-4">
                            <p className="text-sm font-semibold text-[#36454F] tracking-wider">Life's a movie; let us capture your highlight reel.</p>
                        </div>
                    </button>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(true)}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <button key={item.name} onClick={() => navigate(item.page)} className="text-sm font-semibold leading-6 text-[#36454F] hover:text-gray-600 tracking-wider">
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <button onClick={() => navigate('contact')} className="text-sm font-semibold leading-6 text-[#36454F]">
                        Contact Us <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </nav>
            {mobileMenuOpen && (
                 <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-50" />
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#FFFDF6] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <button onClick={() => navigate('home')} className="-m-1.5 p-1.5">
                                <span className="sr-only">Studio 37</span>
                                <Studio37Logo className="h-16 w-auto" />
                            </button>
                            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <button key={item.name} onClick={() => navigate(item.page)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#36454F] hover:bg-gray-50">
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <button onClick={() => navigate('contact')} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#36454F] hover:bg-gray-50">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer = ({ setPage }) => {
    const socials = [
        { name: 'Facebook', href: '#', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg> },
        { name: 'Instagram', href: '#', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.74 2 8.333.017 7.053.017 5.77.017 5.363 2 2.088 2c-3.276 0-3.276-.017-3.276-3.276C-1.188 5.363 2 5.77 2 7.053c0 1.283.017 1.69.017 2.97 0 1.28.017 1.687-.017 2.97-.033 1.283-2.088 1.69-2.088 2.97 0 3.276.017 3.276 3.276 3.276 1.28 0 1.687-.017 2.97-.017 1.283 0 1.69.017 2.97.017 1.28 0 1.687-.017 2.97-.017 1.283 0 1.69-2.088 2.97-2.088 3.276-3.276 3.276-3.276 3.276-3.276 0-1.28-.017-1.687-.017-2.97 0-1.28-.017-1.69.017-2.97.033-1.283 2.088-1.69 2.088-2.97C22 5.77 21.983 5.363 21.983 2.088 21.983-.188 18.724 2 15.45 2c-1.28 0-1.687.017-2.97.017-1.283 0-1.69-.017-2.97-.017zm0 4.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7zM16.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" /></svg> },
        { name: 'Pinterest', href: '#', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.623 0-2.433-1.75-4.12-4.18-4.12-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.582-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621C9.282 21.438 10.6 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg> },
    ];
    const navigate = (page) => { setPage(page); window.scrollTo(0, 0); };
    return (
        <footer className="bg-gray-50" aria-labelledby="footer-heading">
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Studio37Logo className="h-20 w-auto" />
                        <p className="text-sm leading-6 text-gray-600">Life's a movie; let us capture your highlight reel.</p>
                        <div className="flex space-x-6">
                            {socials.map((item) => (<a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500"><span className="sr-only">{item.name}</span><item.icon className="h-6 w-6" aria-hidden="true" /></a>))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                           <div>
                                <h3 className="text-sm font-semibold leading-6 text-[#36454F]">Navigation</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.map((item) => (<li key={item.name}><button onClick={() => navigate(item.page)} className="text-sm leading-6 text-gray-600 hover:text-[#36454F]">{item.name}</button></li>))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-[#36454F]">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-[#36454F]">Privacy</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-[#36454F]">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
                    <h3 className="text-sm font-semibold leading-6 text-[#36454F]">Serving Houston and Southeast Texas</h3>
                    <p className="mt-4 text-xs leading-5 text-gray-500">
                        Studio 37 offers professional portrait, event, and product photography services in Houston, Texas, and surrounding communities. We proudly serve clients in The Woodlands, Spring, Conroe, Humble, Kingwood, Cypress, Tomball, and throughout Montgomery and Harris County. If you're looking for a trusted photographer within a 100-mile radius of 77363, contact us for your next project.
                    </p>
                </div>
                <div className="mt-8 border-t border-gray-900/10 pt-8">
                    <p className="text-xs leading-5 text-gray-500">&copy; 2025 Studio 37. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// Homepage Section Components
const Hero = ({ setPage }) => {
    return (
        <div className="bg-[#FFFDF6]">
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#D2B48C] to-[#468289] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <FadeIn>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">Timeless Images, Modern Vision.</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-700">Your premier Houston photographer for portrait, event, and product sessions that capture your story with a blend of vintage warmth and cutting-edge quality.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <button onClick={() => setPage('contact')} className="rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Book a Consultation</button>
                                <button onClick={() => setPage('portfolio')} className="text-sm font-semibold leading-6 text-[#36454F]">View Our Work <span aria-hidden="true">→</span></button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

const services = [
    { name: 'Portrait Photography', page: 'portraits', description: 'Authentic portraits for individuals, families, and professionals.', imageUrl: 'https://tinyurl.com/ysfnsfmy' },
    { name: 'Event Photography', page: 'events', description: 'Dynamic coverage of your special events, from corporate to personal.', imageUrl: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756085532/IMG_0324_convert.io_1_e3mxvp_e_gen_restore_e_improve_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.20_o_80_fl_layer_apply_g_south_west_x_0.03_y_0.04_qvk9ki.jpg', rotation: 'transform rotate-2' },
    { name: 'Art & Product Photography', page: 'products', description: 'Creative shots of your products or artwork for e-commerce.', imageUrl: 'https://res.cloudinary.com/dmjxho2rl/image/upload//l_image:upload:My Brand:IMG_2115_mtuowt/c_scale,fl_relative,h_0.44,o_40/fl_layer_apply,g_north,x_0.03,y_0.04/v1756083844/54617933737_4760a0cf8b_b_uygijd.jpg', rotation: 'transform rotate-1' },
    { name: 'Professional Services', page: 'packages', description: 'Comprehensive brand packages including photography and strategy.', imageUrl: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756082735/54740994305_b99379cf95_h_ky7is7.jpg', rotation: 'transform -rotate-1' }
];

const ServicesHighlight = ({ setPage }) => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-[#D2B48C] tracking-widest">WHAT WE DO</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">Our Photographic Services</p>
                        <p className="mt-6 text-lg leading-8 text-gray-700">We provide a range of creative services to capture your most important moments and build your brand's visual identity.</p>
                    </div>
                </FadeIn>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <FadeIn>
                        <div className="grid grid-cols-1 gap-y-16 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
                            {services.map((service) => (
                                <button key={service.name} onClick={() => setPage(service.page)} className="group flex flex-col items-center text-center">
                                    <div className={`bg-white p-4 pb-8 shadow-lg transition-transform duration-300 group-hover:shadow-2xl group-hover:scale-105 ${service.rotation}`}>
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-auto object-cover" />
                                        <h3 className="mt-6 text-xl font-semibold font-serif text-[#36454F]">{service.name}</h3>
                                    </div>
                                    <p className="mt-6 text-base leading-7 text-gray-600 px-4">{service.description}</p>
                                </button>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

const portraitPackages = [
    { name: 'The Mini Reel', duration: '15 Minute Session', features: ['15 Edited & Polished Photos', '1 Free Polaroid Print On-Site', '1 Minute Video Free of Charge', 'Option to Add Photo Book'], price: '$150' },
    { name: 'The Full Episode', duration: '30 Minute Session', features: ['30 Edited & Polished Photos', '1 Free Polaroid Print On-Site', '1 Minute Video Free of Charge', 'Option to Add Photo Book'], price: '$275', highlight: true },
    { name: 'The Epic Saga', duration: '1 Hour Session', features: ['60 Edited & Polished Photos', '1 Free Polaroid Print On-Site', '1 Minute Video Free of Charge', 'Option to Add Photo Book'], price: '$500' },
];

const PortraitPackages = ({ setPage }) => {
    return (
        <div className="bg-[#FFFDF6] py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">Portrait Packages</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-700">Perfect for individuals, couples, and families. Choose a package that tells your story.</p>
                    </div>
                </FadeIn>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {portraitPackages.map((pkg) => (
                        <FadeIn key={pkg.name}>
                            <div className={`rounded-3xl p-8 ring-1 xl:p-10 ${pkg.highlight ? 'ring-2 ring-[#468289] bg-gray-50' : 'ring-gray-200'}`}>
                                <h3 className="text-lg font-semibold leading-8 text-[#36454F]">{pkg.name}</h3>
                                <p className="mt-4 text-sm leading-6 text-gray-600">{pkg.duration}</p>
                                <p className="mt-6 flex items-baseline gap-x-1"><span className="text-4xl font-bold tracking-tight text-[#36454F]">{pkg.price}</span></p>
                                <button onClick={() => setPage('contact')} className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${pkg.highlight ? 'bg-[#468289] text-white hover:bg-[#36454F]' : 'bg-white text-[#468289] ring-1 ring-inset ring-[#468289] hover:bg-gray-50'}`}>Book Now</button>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                                    {pkg.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <svg className="h-6 w-5 flex-none text-[#468289]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
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
                        <h2 className="text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">Unlock Our Full Portfolio<br />See the stories we've told.</h2>
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
                                <input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#468289] sm:text-sm sm:leading-6" placeholder="Enter password" />
                                <button type="submit" className="mt-3 sm:mt-0 sm:ml-4 flex-none rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F]">Unlock</button>
                            </form>
                        )}
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

// Page Components
const HomePage = ({ setPage }) => (
    <>
        <Hero setPage={setPage} />
        <ServicesHighlight setPage={setPage} />
        <PortraitPackages setPage={setPage} />
        <PortfolioUnlock />
    </>
);

const PlaceholderPage = ({ title, children }) => (
    <div className="bg-[#FFFDF6] px-6 py-24 sm:py-32 lg:px-8 min-h-screen">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">{title}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
                {children || 'This page is currently under construction. Please check back soon for updates!'}
            </p>
        </div>
    </div>
);

// Main App Component
function App() {
    const [page, setPage] = useState('home');

    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage setPage={setPage} />;
            case 'services': return <ServicesPage setPage={setPage} />;
            case 'packages': return <PackagesPage setPage={setPage} />;
            case 'portfolio': return <PortfolioPage />;
            case 'about': return <AboutPage />;
            case 'blog': return <BlogPage setPage={setPage} />;
            case 'contact': return <ContactPage />;
            case 'dashboard': return <DashboardPage />; // Added Dashboard page
            case 'portrait-photography-houston-parks': return <BlogPost1 setPage={setPage} />;
            // Individual Service Pages
            case 'portraits': return <PlaceholderPage title="Portrait Photography" />;
            case 'events': return <PlaceholderPage title="Event Photography" />;
            case 'products': return <PlaceholderPage title="Art & Product Photography" />;
            default: return <HomePage setPage={setPage} />;
        }
    };

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600;700&display=swap');
                    body { font-family: 'Inter', sans-serif; background-color: #FFFDF6; }
                    .font-serif { font-family: 'DM Serif Display', serif; }
                `}
            </style>
            <Header setPage={setPage} />
            <main>{renderPage()}</main>
            <Footer setPage={setPage} />
        </>
    );
}

export default App;
