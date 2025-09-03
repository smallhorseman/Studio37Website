import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/packages', label: 'Packages' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-8">
        <Link to="/" className="text-xl font-serif font-bold tracking-tight text-soft-charcoal">
          Studio37
        </Link>
        <nav className="flex-1">
          <ul className="flex flex-wrap gap-6 text-sm font-medium">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `transition-colors ${
                      isActive ? 'text-faded-teal' : 'text-soft-charcoal hover:text-faded-teal'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs uppercase tracking-wide text-soft-charcoal hover:text-faded-teal"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}