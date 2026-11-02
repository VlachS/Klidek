/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, HeartHandshake, AlertCircle, Phone, X, Heart, Shield, Clock } from 'lucide-react';
import { playChime } from '../utils/soundEffects';

interface MoodStep {
  title: string;
  desc: string;
}

interface MoodOption {
  id: string;
  label: string;
  tone: string;
  response: string;
  suggestionAction: string;
  targetId: string;
  steps?: MoodStep[];
}

const MOODS: MoodOption[] = [
  {
    id: 'calm',
    label: 'Klidně a v míru',
    tone: 'bg-[#D3EBE0] text-[#24543C] border-[#B7DCC8]',
    response: 'To je nádherné. Zůstaň v tomto pocitu co nejdéle a vychutnej si svou vnitřní stabilitu a rovnováhu.',
    suggestionAction: 'Vyzkoušet lekníny na hladině',
    targetId: 'minihra',
  },
  {
    id: 'stressed',
    label: 'Ve stresu a úzkosti',
    tone: 'bg-[#FBE4E8] text-[#862D48] border-[#F2BDCA]',
    response: 'Tvůj nervový systém právě bije na poplach. Nemusíš s tím pocitem bojovat ani ho hned přeprat – tělo jen potřebuje signál bezpečí.',
    suggestionAction: 'Spustit dechové cvičení proti stresu',
    targetId: 'dechy',
    steps: [
      {
        title: '1. Fyziologický dvojitý nádech (Physiological Sigh)',
        desc: 'Udělej 2 rychlé nádechy nosem za sebou (hluboký + ještě malý donádech) a pak jeden dlouhý, pomalý výdech ústy jako úleva. Opakuj 3×. Okamžitě to snižuje tepovou frekvenci.',
      },
      {
        title: '2. Uvolnění somatického stažení',
        desc: 'Odsuň jazyk od horního patra, povol zaťatou čelist, spusť ramena dolů od uší a rozevři prsty na rukou.',
      },
      {
        title: '3. Zúžení na tento jediný okamžik',
        desc: 'V tuto minutu ti nehrozí žádné akutní fyzické nebezpečí. Polož ruku na hrudník a vnímej její teplo.',
      },
    ],
  },
  {
    id: 'pressure',
    label: 'Pod velkým tlakem & přetížení',
    tone: 'bg-[#F5E6DC] text-[#784428] border-[#E8C2AC]',
    response: 'Cítíš, že je toho příliš mnoho a všechno hoří. Nemusíš nést váhu celého světa v této jediné vteřině.',
    suggestionAction: 'Zapnout šumící potůček a déšť',
    targetId: 'zvuky',
    steps: [
      {
        title: '1. Pravidlo jedné jediné věci',
        desc: 'Zastav multitasking. Všechny úkoly kromě jednoho jediného odlož na 10 minut stranou. Svět chvíli počká.',
      },
      {
        title: '2. Fyzické odpojení z napětí',
        desc: 'Odstup od stolu nebo monitoru, protáhni paže nad hlavu, napij se doušku chladné vody a prociť chodidla na podlaze.',
      },
      {
        title: '3. Laskavá hranice',
        desc: 'Řekni si v duchu: „Jsem jen člověk, dělám to nejlepší, co v tuto chvíli dovedu. Mám právo se teď nadechnout.“',
      },
    ],
  },
  {
    id: 'distracted',
    label: 'Roztržitě a nesoustředěně',
    tone: 'bg-[#D6E6F5] text-[#265377] border-[#B8D3EC]',
    response: 'Je naprosto v pořádku, když myšlenky létají sem a tam. Není třeba se za to trestat, jen je jemně ukotvi.',
    suggestionAction: 'Zklidnit se dechem do čtverce',
    targetId: 'dechy',
  },
  {
    id: 'tired',
    label: 'Unaveně a bez energie',
    tone: 'bg-[#E7DEF5] text-[#4F3B6A] border-[#CEBFDF]',
    response: 'Tvé tělo i mysl si žádají odpočinek. Dovol si zpomalit tempo a dopřát si chvíli bez jakýchkoli očekávání.',
    suggestionAction: 'Sledovat padající listí nebo puzzle',
    targetId: 'minihra',
  },
];

interface MoodCheckProps {
  onScrollTo: (id: string) => void;
}

