// packages/web/src/App.jsx

import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Blog from './pages/Blog'
import Studio from './pages/Studio'
import Services from './pages/Services'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import Login from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Analytics from './pages/Analytics'
import { AuthProvider } from './AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/account" element={<Account />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App