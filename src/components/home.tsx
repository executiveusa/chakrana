import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import WellnessDashboard from "./dashboard/WellnessDashboard";

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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-green-50 flex flex-col">
      <Header
        userName={userName}
        userAvatar={userAvatar}
        onMenuToggle={handleMenuToggle}
      />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Chakrana
              </span>
            </div>

            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Chakrana Wellness. All rights
              reserved.
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-purple-600">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
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
    <a
      href={href}
      className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-100 hover:text-purple-600 ${active ? "bg-purple-100 text-purple-600" : "text-gray-700"}`}
    >
      {label}
    </a>
  );
};

export default Home;
