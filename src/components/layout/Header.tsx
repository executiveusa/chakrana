import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onMenuToggle?: () => void;
}

const Header = ({
  userName = "Sarah Johnson",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=chakrana",
  onMenuToggle = () => {},
}: HeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-gray-200 w-full h-20 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-md"
    >
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent hidden md:block">
              Chakrana
            </span>
          </Link>
        </motion.div>
      </div>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="hidden md:flex items-center space-x-6"
      >
        <NavLink href="/dashboard" label="Dashboard" />
        <NavLink href="/meditations" label="Meditations" />
        <NavLink href="/chakras" label="Chakras" />
        <NavLink href="/progress" label="Progress" />
        <NavLink href="/community" label="Community" />
      </motion.nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>
          </Button>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="border-2 border-purple-200 shadow-md">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = "/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (window.location.href = "/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = "/logout")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.header>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

const NavLink = ({
  href = "/",
  label = "Link",
  active = false,
}: NavLinkProps) => {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
      <Link
        to={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-purple-600 px-3 py-2 rounded-md",
          active ? "text-purple-600 bg-purple-50" : "text-gray-700",
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
};

export default Header;
