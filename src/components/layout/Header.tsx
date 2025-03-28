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
    <header className="bg-white border-b border-gray-200 w-full h-20 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </Button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-semibold text-gray-800 hidden md:block">
            Chakrana
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-6">
        <NavLink href="/dashboard" label="Dashboard" />
        <NavLink href="/meditations" label="Meditations" />
        <NavLink href="/chakras" label="Chakras" />
        <NavLink href="/progress" label="Progress" />
        <NavLink href="/community" label="Community" />
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
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
    <Link
      to={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-purple-600",
        active ? "text-purple-600" : "text-gray-700",
      )}
    >
      {label}
    </Link>
  );
};

export default Header;
