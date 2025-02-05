import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is PharmaCare?",
    answer: "PharmaCare is a platform that helps users find medicines, compare prices, and check insurance coverage for medications."
  },
  {
    question: "How can I search for a medicine?",
    answer: "You can use the search bar on our homepage to enter the name of the medicine and view details including pricing and insurance compatibility."
  },
  {
    question: "Is my data safe on PharmaCare?",
    answer: "Yes, we use advanced security measures to ensure your personal and medical data is protected."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach out to our support team through the Contact Us page or email us at support@pharmacare.com."
  }
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg"
    >
      <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Frequently Asked Questions</h1>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-8">Find answers to the most common questions about PharmaCare.</p>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 text-left text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-lg font-semibold">{faq.question}</span>
              {openIndex === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {openIndex === index && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="p-5 text-gray-700 dark:text-gray-300 border-t dark:border-gray-700"
              >
                {faq.answer}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
