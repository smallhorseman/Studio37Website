import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Studio37Logo from './Studio37Logo';

// Simple navigation links
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/services', label: 'Services' },
  { path: '/packages', label: 'Packages' },
  { path: '/contact', label: 'Contact' }
];

export default function Layout({ children }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-vintage-cream">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Studio37Logo className="h-10 w-auto" />
              <span className="font-handwriting text-2xl">Studio 37</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'text-faded-teal border-b-2 border-faded-teal' 
                      : 'text-gray-600 hover:text-faded-teal'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile menu button - add functionality as needed */}
            <button className="md:hidden p-2">
              <span className="sr-only">Open menu</span>
              ☰
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-soft-charcoal text-white py-8">
        <div className="container">
          <div className="text-center">
            <p className="font-handwriting text-2xl mb-2">Studio 37</p>
            <p className="text-sm">© {new Date().getFullYear()} Studio 37. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
