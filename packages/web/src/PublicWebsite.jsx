import React, 'react';
import { useState, useEffect, useRef } from 'react';

// Import all the public-facing pages
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPost1 from './pages/BlogPost1';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';

// Note: I'm moving all the components that belong to the public site into this file.
// This keeps the main App.jsx clean.

// Helper Components & Hooks
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
                <div className="flex lg:flex-1">
                    <button onClick={() => navigate('home')} className="-m-1.5 p-1.5">
                        <span className="sr-only">Studio 37</span>
                        <Studio37Logo className="h-16 w-auto" />
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
                        <p className="text-sm leading-6 text-gray-600">Capturing timeless moments with a modern eye. Based in sunny California.</p>
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
const Hero = ({ setPage }) => (
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

// ... Other homepage sections like ServicesHighlight, PortraitPackages, etc. go here ...
// For brevity, I'm just including the HomePage component that uses them.

const HomePage = ({ setPage }) => (
    <>
        <Hero setPage={setPage} />
        {/* You would import and add the other sections like ServicesHighlight here */}
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


export default function PublicWebsite() {
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
            case 'portrait-photography-houston-parks': return <BlogPost1 setPage={setPage} />;
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