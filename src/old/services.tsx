import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUpload, FaUserCog } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt"; // Assuming Tilt is from this library

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
    <div className="relative isolate bg-white dark:bg-gray-900 px-6 py-12 sm:py-16 lg:px-8">
      {/* SVG Wave Separator */}
      {/* <div className="absolute inset-x-0 top-0 -z-10">
        <svg
          className="w-full h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#gradient)"
            d="M0,96L48,90.7C96,85,192,75,288,96C384,117,480,171,576,170.7C672,171,768,117,864,96C960,75,1056,85,1152,112C1248,139,1344,181,1392,202.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
      </div> */}

      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h2 className="mt-2 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-gray-900 dark:text-white">
          Enhance Your Healthcare Experience
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-gray-600 dark:text-gray-300">
          Explore our range of services designed to simplify your healthcare
          journey.
        </p>
      </div>

      {/* Services Cards */}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {services.map((service) => (
          <Link key={service.to} to={service.to}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.2}
              glareColor="#ffffff"
              glarePosition="all"
              scale={1.02}
              transitionSpeed={250}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              className="group"
            >
              <motion.div
                data-aos="fade-up"
                whileHover={{ scale: 1.03, rotate: 0.5 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-8 ring-1 ring-gray-900/10 shadow-xl hover:ring-blue-400 dark:hover:ring-blue-300 transition-all"
              >
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
                      <p className="mt-4 text-base text-gray-600">
                        {service.text}
                      </p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </Tilt>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
