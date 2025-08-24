// src/pages/ContactPage.jsx
import React from 'react';

function ContactPage() {
  return (
    <main className="py-20 md:py-24">
      <section id="contact" className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-10 text-center">Contact Us</h1>
        <p className="text-xl text-gray-700 mb-10">
          Ready to create your cinematic memories? Reach out to us today!
        </p>

        <form id="contact-form" className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 mb-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-base font-medium mb-3">Your Name</label>
              <input type="text" id="name" name="name" placeholder="John Doe" required className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-base font-medium mb-3">Your Email</label>
              <input type="email" id="email" name="email" placeholder="john.doe@example.com" required className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="service" className="block text-gray-700 text-base font-medium mb-3">Service of Interest</label>
            <select id="service" name="service" className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
              <option value="">Select a service</option>
              <option value="portrait">Portrait Photography</option>
              <option value="event">Event Photography</option>
              <option value="art">Art Photography</option>
              <option value="professional">Professional Services</option>
            </select>
          </div>
          <div className="mb-10">
            <label htmlFor="message" className="block text-gray-700 text-base font-medium mb-3">Your Message</label>
            <textarea id="message" name="message" rows="6" placeholder="Tell us about your photography needs..." required className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50"></textarea>
          </div>
          <div className="text-center">
            <button type="submit" className="btn-polaroid">Send Message</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ContactPage;