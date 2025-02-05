import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg"
    >
      <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Contact Us</h1>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-8">We'd love to hear from you. Fill out the form below and we'll get back to you soon.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <Mail className="h-6 w-6 text-blue-500" />
            <span>support@pharmacare.com</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <Phone className="h-6 w-6 text-blue-500" />
            <span>+1 234 567 890</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <MapPin className="h-6 w-6 text-blue-500" />
            <span>123 Pharma St, Health City, USA</span>
          </div>
        </div>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            ></textarea>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" /> Send Message
            </motion.button>
          </form>
        ) : (
          <div className="text-center text-green-600 dark:text-green-400 font-semibold text-lg">
            Thank you for reaching out! We will get back to you soon.
          </div>
        )}
      </div>
    </motion.div>
  );
};
