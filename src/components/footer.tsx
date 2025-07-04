import React from 'react';
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaPinterestP,
} from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-[#003F73] text-white py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-sm space-y-4">
        {/* Social Icons */}
        <div className="flex space-x-6 text-lg">
          <a href="#" className="hover:text-yellow-400 transition">
            <FaPinterestP />
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            <FaFacebookF />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm">
          © AIShopmate 
        </div>

        {/* Links */}
        <div className="flex space-x-4 text-xs">
          <a href="#" className="hover:text-yellow-400 transition">Terms</a>
          <a href="#" className="hover:text-yellow-400 transition">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
