import React, { useState } from 'react';
import Studio37Logo from './Studio37Logo';

// ... (keep the navigation array)

const Header = ({ setPage }) => {
    // ... (keep the existing component logic)

    return (
        <header className="bg-[#FFFDF6] sticky top-0 z-40 shadow-sm">
            <nav /* ... */ >
                {/* ... keep the logo and mobile menu button ... */}
                
                <div className="hidden lg:flex lg:gap-x-12">
                    {/* ... keep the navigation mapping ... */}
                </div>

                {/* --- THIS IS THE MODIFIED PART --- */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a 
                        href="http://tools.studio37.cc" // This is the link to your future app
                        target="_blank" // Opens in a new tab
                        rel="noopener noreferrer"
                        className="rounded-md bg-[#468289] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#36454F]"
                    >
                        Admin Login
                    </a>
                </div>
            </nav>
            {/* ... keep the mobile menu dialog ... */}
        </header>
    );
};

export default Header;