import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Studio37Logo from './Studio37Logo';

const navigation = [
    { name: 'Services', page: '/services' },
    { name: 'Packages', page: '/packages' },
    { name: 'Portfolio', page: '/portfolio' },
    { name: 'About', page: '/about' },
    { name: 'Blog', page: '/blog' },
];

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="bg-[#FFFDF6] sticky top-0 z-40 shadow-sm">
            <nav className="p-4 sm:px-8 flex justify-between items-center">
                <Link to="/" className="w-32"><Studio37Logo color="#36454F" /></Link>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.page} className="text-sm font-semibold leading-6 text-[#36454F] hover:text-[#468289]">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a
                        href="http://tools.studio37.cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F]"
                    >
                        Admin Login
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Header;