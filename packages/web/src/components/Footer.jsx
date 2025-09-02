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
    { name: 'Facebook', href: '#', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg> },
    { name: 'Instagram', href: '#', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.74 2 8.333.017 7.053.017 5.77.017 5.363 2 2.088 2c-3.276 0-3.276-.017-3.276-3.276C-1.188 5.363 2 5.77 2 7.053c0 1.283.017 1.69.017 2.97 0 1.28.017 1.687-.017 2.97-.033 1.283-2.088 1.69-2.088 2.97 0 3.276.017 3.276 3.276 3.276 1.28 0 1.687-.017 2.97-.017 1.283 0 1.69.017 2.97.017 1.28 0 1.687-.017 2.97-.017 1.283 0 1.69-2.088 2.97-2.088 3.276-3.276 3.276-3.276 3.276-3.276 0-1.28-.017-1.687-.017-2.97 0-1.28-.017-1.69.017-2.97.033-1.283 2.088-1.69 2.088-2.97C22 5.77 21.983 5.363 21.983 2.088 21.983-.188 18.724 2 15.45 2c-1.28 0-1.687.017-2.97.017-1.283 0-1.69-.017-2.97-.017zm0 4.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7zM16.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" /></svg> },
    { name: 'Pinterest', href: '#', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.623 0-2.433-1.75-4.12-4.18-4.12-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.582-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621C9.282 21.438 10.6 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg> },
];

const Footer = ({ setPage }) => {
    const navigate = useNavigate(); // <-- This is the hook we need
    const handleNavigation = (page) => {
        navigate(page);
        window.scrollTo(0, 0);
    };

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
                                    {navigation.map((item) => (<li key={item.name}><button onClick={() => handleNavigation(item.page)} className="text-sm leading-6 text-gray-600 hover:text-[#36454F]">{item.name}</button></li>))}
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

export default Footer;