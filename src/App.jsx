import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

// Page Imports
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPost1 from './pages/BlogPost1';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

// Helper Components
export const FadeIn = ({ children }) => {
    // This component remains unchanged
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);
    return (
        <div ref={ref} className={`transition-all duration-1000 ease-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {children}
        </div>
    );
};

export const Studio37Logo = ({ className, color = "#36454F" }) => (
    // This component remains unchanged
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M85,45 L85,30 A5,5 0 0,0 80,25 L20,25 A5,5 0 0,0 15,30 L15,65 A5,5 0 0,0 20,70 L80,70 A5,5 0 0,0 85,65 L85,55" /><path d="M25,30 L25,20 L35,20 L35,30" /><circle cx="50" cy="47" r="12" /><circle cx="50" cy="47" r="6" /><rect x="68" y="30" width="10" height="5" /><path d="M20,70 L80,70 L75,80 L25,80 Z" /><path d="M85,45 L90,45 L90,55 L85,55" /></g><text x="50" y="92" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={color}>studio 37</text><text x="50" y="99" textAnchor="middle" fontFamily="monospace" fontSize="4" fill={color}>Capture create. connect.</text></svg>
);


// Site-wide Layout Components (Updated for Router)
const navigation = [
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="bg-[#FFFDF6] sticky top-0 z-40 shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Studio 37</span>
                        <Studio37Logo className="h-16 w-auto" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.path} className="text-sm font-semibold leading-6 text-[#36454F] hover:text-gray-600 tracking-wider">
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
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="-m-1.5 p-1.5"><Studio37Logo className="h-16 w-auto" /></Link>
                            <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#36454F] hover:bg-gray-50">{item.name}</Link>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#36454F] hover:bg-gray-50">Contact Us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer = () => { /* Footer remains the same, but using Link instead of button */
    return ( 
        <footer className="bg-gray-50" aria-labelledby="footer-heading">
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Studio37Logo className="h-20 w-auto" />
                        <p className="text-sm leading-6 text-gray-600">Capturing timeless moments with a modern eye. Based in Houston, TX.</p>
                    </div>
                     <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                         <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                 <h3 className="text-sm font-semibold leading-6 text-[#36454F]">Navigation</h3>
                                 <ul role="list" className="mt-6 space-y-4">
                                     {navigation.map((item) => (<li key={item.name}><Link to={item.path} className="text-sm leading-6 text-gray-600 hover:text-[#36454F]">{item.name}</Link></li>))}
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
                     <p className="text-xs leading-5 text-gray-500">&copy; 2025 Studio 37. All rights reserved.</p>
                 </div>
            </div>
        </footer>
    );
};

// Homepage Component (extracted for clarity)
const HomePage = () => { /* Your Hero, ServicesHighlight, etc. would go here */ 
    return (
      <div className="bg-[#FFFDF6] text-center py-56">
        <h1 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">Timeless Images, Modern Vision.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">Your premier Houston photographer for portrait, event, and product sessions.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/contact" className="rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F]">Book a Consultation</Link>
            <Link to="/portfolio" className="text-sm font-semibold leading-6 text-[#36454F]">View Our Work <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    );
};

// Main App Component
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600;700&display=swap'); body { font-family: 'Inter', sans-serif; background-color: #FFFDF6; } .font-serif { font-family: 'DM Serif Display', serif; }`}</style>
            
            <Header />
            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/portrait-photography-houston-parks" element={<BlogPost1 />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Login Route */}
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                    {/* Protected Admin Route */}
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            isAuthenticated ? (
                                <AdminDashboard onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />

                    {/* Fallback Route for unknown paths */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

// Wrap App in BrowserRouter in main.jsx or here
const AppWrapper = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default AppWrapper;
