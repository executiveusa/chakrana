import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import WellnessDashboard from "./dashboard/WellnessDashboard";
import { motion } from "framer-motion";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
}

const Home: React.FC<HomeProps> = ({
  userName = "Sarah Johnson",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=chakrana",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-purple-50 to-green-50 flex flex-col"
    >
      <Header
        userName={userName}
        userAvatar={userAvatar}
        onMenuToggle={handleMenuToggle}
      />

      <motion.main
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl"
      >
        <motion.div
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Mobile menu drawer - only visible on mobile */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleMenuToggle}
            >
              <div
                className="bg-white w-64 h-full p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItem href="/dashboard" label="Dashboard" />
                  <NavItem href="/meditations" label="Meditations" />
                  <NavItem href="/chakras" label="Chakras" />
                  <NavItem href="/progress" label="Progress" />
                  <NavItem href="/community" label="Community" />
                </div>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div className="p-1">
            <WellnessDashboard
              userName={userName}
              userAvatar={userAvatar}
              streakDays={7}
              totalMinutes={320}
              completedSessions={24}
            />
          </div>
        </motion.div>
      </motion.main>

      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-white border-t border-gray-200 py-6 shadow-md"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4 md:mb-0"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Chakrana
              </span>
            </motion.div>

            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Chakrana Wellness. All rights
              reserved.
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="/privacy"
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                Privacy
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="/terms"
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                Terms
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="/contact"
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                Contact
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href = "/",
  label = "Link",
  active = false,
}) => {
  return (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      href={href}
      className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-100 hover:text-purple-600 shadow-sm hover:shadow-md ${active ? "bg-purple-100 text-purple-600" : "text-gray-700"}`}
    >
      {label}
    </motion.a>
  );
};

export default Home;
