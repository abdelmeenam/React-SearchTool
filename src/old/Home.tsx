import React from "react";

const LandingPage: React.FC = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-white min-h-[80vh] flex items-center"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:py-24 text-center">
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Simplify Your Medicine Search
          </h1>
          <p className="mt-4 text-base text-gray-500 sm:mt-6 sm:text-lg">
            Find detailed information, compare prices, and explore insurance
            coverage for your prescriptions—all in one place.
          </p>
  
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="services"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label="Get started with our medicine search service"
            >
              Get Started
            </a>
            <a
              href="about"
              aria-label="Learn more about our services"
              className="text-sm font-semibold text-gray-900 hover:underline hover:text-blue-600"
            >
              Learn More <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
  
};

export default LandingPage;
