import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function ContactPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Have a project in mind? We'd love to hear from you.
            </p>
            <div className="mt-10">
              <a href="mailto:hello@studio37.cc" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Email Us
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}