export const MoodCheck: React.FC<MoodCheckProps> = ({ onScrollTo }) => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [showCrisisHelp, setShowCrisisHelp] = useState<boolean>(false);
  const [sighStep, setSighStep] = useState<number>(0);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    setSighStep(0);
    playChime(2);
  };

  const triggerPhysiologicalSigh = () => {
    setSighStep(1);
    playChime(0);
    setTimeout(() => {
      setSighStep(2);
      playChime(1);
    }, 1500);
    setTimeout(() => {
      setSighStep(3);
      playChime(3);
    }, 3000);
    setTimeout(() => {
      setSighStep(0);
      playChime(4);
    }, 7000);
  };

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/85 border border-[#DACCEE] rounded-3xl p-6 sm:p-8 shadow-xs text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF8FD] border border-[#DDD4EC] text-xs font-medium text-[#5F4B78] mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-[#8869B2]" />
            <span>Jemné zastavení</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-light text-[#2E2342] font-display mb-2">
            Jak se právě v tomto okamžiku cítíš?
          </h3>
          <p className="text-xs sm:text-sm text-[#677587] mb-6">
            Pojmenování pocitu je prvním krokem k uvolnění. Vyber to, co nejvíce vystihuje tvůj stav:
          </p>

          {/* Mood Options Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            {MOODS.map((mood) => {
              const isSelected = selectedMood?.id === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => handleSelectMood(mood)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `${mood.tone} shadow-xs scale-105 font-semibold ring-2 ring-black/5`
                      : 'bg-white border-[#E0D8ED] text-[#556375] hover:bg-[#FAF8FC]'
                  }`}
                >
                  {mood.label}
                </button>
              );
            })}
          </div>

          {/* Response Message with Actionable What-To-Do Guide */}
          {selectedMood && (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8FD] border border-[#DDD3EB] text-left max-w-2xl mx-auto mb-6 transition-all shadow-xs animate-in fade-in duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white text-[#5F457E] shadow-2xs shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#302146] mb-1 font-display">
                    {selectedMood.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#53406E] leading-relaxed">
                    {selectedMood.response}
                  </p>
                </div>
              </div>

              {/* Actionable steps (Co dělat teď) for Stress / Under Pressure */}
              {selectedMood.steps && selectedMood.steps.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E8DEF2]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6A4D8C]">
                      Co dělat právě teď (okamžitá úleva):
                    </span>
                    {(selectedMood.id === 'stressed' || selectedMood.id === 'pressure') && (
                      <button
                        type="button"
                        onClick={triggerPhysiologicalSigh}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                          sighStep > 0
                            ? 'bg-[#5C3E7C] text-white border-[#472E62] animate-pulse'
                            : 'bg-white border-[#D6C6E8] text-[#533B70] hover:bg-[#F3ECFA]'
                        }`}
                        title="Vést fyziologický dvojitý nádech"
                      >
                        <span>
                          {sighStep === 0 && '✨ Zkusit fyziologický dech'}
                          {sighStep === 1 && '1. Nádech...'}
                          {sighStep === 2 && '2. Donádech nosem!'}
                          {sighStep === 3 && '3. Dlouhý výdech ústy...'}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {selectedMood.steps.map((st, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/80 border border-[#E4D7F0] text-xs">
                        <div className="font-semibold text-[#382650] mb-0.5">{st.title}</div>
                        <div className="text-[#657385] leading-relaxed">{st.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-[#E8DEF2] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#7A8696]">
                  Doporučený krok pro tvůj stav:
                </span>
                <button
                  onClick={() => onScrollTo(selectedMood.targetId)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#493563] text-white hover:bg-[#3D2C53] transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#DBCDF0]" />
                  <span>{selectedMood.suggestionAction}</span>
                </button>
              </div>
            </div>
          )}

          {/* --- CRISIS HARMONY BUTTON --- */}
          <div className="pt-4 border-t border-[#EDE5F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#75668A]">
              Je ti nesnesitelně těžko nebo máš myšlenky na ublížení?
            </span>
            <button
              onClick={() => {
                setShowCrisisHelp(true);
                playChime(1);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCE8ED] border border-[#F5C2CE] text-[#862D48] hover:bg-[#F9D9E2] font-medium transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#A53457]" />
              <span>Pokud si chceš ublížit – co dělat teď</span>
            </button>
          </div>

          {/* Link to Helping Others Guide */}
          <div className="pt-3 border-t border-[#EDE5F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#6C5D80]">
              Potřebuješ naopak pomoci kamarádovi nebo blízkému při záchvatu paniky?
            </span>
            <button
              onClick={() => onScrollTo('pomoc-druhemu')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFE9F7] border border-[#D8C7EB] text-[#553874] hover:bg-[#E7DDF4] font-medium transition-colors cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#6B4694]" />
              <span>Jak pomoci druhému při panice →</span>
            </button>
          </div>
        </div>

        {/* --- CRISIS ASSISTANCE MODAL / OVERLAY --- */}
        {showCrisisHelp && (
          <div className="fixed inset-0 z-50 bg-[#2D223F]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#DDCFEA] relative my-8 animate-fadeIn text-left">
              <button
                onClick={() => setShowCrisisHelp(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[#7B8899] hover:text-[#2D223F] hover:bg-[#FAF8FD] transition-colors cursor-pointer"
                title="Zavřít"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 text-[#912B4A] mb-2">
                <Heart className="w-5 h-5 fill-[#FCE8ED]" />
                <span className="text-xs uppercase font-semibold tracking-wider">
                  Nouzový plán pro těžkou chvíli
                </span>
              </div>

              <h3 className="text-2xl font-light text-[#2E2342] font-display mb-3">
                Zastav se na tuto jednu jedinou minutu
              </h3>

              <div className="p-4 rounded-2xl bg-[#FFF6F8] border border-[#FADCE3] text-xs sm:text-sm text-[#6F3045] leading-relaxed mb-6">
                <strong>Nejsi v tom sám/sama a tvůj život má obrovskou hodnotu.</strong> Tato vlna bolesti teď může působit nesnesitelně, ale dosáhne svého vrcholu a opadne. Tvůj mozek je v krizovém poplachu – pomozme tělu zklidnit se bezpečně.
              </div>

              {/* Immediate Safe Alternatives (Harm Reduction / DBT) */}
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5D4C73] mb-3 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#7A619A]" />
                <span>Bezpečné alternativy k ublížení (Co udělat hned teď)</span>
              </h4>

              <div className="space-y-3 mb-6 text-xs text-[#526071]">
                <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#E8DFEF]">
                  <strong className="text-[#3B2857] block mb-0.5">🧊 Šok ledem (Potápěčský reflex):</strong>
                  Ponoř obličej na 15–30 sekund do mísy se studenou vodou, nebo stiskni kostku ledu v dlani. Tělo okamžitě fyziologicky srazí tep a utlumí paniku v amygdale bez jakéhokoliv poškození.
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#E8DFEF]">
                  <strong className="text-[#3B2857] block mb-0.5">🔴 Kreslení červenou fixou na kůži:</strong>
                  Místo řezání si vezmi červenou fixu nebo štětec a nakresli si na zápěstí či nohu linky, ornamenty nebo srdíčka. Umožní to vizuální uvolnění napětí.
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#E8DFEF]">
                  <strong className="text-[#3B2857] block mb-0.5">🧻 Bezpečné vybití adrenalinu:</strong>
                  Vezmi starý časopis, karton či papír a roztrhej ho na tisíc kousků. Můžeš také vší silou křičet do polštáře nebo házet kostky ledu do vany.
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#E8DFEF]">
                  <strong className="text-[#3B2857] block mb-0.5">⏳ Pravidlo 15 minut:</strong>
                  Řekni si: <em>„Neublížím si hned teď. Počkám 15 minut.“</em> Během nich zapni dechové cvičení, pohlaď spící kočičku nebo vypij sklenici ledové vody. Pokud nutkání zůstane, odlož ho o dalších 15 minut.
                </div>
              </div>

              {/* Free 24/7 Crisis Helplines in Czechia */}
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5D4C73] mb-3 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#7A619A]" />
                <span>Bezplatné anonymní linky pomoci (24/7)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6">
                <div className="p-3 rounded-2xl bg-[#F0F6FA] border border-[#BAD6EE]">
                  <div className="font-semibold text-[#255276] text-sm">Linka bezpečí</div>
                  <div className="text-[11px] text-[#557797] mb-2">Pro děti, mládež a studenty do 26 let</div>
                  <a
                    href="tel:116111"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#255276] text-white font-medium hover:bg-[#1E4362] transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Zavolat zdarma 116 111</span>
                  </a>
                </div>

                <div className="p-3 rounded-2xl bg-[#F2F8F5] border border-[#B4DAC7]">
                  <div className="font-semibold text-[#29563E] text-sm">Linka první psychické pomoci</div>
                  <div className="text-[11px] text-[#527963] mb-2">Pro dospělé v krizové situaci (nonstop)</div>
                  <a
                    href="tel:116123"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#29563E] text-white font-medium hover:bg-[#204531] transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Zavolat zdarma 116 123</span>
                  </a>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF5EE] border border-[#E4D1BC] sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#664929] text-sm">Centrum krizové intervence (Bohnice)</div>
                      <div className="text-[11px] text-[#7E6649]">Nonstop krizová linka a ambulantní pomoc</div>
                    </div>
                    <a
                      href="tel:284016666"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#664929] text-white font-medium hover:bg-[#523A20] transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>284 016 666</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#7B8899]">
                  V bezprostředním ohrožení života volej záchrannou službu <strong>155</strong> nebo <strong>112</strong>.
                </span>

                <button
                  onClick={() => setShowCrisisHelp(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#493563] text-white hover:bg-[#3D2C53] transition-colors cursor-pointer shrink-0"
                >
                  Zpět do bezpečí Klídku
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
