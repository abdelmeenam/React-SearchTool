import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen flex flex-col items-center justify-center text-white">
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold drop-shadow-lg">Welcome to PharmaCare</h1>
        <p className="mt-4 text-lg font-medium">Your trusted partner for finding medicines and insurance coverage.</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {[ 
          { to: '/services', title: 'Our Services', text: 'Explore the services we offer to make healthcare more accessible.', color: 'text-blue-600', bg: 'hover:bg-blue-100' },
          { to: '/about', title: 'About Us', text: 'Learn more about our mission and how we help patients every day.', color: 'text-blue-600', bg: 'hover:bg-green-100' },
          { to: '/contact', title: 'Contact Us', text: 'Get in touch with our team for support and inquiries.', color: 'text-teal-600', bg: 'hover:bg-teal-100' },
          { to: '/faq', title: 'FAQs', text: 'Find answers to the most frequently asked questions.', color: 'text-teal-600', bg: 'hover:bg-red-100' }
        ].map((item, index) => (
          <motion.div 
            key={item.to} 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <Link 
              to={item.to}
              data-aos="fade-up"
              className={`block bg-white ${item.color} rounded-lg shadow-lg p-6 ${item.bg} transition-transform transform hover:-translate-y-1`}
            >
              <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-700">{item.text}</p>
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
        <Link to="/home" className="text-blue-200 hover:underline">Back to Home</Link>
      </motion.footer>
    </div>
  );
};
