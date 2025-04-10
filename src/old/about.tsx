import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export const AboutUs: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative isolate bg-white px-6 py-12 sm:py-16 lg:px-8">
      {/* Background Shape with Blue Gradient */}
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-400 to-blue-600 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-blue-600">About Us</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          Who We Are &amp; Our Vision
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
        At PharmaCare, we simplify the process of finding medicines and managing prescriptions through modern technology and a user-friendly platform.
      </p>

      {/* Content Section */}
      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Who We Are */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ duration: 0.0 }}
          data-aos="fade-up"
          className="bg-white text-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-lg">
            We are a dedicated team of healthcare and technology professionals committed to making medicines accessible and affordable for everyone.
          </p>
        </motion.div>

        {/* Our Vision */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ duration: 0.0 }}
          data-aos="fade-up"
          className="bg-white text-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg">
            We envision a world where every individual has easy access to the right medicines, ensuring better health outcomes for all.
          </p>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ duration: 0.0 }}
          data-aos="fade-up"
          className="bg-white text-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl md:col-span-2"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="text-lg space-y-2">
            <li>✅ Easy-to-use platform for searching medicines.</li>
            <li>✅ Secure prescription uploads and real-time insurance info.</li>
            <li>✅ Seamless experience powered by modern technology.</li>
            <li>✅ Dedicated support for all your healthcare needs.</li>
          </ul>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mt-10 text-center"
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} PharmaCare. All rights reserved.
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-2"
        >
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            ⬅ Back to Home
          </Link>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default AboutUs;
