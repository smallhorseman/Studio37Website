import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Studio37Logo from './components/Studio37Logo';
import Header from './components/Header';
import Footer from './components/Footer';

// Tool Pages
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import ProjectsPage from './pages/ProjectsPage';
import ContentManagerPage from './pages/ContentManagerPage';
import AdminUpdatePage from './pages/AdminUpdatePage';
import TodoPage from './pages/TodoPage';
import LoginPage from './pages/LoginPage';

// Public Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import ToolsPage from './pages/ToolsPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const ToolsLayout = () => (
    <div className="min-h-screen bg-gray-50">
        <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/internal-dashboard"><Studio37Logo className="h-10 w-auto" color="white" /></Link>
                <div className="space-x-4">
                    <Link to="/internal-dashboard" className="px-2 py-1 rounded hover:bg-gray-700">Dashboard</Link>
                    <Link to="/crm" className="px-2 py-1 rounded hover:bg-gray-700">CRM</Link>
                    <Link to="/projects" className="px-2 py-1 rounded hover:bg-gray-700">Projects</Link>
                    <Link to="/cms" className="px-2 py-1 rounded hover:bg-gray-700">CMS</Link>
                    <Link to="/todos" className="font-bold text-yellow-400 px-2 py-1 rounded hover:bg-gray-700">To-Do</Link>
                    <Link to="/admin" className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500">Admin</Link>
                </div>
            </div>
        </nav>
        <main><Outlet /></main>
    </div>
);

const PublicSiteLayout = () => (
    <div className="font-sans bg-vintage-cream text-soft-charcoal min-h-screen">
        <Header />
        <main><Outlet /></main>
        <Footer />
    </div>
);

export default function App() {
    const hostname = window.location.hostname;
    const isToolsSite = hostname.includes('tools.');

    return (
        <Router>
            {isToolsSite ? (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ToolsLayout />}>
                        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/internal-dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminUpdatePage /></ProtectedRoute>} />
                        <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
                        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
                        <Route path="/cms" element={<ProtectedRoute><ContentManagerPage /></ProtectedRoute>} />
                        <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
                    </Route>
                </Routes>
            ) : (
                <PublicSiteLayout>
                    <Routes>
                        {/* Public pages */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/packages" element={<PackagesPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogPostPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        {/* Admin/tools pages */}
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/tools" element={<ToolsPage />} />
                        {/* Add more admin/tools routes as needed */}
                        <Route path="*" element={<div className="p-8">404 Not Found</div>} />
                    </Routes>
                </PublicSiteLayout>
            )}
        </Router>
    );
}