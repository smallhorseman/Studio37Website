// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header';
import Hero from './components/Hero';
import ServicesHighlight from './components/ServicesHighlight';
import PackagesHighlight from './components/PackagesHighlight';
import PortfolioUnlock from './components/PortfolioUnlock';
import Footer from './components/Footer';

// Pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PackagesPage from './pages/PackagesPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import PortfolioPage from './pages/PortfolioPage'; // <-- Import

function HomePage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto px-6">
        <ServicesHighlight />
        <PackagesHighlight />
        <PortfolioUnlock />
      </main>
    </>
  );
}

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
        <Route path="/portfolio" element={<PortfolioPage />} /> {/* <-- ADD THIS ROUTE */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;