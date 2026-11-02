/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HeartHandshake,
  Hand,
  Eye,
  UserCheck,
  Compass,
  Volume2,
  Wind,
  AlertTriangle,
  Phone,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface HelpingOthersProps {
  onNavigate?: (sectionId: string) => void;
}

export const HelpingOthersSection: React.FC<HelpingOthersProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'phrases' | 'website-guide'>('principles');

  return (
    <section id="pomoc-druhemu" className="py-20 bg-[#F4EFF8] border-t border-[#E5DEEE]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8DFF5] border border-[#D5C4EC] text-[#553874] text-xs font-semibold uppercase tracking-wider mb-2 shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5 text-[#6B4694]" />
            <span>Průvodce pro oporu blízkého</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#2C1F3F] font-display mb-3 text-balance">
            Jak pomoci někomu při silném stresu či panické atace
          </h2>

          <p className="text-sm sm:text-base text-[#5E687A] leading-relaxed text-balance">
            Být nablízku člověku v panice může vyvolat bezradnost. Nemusíte však být terapeut –
            nejdůležitější je bezpečný prostor, klidná přítomnost a pochopení, že každé tělo potřebuje něco jiného.
          </p>
        </div>

        {/* 1. Golden Rule Banner: For everyone it is different */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FDF9F4] via-[#FCF4EE] to-[#FBF0F5] border border-[#EEDCC8] shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F6DFCA] flex items-center justify-center shrink-0 text-[#824E1F] mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#543015] font-display mb-1">
                Klíčové pravidlo: Pro každého je to úplně jiné
              </h3>
              <p className="text-xs sm:text-sm text-[#735338] leading-relaxed">
                Co u jednoho člověka přinese okamžitou úlevu (například pevné objetí), může u druhého vyvolat pocit dušení
                a ještě větší úzkost. <strong>Podporu nikdy nevnucujte.</strong> Respektujte hranice dotyčného a ptejte se
                jednoduchými, krátkými otázkami.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-white/70 border border-[#E2DBEC] rounded-2xl max-w-md mx-auto mb-10 shadow-xs text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('principles')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'principles'
                ? 'bg-[#E3D7F3] text-[#412763] shadow-xs font-semibold'
                : 'text-[#646E7E] hover:text-[#2D223F]'
            }`}
          >
            4 pilíře pomoci
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('website-guide')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'website-guide'
                ? 'bg-[#E3D7F3] text-[#412763] shadow-xs font-semibold'
                : 'text-[#646E7E] hover:text-[#2D223F]'
            }`}
          >
            Jak pomoct tímto webem
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phrases')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'phrases'
                ? 'bg-[#E3D7F3] text-[#412763] shadow-xs font-semibold'
                : 'text-[#646E7E] hover:text-[#2D223F]'
            }`}
          >
            Co říct / Co neříkat
          </button>
        </div>

        {/* TAB 1: 4 PRINCIPLES OF SUPPORT */}
        {activeTab === 'principles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* Pillar 1: Touch & Grounding */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#E2DAED] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#EFE7F8] text-[#5C3F7A] flex items-center justify-center mb-3.5">
                  <Hand className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-[#2E2042] font-display mb-2">
                  1. Uzemňující dotyk (pokud je vítán)
                </h3>
                <p className="text-xs sm:text-sm text-[#616D7E] leading-relaxed mb-3">
                  Tělesný dotyk může fungovat jako kotva do reality. Může pomoci chytit člověka za ruku, položit dlaň na rameno
                  nebo ho pevně, klidně obejmout.
                </p>
                <div className="p-3 rounded-2xl bg-[#FAF6FD] border border-[#EFE7F8] text-xs text-[#5E4C74] space-y-1">
                  <div className="font-semibold text-[#483360]">Vždy se nejprve jemně zeptejte:</div>
                  <p className="italic">„Můžu tě chytit za ruku?“ · „Chceš obejmout, nebo potřebuješ prostor?“</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDF7] text-[11px] text-[#8692A2]">
                Pokud dotyčný couvne nebo dotyk odmítne, respektujte to bez uražení.
              </div>
            </div>

            {/* Pillar 2: Let them cry & shake (observation) */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#E2DAED] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#EDF5FB] text-[#245277] flex items-center justify-center mb-3.5">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-[#2E2042] font-display mb-2">
                  2. Nechat prostor vyplakat se a třást se
                </h3>
                <p className="text-xs sm:text-sm text-[#616D7E] leading-relaxed mb-3">
                  Někdy je největší pomocí nechat dotyčného projít emocemi – dovolit mu se třást, plakat nebo zhluboka vzlykat.
                  Třes je přirozený neurobiologický způsob těla, jak odplavit masivní nával adrenalinu.
                </p>
                <div className="p-3 rounded-2xl bg-[#F0F6FA] border border-[#DEECF5] text-xs text-[#2A5372] space-y-1">
                  <div className="font-semibold text-[#1C4360]">Pozorujte bezpečí:</div>
                  <p>
                    Netlačte na něj, aby hned přestal. Jen klidně pozorujte, zda se stav nezhoršuje nebo netrvá nebezpečně dlouho.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDF7] text-[11px] text-[#8692A2]">
                Pokud by se objevil kolaps nebo ataka trvala bez úlevy déle než 30 minut, zvažte odbornou pomoc.
              </div>
            </div>

            {/* Pillar 3: Silent presence */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#E2DAED] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5EE] text-[#245E3E] flex items-center justify-center mb-3.5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-[#2E2042] font-display mb-2">
                  3. Tichá přítomnost – nemusíte nic „řešit“
                </h3>
                <p className="text-xs sm:text-sm text-[#616D7E] leading-relaxed mb-3">
                  Častou chybou je snaha člověka „opravit“ nebo zasypat logickými argumenty. Nemusíte vymýšlet žádná moudrá slova.
                  Největší úlevou bývá prosté vědomí: <em>„Nejsem v tom sám.“</em>
                </p>
                <div className="p-3 rounded-2xl bg-[#F2F9F5] border border-[#DFEFE6] text-xs text-[#2B5F40] space-y-1">
                  <div className="font-semibold text-[#1A4E2F]">Klidný postoj:</div>
                  <p>Sedněte si vedle něj na podlahu nebo pohovku. Dýchejte pomalu a tiše – váš klid se na něj přenese.</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDF7] text-[11px] text-[#8692A2]">
                Stačí věta: „Jsem tady. Nemusíš nic říkat ani dělat. Zůstanu s tebou.“
              </div>
            </div>

            {/* Pillar 4: Guided imagination & senses */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#E2DAED] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0E4] text-[#6E4924] flex items-center justify-center mb-3.5">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-[#2E2042] font-display mb-2">
                  4. Nahození uklidňující představy
                </h3>
                <p className="text-xs sm:text-sm text-[#616D7E] leading-relaxed mb-3">
                  Při panice je mozek zaplaven pocitem ohrožení. Pomozte mu přesměrovat myšlenky na bezpečné místo pomocí jemného
                  popisu a zapojení smyslů.
                </p>
                <div className="p-3 rounded-2xl bg-[#FAF5EE] border border-[#F0E5D4] text-xs text-[#6B4B27] space-y-1">
                  <div className="font-semibold text-[#543616]">Zkuste jemně navrhnout:</div>
                  <p className="italic">
                    „Představ si, že sedíme u teplých kamen, venku jemně prší a ty jsi v naprostém suchu a bezpečí...“
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDF7] text-[11px] text-[#8692A2]">
                Mluvte pomalým, tichým, hlubším hlasem bez naléhavosti.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USING THIS WEBSITE TO HELP SOMEONE */}
        {activeTab === 'website-guide' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#E2DAED] shadow-xs mb-10">
            <h3 className="text-xl font-medium text-[#2E2042] font-display mb-2">
              Jak provést blízkého tímto webem Klídek
            </h3>
            <p className="text-xs sm:text-sm text-[#616D7E] leading-relaxed mb-6">
              Člověk v silném stresu často nedokáže sám nic vybírat ani klikat. Můžete se stát jeho laskavým průvodcem:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Music & Ambient Sounds */}
              <div className="p-5 rounded-2xl bg-[#F7F2FA] border border-[#E8DCF3] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#E8D9F7] text-[#55337E] flex items-center justify-center mb-3">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#3C225D] mb-1">
                    1. Pustit relaxační zvuky
                  </h4>
                  <p className="text-xs text-[#645A76] leading-relaxed">
                    Pusťte z našeho přehrávače déšť na parapet, mořský příboj nebo praskání dřeva v krbu. Zvuková kulisa pomůže
                    přehlušit vnitřní chaos.
                  </p>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('zvuky')}
                    className="mt-4 py-2 px-3 rounded-xl bg-white border border-[#D8C7EB] text-xs font-semibold text-[#54337A] hover:bg-[#EFE8F7] transition-colors cursor-pointer text-center"
                  >
                    Přejít na zvuky →
                  </button>
                )}
              </div>

              {/* Step 2: Shared Breathing */}
              <div className="p-5 rounded-2xl bg-[#EEF7F2] border border-[#D2EADA] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFE0] text-[#1E5736] flex items-center justify-center mb-3">
                    <Wind className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1C4E31] mb-1">
                    2. Dýchat spolu s ním
                  </h4>
                  <p className="text-xs text-[#4F6859] leading-relaxed">
                    Otevřete náš dechový kruh. Místo příkazu „Dýchej!“ dýchejte nahlas a klidně vy sami: <em>„Dýchej se mnou... Nádech... a pomalý výdech...“</em>
                  </p>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('dechy')}
                    className="mt-4 py-2 px-3 rounded-xl bg-white border border-[#BFDFCB] text-xs font-semibold text-[#1E5736] hover:bg-[#E5F5EC] transition-colors cursor-pointer text-center"
                  >
                    Otevřít dechový kruh →
                  </button>
                )}
              </div>

              {/* Step 3: Pure Visual Observation */}
              <div className="p-5 rounded-2xl bg-[#EDF4FA] border border-[#CFE1F2] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#D5E6F6] text-[#204F78] flex items-center justify-center mb-3">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1C486E] mb-1">
                    3. Pozorovat kapky na okně
                  </h4>
                  <p className="text-xs text-[#526477] leading-relaxed">
                    Pusťte minihru „Kapky na okně“ nebo „Kruhy na vodě“. Člověk nemusí na nic klikat, stačí položit hlavu a dívat se, jak kapky pomalu stékají.
                  </p>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('minihra')}
                    className="mt-4 py-2 px-3 rounded-xl bg-white border border-[#BDD4EB] text-xs font-semibold text-[#204F78] hover:bg-[#E2EEF8] transition-colors cursor-pointer text-center"
                  >
                    Pustit klidné kapky →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WHAT TO SAY / WHAT NOT TO SAY */}
        {activeTab === 'phrases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* What to say */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#D5EBDD] shadow-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1E5E3A] mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#2B8654]" />
                <span>Co pomáhá slyšet (Laskavá podpora)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#465A4F]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2B8654] font-bold">✓</span>
                  <span><strong>„Jsem tady s tebou.“</strong> (Jednoduché ujištění o přítomnosti)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2B8654] font-bold">✓</span>
                  <span><strong>„Tohle je jen panika/stres, brzy to odezní.“</strong> (Připomenutí dočasnosti)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2B8654] font-bold">✓</span>
                  <span><strong>„Nemusíš se mnou mluvit, stačí jen být.“</strong> (Sejmutí tlaku z komunikace)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2B8654] font-bold">✓</span>
                  <span><strong>„Vnímáš zem pod nohama? Cítíš, jak se dotýkáme?“</strong> (Jemné somatické uzemnění)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2B8654] font-bold">✓</span>
                  <span><strong>„Máš tolik času, kolik potřebuješ. Nikam nespěcháme.“</strong></span>
                </li>
              </ul>
            </div>

            {/* What NOT to say */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#F2D7DE] shadow-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#822B45] mb-4">
                <XCircle className="w-4 h-4 text-[#B53F62]" />
                <span>Čemu se vyhnout (Zvyšuje napětí)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#6B4B55]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B53F62] font-bold">✕</span>
                  <span><strong>„Uklidni se!“</strong> (Tělo je zaplavené hormony, vědomě to v tu chvíli nelze vypnout)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B53F62] font-bold">✕</span>
                  <span><strong>„Vždyť o nic nejde / nic se neděje.“</strong> (Zlehčování jejich prožitku prohlubuje pocit osamění)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B53F62] font-bold">✕</span>
                  <span><strong>„To máš jenom v hlavě.“</strong> (Tělesné příznaky bušení srdce a dušení jsou reálné a děsivé)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B53F62] font-bold">✕</span>
                  <span><strong>„Proč to děláš? Co tě tak rozhodilo?“</strong> (Dotazování nutí zapojit vyčerpaný mozek)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B53F62] font-bold">✕</span>
                  <span><strong>Násilné tahání někam pryč</strong> (pokud sami nechtějí odejít do ticha)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Safety Note & Crisis Hotlines (When it lasts too long or becomes dangerous) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/70 border border-[#E2DCEB] text-xs text-[#636E80] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E4] text-[#865324] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#36274B] block text-sm font-medium">
                Kdy vyhledat odbornou pomoc?
              </strong>
              <span>
                Pokud panika trvá déle než 30 minut bez sebemenší úlevy, dotyčný omdlívá nebo pociťuje ostrou bolest na hrudi
                vystřelující do paže, volejte <strong>155</strong>. Pro psychickou podporu kdykoliv zdarma volejte Linku první psychické pomoci <strong>116 123</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
