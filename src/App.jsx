// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import PackagesPage from './pages/PackagesPage';
import PlannerPage from './pages/PlannerPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
