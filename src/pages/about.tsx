import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-400 to-purple-500 min-h-screen flex flex-col items-center justify-center text-white">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold drop-shadow-lg">About Us</h1>
        <p className="mt-4 text-lg font-medium max-w-2xl">
          At PharmaCare, our mission is to make healthcare accessible by helping you find the right medicines at the best prices with insurance compatibility.
        </p>
      </motion.header>

      <div className="max-w-4xl text-center p-6 bg-white text-gray-800 rounded-lg shadow-lg" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
        <p className="text-lg mb-4">
          We are a dedicated team of healthcare and technology professionals committed to simplifying the process of searching for medicines and managing prescriptions.
        </p>
        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
        <p className="text-lg mb-4">
          We envision a world where everyone has easy access to the medications they need, without unnecessary complexity or delays.
        </p>
        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-lg">
          - Easy-to-use platform for searching medicines.
          <br />- Secure prescription uploads for better assistance.
          <br />- Real-time insurance coverage information.
          <br />- A seamless experience with modern technology.
        </p>
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
