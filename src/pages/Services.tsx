import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Services: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const services = [
    {
      to: '/search',
      title: 'Search for Medicines',
      text: 'Find the medicine you need, compare prices, and check insurance compatibility.',
      color: 'text-blue-600',
      bg: 'hover:bg-blue-100',
    },
    {
      to: '/upload',
      title: 'Upload Prescriptions',
      text: 'Securely upload your prescription to find compatible drugs and services.',
      color: 'text-green-600',
      bg: 'hover:bg-green-100',
    },
    {
      to: '/dashboard',
      title: 'Dashboard',
      text: 'Manage your profile, view saved searches, and access your history.',
      color: 'text-purple-600',
      bg: 'hover:bg-purple-100',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 min-h-screen flex flex-col items-center justify-center text-white">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold drop-shadow-lg">Our Services</h1>
        <p className="mt-4 text-lg font-medium">Explore the services we offer to improve your healthcare experience.</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        {services.map((service, index) => (
          <motion.div
            key={service.to}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <Link
              to={service.to}
              data-aos="fade-up"
              className={`block bg-white ${service.color} rounded-lg shadow-lg p-6 ${service.bg} transition-transform transform hover:-translate-y-1`}
            >
              <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
              <p className="text-gray-700">{service.text}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-sm">&copy; {new Date().getFullYear()} PharmaCare. All rights reserved.</p>
        <Link to="/home" className="text-white hover:underline">Back to Home</Link>
      </motion.footer>
    </div>
  );
};
