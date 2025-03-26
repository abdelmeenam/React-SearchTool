import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-[80vh]">
      {/* Container with default padding */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Hero content */}
        <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
              Simplify Your Medicine Search
            </h1>
            <p className="mt-4 text-base text-gray-500 sm:mt-6 sm:text-lg">
              Find detailed information, compare prices, and explore insurance coverage
              for your prescriptions—all in one place.
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-6">
            <a
  href="services"
  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs transform transition-all duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
>
  Get Started
</a>

              
              <a href="about" className="text-sm/6 font-semibold text-gray-900">
                Learn More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
