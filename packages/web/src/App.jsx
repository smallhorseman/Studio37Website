import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// We will need to re-create these files in the `src/pages` folder.
// For now, we'll define them as simple placeholders here.
const HomePage = () => <div>HomePage Content</div>;
const ServicesPage = () => <div>ServicesPage Content</div>;
const PackagesPage = () => <div>PackagesPage Content</div>;
const PortfolioPage = () => <div>PortfolioPage Content</div>;
const AboutPage = () => <div>AboutPage Content</div>;
const BlogPage = () => <div>BlogPage Content</div>;
const BlogPost1 = () => <div>BlogPost1 Content</div>;
const ContactPage = () => <div>ContactPage Content</div>;
const DashboardPage = () => <div>DashboardPage Content</div>;


// Helper: Scrolls to top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
    { name: 'Services', href: '/services' },
    { name: 'Packages', href: '/packages' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="bg-[#FFFDF6] sticky top-0 z-40 shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                        <span className="sr-only">Studio 37</span>
                        <Studio37Logo className="h-16 w-auto" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(true)}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-[#36454F] hover:text-gray-600 tracking-wider">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link to="/contact" className="text-sm font-semibold leading-6 text-[#36454F]">
                        Contact Us <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </nav>
            {mobileMenuOpen && (
                 <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-50" />
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#FFFDF6] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                                <span className="sr-only">Studio 37</span>
                                <Studio37Logo className="h-16 w-auto" />
                            </Link>
                            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#36454F] hover:bg-gray-50">
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#36454F] hover:bg-gray-50">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/post-1" element={<BlogPost1 />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </main>
            {/* We can add the Footer component back in later */}
        </>
    );
}