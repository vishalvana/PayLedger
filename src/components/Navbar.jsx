import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase/client";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const links = [
    { path: "/", label: "Drivers" },
    { path: "/routes", label: "Routes" },
    { path: "/trips", label: "Trips" },
    { path: "/weekly-settlement", label: "Weekly" },
    { path: "/monthly-settlement", label: "Monthly" },
    { path: "/settlements", label: "History" },
  ];

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo + Icon */}
          <div className="flex items-center space-x-3">
            <svg
              className="h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
              />
            </svg>
            <h2 className="text-2xl font-bold">PayLedger</h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition hover:text-gray-400 ${
                  location.pathname === link.path
                    ? "underline font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-2 py-1 rounded hover:bg-gray-800 ${
                  location.pathname === link.path
                    ? "bg-gray-800 font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
