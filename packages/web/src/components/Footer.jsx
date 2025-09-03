import React from 'react';
import { useNavigate } from 'react-router-dom';
import Studio37Logo from './Studio37Logo';

const navigation = [
    { name: 'Services', page: '/services' },
    { name: 'Packages', page: '/packages' },
    { name: 'Portfolio', page: '/portfolio' },
    { name: 'About', page: '/about' },
    { name: 'Blog', page: '/blog' },
];

const socials = [
    // ...existing code...
];

const Footer = () => {
    const navigate = useNavigate();
    const handleNavigation = (page) => {
        navigate(page);
        window.scrollTo(0, 0);
    };
    return (
        <footer className="bg-gradient-to-t from-[#f7e9d7] to-gray-50 border-t border-gray-200" aria-labelledby="footer-heading">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                    <div className="space-y-6 flex-1">
                        <Studio37Logo className="h-20 w-auto mx-auto lg:mx-0" />
                        <p className="text-base text-gray-600 text-center lg:text-left">Capturing timeless moments with a modern eye. Based in sunny California.</p>
                        <div className="flex justify-center lg:justify-start space-x-6">
                            {socials.map((item) => (
                                <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-[#36454F] mb-4">Navigation</h3>
                            <ul className="space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <button onClick={() => handleNavigation(item.page)} className="text-sm text-gray-600 hover:text-[#36454F] transition">{item.name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#36454F] mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-sm text-gray-600 hover:text-[#36454F] transition">Privacy</a></li>
                                <li><a href="#" className="text-sm text-gray-600 hover:text-[#36454F] transition">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 text-center">
                    <h3 className="text-sm font-semibold text-[#36454F] mb-2">Serving Houston and Southeast Texas</h3>
                    <p className="text-xs text-gray-500 mb-2">
                        Studio 37 offers professional portrait, event, and product photography services in Houston, Texas, and surrounding communities. We proudly serve clients in The Woodlands, Spring, Conroe, Humble, Kingwood, Cypress, Tomball, and throughout Montgomery and Harris County. If you're looking for a trusted photographer within a 100-mile radius of 77363, contact us for your next project.
                    </p>
                    <p className="text-xs text-gray-500">
                        Studio37 • Houston, TX 77362
                    </p>
                    <p className="text-xs text-gray-500">&copy; 2025 Studio 37. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
// ...existing code...
};

export default Footer;