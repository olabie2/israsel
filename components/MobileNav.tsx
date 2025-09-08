"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

// Define the props we expect from the server component
type Props = {
  homeText: string;
  donateText: string;
  contactText: string;
};

export default function MobileNav({ homeText, donateText,contactText }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the menu, useful for when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* HAMBURGER/CLOSE ICON - This button is only visible on mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MOBILE MENU - This menu slides in or appears when isOpen is true */}
      <div
        className={`absolute top-full left-0 w-full bg-black shadow-md md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-6 space-y-4">
          <Link href="/" className="hover:text-blue-600" onClick={closeMenu}>
            {homeText}
          </Link>
          <Link
            href="https://buymeacoffee.com/olabie"
            className="hover:text-blue-600"
            onClick={closeMenu}
          >
            {donateText}
          </Link>
          <Link href="/contact" className="hover:text-blue-600" onClick={closeMenu}>
            {contactText}
          </Link>
        </nav>
      </div>
    </>
  );
}