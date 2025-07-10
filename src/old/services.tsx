import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaUserCog } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Alert from "./Alert"; // Adjust path if different
export const Services: React.FC = () => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");

  const location = useLocation();
  const handleServiceClick = (serviceTitle: string) => {
    setAlertMessage(`${serviceTitle} selected successfully!`);
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 4000); // Clear after 4 seconds
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      AOS.init({ disable: true });
    } else {
      AOS.init({ duration: 1000 });
    }
  }, []);

  const services = [
    {
      to: "/search/1",
      title: "Search for Medicines",
      text: "Find the medicine you need, compare prices, and check insurance compatibility.",
      icon: (
        <FaSearch aria-hidden="true" focusable="false" className="w-12 h-12" />
      ),
    },
    {
      to: "/dashboard/1",
      title: "Dashboard",
      text: "Manage your profile, view saved searches, and access your history.",
      icon: (
        <FaUserCog aria-hidden="true" focusable="false" className="w-12 h-12" />
      ),
    },
    {
      to: "/help",
      title: "Help & Support",
      text: "Get assistance with your queries and learn how to use our platform effectively.",
      icon: (
        <HelpCircle
          aria-hidden="true"
          focusable="false"
          className="w-12 h-12"
        />
      ),
    },
  ];

  return (
    <>


      <main
        id="main-content"
        tabIndex={-1}
        role="main"
        className="relative isolate bg-white dark:bg-gray-900 px-6 py-12 sm:py-16 lg:px-8"
      >
        {/* Page Header */}
        <header className="mx-auto max-w-4xl text-center mb-12">
          <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-gray-900 dark:text-white">
            Enhance Your Healthcare Experience
          </h1>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Explore our range of services designed to simplify your healthcare
            journey.
          </p>
        </header>
        {/* {alertMessage && alertType && (
          <Alert
            message={alertMessage}
            type={alertType as "success" | "error"}
          />
        )} */}

        {/* Services List */}
        <ul
          aria-label="Main menu"
          role="list"
          className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl"
        >
          {services.map((service, idx) => {
            const isActive = location.pathname === service.to;

            return (
              <li key={service.to} role="listitem" className="group">
                <Link
                  to={service.to}
                  aria-label={service.title}
                  aria-labelledby={`service-title-${idx} service-desc-${idx}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`block focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-3xl ${
                    isActive ? "ring-4 ring-blue-500" : ""
                  }`}
                  onClick={() => handleServiceClick(service.title)}
                >
                  <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    glareColor="#ffffff"
                    glarePosition="all"
                    scale={1.02}
                    transitionSpeed={250}
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    className="block"
                  >
                    <motion.article
                      data-aos="fade-up"
                      whileHover={{ scale: 1.03, rotate: 0.5 }}
                      whileFocus={{ scale: 1.03, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-8 ring-1 ring-gray-900/10 shadow-xl hover:ring-blue-400 dark:hover:ring-blue-300 transition-all focus-visible:ring-4 focus-visible:ring-blue-400 ${
                        isActive ? "ring-4 ring-blue-500" : ""
                      }`}
                      aria-labelledby={`service-title-${idx} service-desc-${idx}`}
                      tabIndex={0}
                    >
                      <div className="flex flex-col items-center text-center dark:text-white">
                        <div className="mb-4 text-blue-500" aria-hidden="true">
                          {service.icon}
                        </div>
                        <h2
                          id={`service-title-${idx}`}
                          className="text-base font-semibold text-blue-600"
                        >
                          {service.title}
                        </h2>
                        <p
                          className="mt-4 text-base text-gray-600 dark:text-white"
                          id={`service-desc-${idx}`}
                        >
                          {service.text}
                        </p>
                      </div>
                    </motion.article>
                  </Tilt>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default Services;
