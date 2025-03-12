import React, { useState } from "react";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  index: number;
}

const NavLinks = [
  { title: "Home", href: "landingpage" },
  { title: "Mobile Top-up", href: "mobile-top-up" },
  { title: "International Reload", href: "international-top-up" },
  { title: "SIM Swap", href: "sim-swap" },
  { title: "Find Our Store", href: "find-our-store" },
];

const Navbar = ({ index }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignin = () => {
    router.push("/auth/signin");
  };

  return (
    <nav className="fixed top-0 w-full  bg-white border-b border-gray-100 z-50">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-[120px] lg:py-[23px] py-3 flex items-center shadow-md lg:shadow-none">
        {/* Mobile Menu Icon */}
        <div className="block lg:hidden">
          {isMenuOpen ? (
            <IoClose
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          ) : (
            <FaBars
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          )}
        </div>

        <div className="relative w-[120px] h-[38px] ml-2 lg:ml-0">
          <a href="/screens/landingpage">
            <Image
              src="/navlogo.svg"
              alt="Nav Logo"
              fill
              className="object-contain"
            />
          </a>
        </div>

        <div className="hidden md:flex items-center justify-end flex-1 gap-8">
          {/* Desktop Nav Links */}
          <div className="lg:flex hidden items-center gap-8 ">
            {NavLinks.map((link, idx) => (
              <Link
                key={link.title}
                href={link.href}
                className="relative group"
              >
                <span
                  className={`${
                    idx === index
                      ? "text-gray-900 text-base font-medium"
                      : "text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                  } font-inter`}
                >
                  {link.title}
                </span>
                {idx === index && (
                  <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary rounded-full" />
                )}
                {idx !== index && (
                  <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignin}
              className="px-[27px] py-[12px] rounded-lg border-2 border-primary text-primary hover:bg-gray-100 text-sm font-semibold font-inter"
            >
              Sign in
            </button>
            <button
              onClick={handleSignin}
              className="px-[27px] py-[12px] rounded-lg bg-primary hover:bg-primary/80 text-gray-900 text-sm font-semibold font-inter"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Mobile Sign up Button */}
        <div className="block md:hidden ml-auto">
          <button className="px-[27px] py-[12px] rounded-lg bg-primary text-gray-900 text-sm font-semibold font-inter">
            Sign up
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[64px] left-0 w-full bg-white border-t border-gray-100 lg:hidden">
            <div className="flex flex-col p-4">
              {NavLinks.map((link, idx) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`py-3 ${
                    idx === index
                      ? "text-gray-900 text-base font-medium"
                      : "text-gray-500 text-sm font-medium"
                  } font-inter`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
