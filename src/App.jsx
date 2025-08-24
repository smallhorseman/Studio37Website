// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all general components using the '@' alias
import Header from '@/components/Header.jsx';
import Hero from '@/components/Hero.jsx';
import ServicesHighlight from '@/components/ServicesHighlight.jsx';
import PackagesHighlight from '@/components/PackagesHighlight.jsx';
import PortfolioUnlock from '@/components/PortfolioUnlock.jsx';
import Footer from '@/components/Footer.jsx';
import FadeIn from '@/components/FadeIn.jsx';

// Import all page components using the '@' alias
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import PackagesPage from '@/pages/PackagesPage.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import BlogPage from '@/pages/BlogPage.jsx';
import PortfolioPage from '@/pages/PortfolioPage.jsx';
import PlannerPage from '@/pages/PlannerPage.jsx';

// The HomePage component
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
        <Route path="/planner" element={<PlannerPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
