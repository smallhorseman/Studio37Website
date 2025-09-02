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
        <header className="bg-[#FFFDF6] sticky top-0 z-40 shadow-md">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link to="/" className="w-32 flex-shrink-0">
                    <Studio37Logo color="#36454F" />
                </Link>
                <div className="hidden lg:flex gap-x-10">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.page} className="text-base font-semibold text-[#36454F] hover:text-[#468289] transition">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex flex-1 justify-end">
                    <a
                        href="http://tools.studio37.cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-[#468289] px-4 py-2 text-base font-semibold text-white shadow hover:bg-[#36454F] transition"
                    >
                        Admin Login
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Header;