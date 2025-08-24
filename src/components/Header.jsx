// src/components/Header.jsx
import React, { useState, useEffect } from 'react'; // Import hooks
import { Link } from 'react-router-dom';

function Header() {
  const [logoUrl, setLogoUrl] = useState('https://placehold.co/200x80/000000/FFFFFF?text=...&font=oswald'); // Default logo

  useEffect(() => {
    // Fetch a random logo when the component loads
    fetch('/.netlify/functions/get-random-logo')
      .then(response => response.json())
      .then(data => {
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      })
      .catch(error => console.error('Error fetching random logo:', error));
  }, []); // The empty array ensures this runs only once

  return (
    <header className="bg-black shadow-md p-5 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <Link to="/">
          <img id="site-logo" src={logoUrl} alt="Studio 37 Logo" className="h-12 w-auto" />
        </Link>
{/* ... rest of your nav links */}
<div className="hidden md:flex space-x-8">
  <Link to="/services" className="text-gray-300 hover:text-white font-medium font-oswald">Services</Link>
  <Link to="/packages" className="text-gray-300 hover:text-white font-medium font-oswald">Packages</Link>
  <Link to="/portfolio" className="text-gray-300 hover:text-white font-medium font-oswald">Portfolio</Link>
  <Link to="/blog" className="text-gray-300 hover:text-white font-medium font-oswald">Blog</Link>
  <Link to="/about" className="text-gray-300 hover:text-white font-medium font-oswald">About Us</Link>
  <Link to="/contact" className="text-gray-300 hover:text-white font-medium font-oswald">Contact</Link>
  <Link to="/planner" className="text-gray-300 hover:text-white font-medium font-oswald">Planner</Link>
</div>
      </nav>
    </header>
  );
}

export default Header;