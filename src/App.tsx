/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBreathing } from './components/HeroBreathing';
import { MiniGameSuite } from './components/MiniGameSuite';
import { SoundsSection } from './components/SoundsSection';
import { GroundingSection } from './components/GroundingSection';
import { MoodCheck } from './components/MoodCheck';
import { HelpingOthersSection } from './components/HelpingOthersSection';
import { Footer } from './components/Footer';
import { Sparkles, Palette } from 'lucide-react';

type PastelTheme = 'lavender' | 'mint' | 'sky';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('dechy');
  const [themeTint, setThemeTint] = useState<PastelTheme>('lavender');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Richer pastel pigmentation with noticeable soft tint
  const themeClasses = {
    lavender: 'from-[#E7DBF2] via-[#DFD1EE] to-[#D6E6DE]',
    mint: 'from-[#D2EADA] via-[#C5E4CE] to-[#DAE5F0]',
    sky: 'from-[#D0E5F7] via-[#C0DEF4] to-[#E0D7F0]',
  }[themeTint];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses} transition-colors duration-700 font-sans text-[#2D3748]`}>
      {/* Top Navbar */}
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />

      {/* Theme Accent Tint Switcher */}
      <div className="max-w-6xl mx-auto px-6 pt-4 flex justify-end">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-xs border border-[#D5C6E8] text-xs shadow-xs">
          <Palette className="w-3.5 h-3.5 text-[#5F457A]" />
          <span className="text-[#5B4873] font-medium hidden sm:inline">Pastelový odstín:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setThemeTint('lavender')}
              className={`w-4 h-4 rounded-full bg-[#DCCBEF] border transition-transform cursor-pointer ${
                themeTint === 'lavender' ? 'border-[#553874] scale-125' : 'border-[#BAA3D4]'
              }`}
              title="Levandulový soumrak"
            />
            <button
              onClick={() => setThemeTint('mint')}
              className={`w-4 h-4 rounded-full bg-[#BEDEC9] border transition-transform cursor-pointer ${
                themeTint === 'mint' ? 'border-[#2D5A40] scale-125' : 'border-[#98C7A8]'
              }`}
              title="Šalvějová louka"
            />
            <button
              onClick={() => setThemeTint('sky')}
              className={`w-4 h-4 rounded-full bg-[#BEDBF3] border transition-transform cursor-pointer ${
                themeTint === 'sky' ? 'border-[#265376] scale-125' : 'border-[#96BFE2]'
              }`}
              title="Chrpové nebe"
            />
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero & Breathing Pacer & Purring Sleeping Cat */}
        <HeroBreathing />

        {/* 2. Mood Check-in */}
        <MoodCheck onScrollTo={scrollToSection} />

        {/* 3. Relaxation Mini-Game Suite (Padající listí, Počítání leknínů, Bublinky, Zenové kameny) */}
        <MiniGameSuite />

        {/* 4. Grounding Techniques (Metoda IMPROVE, Deskriptivní mapování místnosti, 5-4-3-2-1) */}
        <GroundingSection />

        {/* 5. Calming Continuous Sounds Mixer (Déšť na parapetu, Moře, Krb, Vítr, Listí, Velrybí zpěv) */}
        <SoundsSection />

        {/* 6. Jak pomoci někomu, kdo má stres nebo panickou ataku */}
        <HelpingOthersSection onNavigate={scrollToSection} />

        {/* Cohesive Summary Banner */}
        <section className="py-14 bg-white/50 border-t border-[#DFD5EC]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/85 border border-[#DACCEE] shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-[#E8DFF5] flex items-center justify-center mx-auto mb-3 text-[#5A4375]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-medium text-[#2E2342] font-display mb-2">
                Tvůj klidný koutek je plně vybaven
              </h3>
              <p className="text-xs sm:text-sm text-[#616D7E] max-w-xl mx-auto leading-relaxed">
                Všechny tvé oblíbené zvuky (déšť, moře, krb, vánek, listí i předení kočičky Míci) hrají nepřetržitě.
                Uzemňující kotva, dechový kruh, metoda IMPROVE a relaxační minihry jsou připraveny k okamžitému zklidnění.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
