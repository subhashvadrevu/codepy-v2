import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeIndianRupee, Menu, MoonStarIcon, Sun, X } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Separator } from "./ui/separator.jsx";
import { useThemeStore } from "@/store/useThemeStore.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { name: "Problems", href: "/problems" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { authenticatedUser, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="dark:bg-[#18181b] sticky top-0 z-50 w-full bg-background border-b-2 border-border px-4 sm:px-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 h-16 w-full max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="max-h-10 max-w-10" />
          <div className="text-lg font-normal dark:text-white">CodePy</div>
        </Link>

        <nav className="hidden md:flex items-center gap-3 flex-grow justify-center">
          {navItems.map(({ name, href }) => (
            <Link
              key={name}
              to={href}
              className={cn(
                "px-3 py-2 rounded-md text-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                location.pathname === href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/80"
              )}
            >
              {name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center justify-end gap-3 flex-shrink-0">
          {theme === "light" ? (
            <MoonStarIcon
              className="h-5 w-5 cursor-pointer"
              onClick={toggleTheme}
            />
          ) : (
            <Sun
              className="h-5 w-5 cursor-pointer"
              onClick={toggleTheme}
            />
          )}

          {authenticatedUser ? (
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <BadgeIndianRupee className="fill-yellow-500 stroke-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Earn Pycoins to unlock editorials</p>
                </TooltipContent>
              </Tooltip>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="focus:outline-none"
                >
                  <img
                    src={authenticatedUser.avatar || "https://avatar.iran.liara.run/public/boy"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-border object-cover"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 border border-border rounded-md shadow-lg z-50 p-2 space-y-1">
                    <Link
                      to={`/user/${authenticatedUser.username}`}
                      className="block p-2 text-sm text-center hover:bg-accent hover:text-accent-foreground rounded"
                    >
                      {authenticatedUser.name || "Profile"}
                    </Link>
                    <Separator />
                    {authenticatedUser.role === "ADMIN" && (
                      <>
                        <Link
                          to="/admin"
                          className="block p-2 text-sm text-center hover:bg-accent hover:text-accent-foreground rounded"
                        >
                          Admin Access
                        </Link>
                        <Separator />
                      </>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full text-sm"
                    >
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 animate-in fade-in slide-in-from-top bg-background border-t border-border px-4 py-3">
          {navItems.map(({ name, href }) => (
            <Link
              key={name}
              to={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-md text-sm text-center font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                location.pathname === href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/80"
              )}
            >
              {name}
            </Link>
          ))}

          <div className="mt-4 border-t border-border pt-3 space-y-2">
            {authenticatedUser ? (
              <>
                <Link to={`/user/${authenticatedUser.username}`} onClick={() => setMobileOpen(false)}>
                  <div className="block px-4 py-2 rounded-md text-sm text-center font-medium hover:bg-accent hover:text-accent-foreground">
                    {authenticatedUser.name || "Profile"}
                  </div>
                </Link>
                {authenticatedUser.role === "ADMIN" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <div className="block px-4 py-2 rounded-md text-sm text-center font-medium hover:bg-accent hover:text-accent-foreground">
                      Admin Access
                    </div>
                  </Link>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" className="w-full" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/signup">Sign up</Link>
                </Button>
                <Button variant="secondary" size="sm" className="w-full" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
