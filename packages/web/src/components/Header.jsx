import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-soft-charcoal">
              Studio37
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="ml-10 flex items-baseline space-x-4">
              {navItems.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'text-faded-teal bg-gray-100' : 'text-soft-charcoal hover:text-faded-teal hover:bg-gray-50'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:block">
            <Link
              to="/login"
              className="text-sm font-medium text-soft-charcoal hover:text-faded-teal"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}