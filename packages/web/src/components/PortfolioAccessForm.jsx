import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PortfolioAccessForm({ onClose }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Portfolio password and discount code
  const portfolioPassword = "studio37portfolio"; // Replace with your actual password
  const discountCode = "STUDIO37DISC10"; // Replace with your actual discount code

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store lead data in localStorage as a simple storage mechanism
      // In production, you would send this to your backend API
      const leads = JSON.parse(localStorage.getItem('portfolioLeads') || '[]');
      leads.push({ 
        email, 
        phone, 
        timestamp: new Date().toISOString() 
      });
      localStorage.setItem('portfolioLeads', JSON.stringify(leads));
      
      setSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your information. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      {!submitted ? (
        <>
          <h2 className="text-2xl font-serif font-bold mb-4 text-soft-charcoal">Exclusive Portfolio Access</h2>
          <p className="mb-6 text-gray-600">Enter your information to receive the password to our full portfolio and a special 10% discount on your first booking.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
              <input 
                id="phone"
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex items-center justify-between pt-2">
              {onClose && (
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="bg-faded-teal hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Get Access'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-serif font-bold mb-4 text-soft-charcoal">Thank You!</h2>
          <p className="mb-6 text-gray-600">Here's your exclusive access:</p>
          
          <div className="mb-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Portfolio Password</p>
              <p className="font-mono font-bold text-soft-charcoal text-lg">{portfolioPassword}</p>
              <a 
                href="https://mrcombest4701cff4.myportfolio.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-faded-teal hover:underline text-sm inline-block mt-2"
              >
                Visit Portfolio →
              </a>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Discount Code (10% off)</p>
              <p className="font-mono font-bold text-soft-charcoal text-lg">{discountCode}</p>
            </div>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="bg-faded-teal hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Close
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
