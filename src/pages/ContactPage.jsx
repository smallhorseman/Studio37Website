import React, { useState } from 'react';
import { FadeIn } from '../App'; // Assuming FadeIn is exported from App.jsx

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setStatus('Sending...');

    try {
      // This uses Netlify's built-in form handling if you name your form in netlify.toml
      // Or you can point this to a Netlify function.
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });

      if (response.ok) {
        setStatus('Thank you! Your message has been sent.');
        form.reset();
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      setStatus('Sorry, there was an error sending your message. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#D2B48C] tracking-widest">GET IN TOUCH</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">
              Let's Create Something Beautiful
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Have a project in mind or just want to say hello? Fill out the form below, and we'll get back to you as soon as possible.
            </p>
          </div>
        </FadeIn>
        <div className="mx-auto mt-16 max-w-xl sm:mt-20">
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value="contact" />
            <div>
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-[#36454F]">
                Full Name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#468289] sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-[#36454F]">
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#468289] sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-[#36454F]">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#468289] sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="block w-full rounded-md bg-[#468289] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#36454F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#36454F]"
              >
                Send Message
              </button>
            </div>
            {status && <p className="text-center mt-4 text-sm text-gray-600">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
