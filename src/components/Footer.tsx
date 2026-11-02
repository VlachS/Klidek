/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-12 bg-white/45 border-t border-black/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8799]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#43305D] text-sm font-display">Klídek</span>
          <span>·</span>
          <span>Prostor pro tvůj dech, uzemnění a vnitřní klid</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('pomoc-druhemu')}
              className="flex items-center gap-1.5 text-[#5A3F74] hover:text-[#3B2550] transition-colors cursor-pointer font-medium"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Jak pomoci někomu při panice</span>
            </button>
          )}
          <span>·</span>
          <span>Dopřej si tolik času, kolik potřebuješ</span>
        </div>
      </div>
    </footer>
  );
};
