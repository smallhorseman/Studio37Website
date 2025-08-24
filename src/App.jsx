import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all general components
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesHighlight from './components/ServicesHighlight';
import PackagesHighlight from './components/PackagesHighlight';
import PortfolioUnlock from './components/PortfolioUnlock';
import Footer from './components/Footer';
import FadeIn from './components/FadeIn'; // Import the animation component

// Import all page components
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PackagesPage from './pages/PackagesPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import PortfolioPage from './pages/PortfolioPage';

// The HomePage component now uses the FadeIn component for animations
function HomePage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto px-6">
        <FadeIn>
          <ServicesHighlight />
        </FadeIn>
        <FadeIn>
          <PackagesHighlight />
        </FadeIn>
        <FadeIn>
          <PortfolioUnlock />
        </FadeIn>
      </main>
    </>
  );
}

// The main App component that controls all the page routing
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
