import React, { useState } from 'react';

// Import newly created components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

// Import all other page components
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPost1 from './pages/BlogPost1';
import ContactPage from './pages/ContactPage';

// We'll create this placeholder page for routes under construction
const PlaceholderPage = ({ title }) => (
    <div className="bg-[#FFFDF6] px-6 py-24 sm:py-32 lg:px-8 min-h-screen">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">{title}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
                This page is currently under construction. Please check back soon for updates!
            </p>
        </div>
    </div>
);


function App() {
    const [page, setPage] = useState('home');

    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage setPage={setPage} />;
            case 'services': return <ServicesPage setPage={setPage} />;
            case 'packages': return <PackagesPage setPage={setPage} />;
            case 'portfolio': return <PortfolioPage />;
            case 'about': return <AboutPage />;
            case 'blog': return <BlogPage setPage={setPage} />;
            case 'contact': return <ContactPage />;
            case 'portrait-photography-houston-parks': return <BlogPost1 setPage={setPage} />;
            
            // Placeholders for service-specific pages
            case 'portraits': return <PlaceholderPage title="Portrait Photography" />;
            case 'events': return <PlaceholderPage title="Event Photography" />;
            case 'products': return <PlaceholderPage title="Art & Product Photography" />;
            
            default: return <HomePage setPage={setPage} />;
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; background-color: #FFFDF6; }
                .font-serif { font-family: 'DM Serif Display', serif; }
            `}</style>
            <Header setPage={setPage} />
            <main>{renderPage()}</main>
            <Footer setPage={setPage} />
        </>
    );
}

export default App;