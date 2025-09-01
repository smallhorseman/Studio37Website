import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function AboutPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Mission</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About Studio 37
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are a collective of designers, developers, and strategists who believe in the power of a strong digital presence. Our goal is to build beautiful, functional, and high-performing websites that help our clients succeed.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}