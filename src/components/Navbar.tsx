/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#EAE2F3]/90 backdrop-blur-md border-b border-[#D8C9EA]/80 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-2xl font-semibold tracking-tight text-[#43305D] hover:text-[#5B437D] transition-colors whitespace-nowrap shrink-0 cursor-pointer font-display"
        >
          Klídek
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5F6575]">
          <button
            onClick={() => onNavigate('dechy')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#43305D] ${
              activeSection === 'dechy' ? 'text-[#43305D] font-semibold' : ''
            }`}
          >
            Dýchání
          </button>
          <button
            onClick={() => onNavigate('minihra')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#43305D] ${
              activeSection === 'minihra' ? 'text-[#43305D] font-semibold' : ''
            }`}
          >
            Relaxační minihra
          </button>
          <button
            onClick={() => onNavigate('uzemneni')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#43305D] ${
              activeSection === 'uzemneni' ? 'text-[#43305D] font-semibold' : ''
            }`}
          >
            Techniky uzemnění
          </button>
          <button
            onClick={() => onNavigate('zvuky')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#43305D] ${
              activeSection === 'zvuky' ? 'text-[#43305D] font-semibold' : ''
            }`}
          >
            Uklidňující zvuky
          </button>
          <button
            onClick={() => onNavigate('pomoc-druhemu')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#43305D] ${
              activeSection === 'pomoc-druhemu' ? 'text-[#43305D] font-semibold' : ''
            }`}
          >
            Jak pomoci druhému
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('zvuky')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#493563] rounded-full hover:bg-[#3D2C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            Pustit zvuky
          </button>
        </div>
      </div>
    </header>
  );
};
