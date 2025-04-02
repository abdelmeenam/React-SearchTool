import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUpload, FaUserCog } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { HelpCircle } from "lucide-react";

export const Services: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const services = [
    {
      to: "/search/1",
      title: "Search for Medicines",
      text: "Find the medicine you need, compare prices, and check insurance compatibility.",
      icon: <FaSearch className="w-12 h-12" />,
    },

    {
      to: "/dashboard/1",
      title: "Dashboard",
      text: "Manage your profile, view saved searches, and access your history.",
      icon: <FaUserCog className="w-12 h-12" />,
    },
    {
      to: "/help",
      title: "Help & Support",
      text: "Get assistance with your queries and learn how to use our platform effectively.",
      icon: <HelpCircle className="w-12 h-12" />,
    },
  ];

  return (
    <div className="relative isolate bg-white px-6 py-12 sm:py-16 lg:px-8">
      {/* Lighter Background Shape */}
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem]
                     bg-gradient-to-tr from-blue-300 to-blue-400
                     opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          Enhance Your Healthcare Experience
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
        Explore our range of services designed to simplify your healthcare journey.
      </p>

      {/* Services Cards */}
      <div className="mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {services.map((service) => (
          <div
            key={service.to}
            className="rounded-3xl bg-white p-8 ring-1 shadow-xl ring-gray-900/10 sm:p-10"
            data-aos="fade-up"
          >
            <Link to={service.to} className="block">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-blue-500">{service.icon}</div>
                <h3 className="text-base font-semibold text-blue-600">
                  {service.title}
                </h3>
                <p className="mt-4 text-base text-gray-600">{service.text}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
