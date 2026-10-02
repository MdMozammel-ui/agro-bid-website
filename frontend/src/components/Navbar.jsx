import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-3xl">🌾</span>

          <div>
            <h1 className="text-2xl font-bold leading-none text-green-700">
              AgroBid
            </h1>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Smart Agricultural Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">

          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={navLinkClass}
          >
            Products
          </NavLink>

          <NavLink
            to="/auction"
            className={navLinkClass}
          >
            Auctions
          </NavLink>

          <NavLink
            to="/login"
            className={navLinkClass}
          >
            Login
          </NavLink>

          <Link
            to="/register"
            className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
          >
            Register
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t bg-white px-6 py-4 md:hidden">

          <div className="flex flex-col gap-4">

            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </NavLink>

            <NavLink
              to="/auction"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Auctions
            </NavLink>

            <NavLink
              to="/login"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-center font-semibold text-white hover:bg-green-700"
            >
              Register
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;