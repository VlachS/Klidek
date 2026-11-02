/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Anchor,
  Sun,
  Palette,
  Footprints,
  Eye,
  Wind,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Check,
  Flame,
  PauseOctagon,
  Heart
} from 'lucide-react';
import { playChime } from '../utils/soundEffects';

type GroundingTab = 'improve' | 'tipp' | 'stop' | 'butterfly' | 'room-mapping' | 'sensory-54321';

interface ImproveItem {
  letter: string;
  word: string;
  title: string;
  desc: string;
  actionPrompt: string;
  colorBorder: string;
  colorBg: string;
  textColor: string;
}

const IMPROVE_ITEMS: ImproveItem[] = [
  {
    letter: 'I',
    word: 'Imagery',
    title: 'Představivost a bezpečné místo',
    desc: 'Zavři na chvíli oči a vizualizuj si místo, kde je ti bezpečně, klidně a teplo. Může to být rozkvetlá louka, lesní mech nebo měkká postel.',
    actionPrompt: 'Představ si barvy, teplotu i vůni tohoto bezpečného místa.',
    colorBorder: 'border-[#BAD6EE]',
    colorBg: 'bg-[#F0F6FA]',
    textColor: 'text-[#285779]',
  },
  {
    letter: 'M',
    word: 'Meaning',
    title: 'Hledání vnitřního smyslu',
    desc: 'Připomeň si své hodnoty. I náročné okamžiky a nepohodlí jsou součástí života, ze kterých roste vnitřní moudrost a odolnost.',
    actionPrompt: 'Co tě tato situace může naučit o tvé vlastní síle?',
    colorBorder: 'border-[#C8BAE0]',
    colorBg: 'bg-[#F6F2FB]',
    textColor: 'text-[#503E6B]',
  },
  {
    letter: 'P',
    word: 'Prayer / Přítomnost',
    title: 'Ztišení a odevzdání kontroly',
    desc: 'Nemusíš nést váhu celého světa na svých ramenou. Zhluboka vydechni a odevzdej to, co v této minutě stejně nemůžeš ovlivnit.',
    actionPrompt: 'Otevři dlaně vzhůru a v duchu řekni: „Dovoluji věcem plynout.“',
    colorBorder: 'border-[#B4DAC7]',
    colorBg: 'bg-[#F2F8F5]',
    textColor: 'text-[#2D5A42]',
  },
  {
    letter: 'R',
    word: 'Relaxation',
    title: 'Fyzické uvolnění svalů',
    desc: 'Všimni si, kde v těle držíš napětí – v čelisti, ramenou, břiše či dlaních. Vědomě tyto oblasti uvolni a nech ztěžknout.',
    actionPrompt: 'Spusť ramena dolů od uší a povol stisknuté zuby.',
    colorBorder: 'border-[#F0C9D7]',
    colorBg: 'bg-[#FAF2F5]',
    textColor: 'text-[#6D344B]',
  },
  {
    letter: 'O',
    word: 'One thing',
    title: 'Jedna jediná věc v přítomnosti',
    desc: 'Zastav multitasking a přemýšlení o deseti věcech dopředu. Zaměř celou svou pozornost pouze na jeden jediný bezprostřední vjem.',
    actionPrompt: 'Vnímej jen tento jeden nádech a tento jeden výdech.',
    colorBorder: 'border-[#BAD6EE]',
    colorBg: 'bg-[#F0F6FA]',
    textColor: 'text-[#285779]',
  },
  {
    letter: 'V',
    word: 'Vacation',
    title: 'Krátká dovolená pro mysl',
    desc: 'Dopřej si legální 5minutovou přestávku od povinností a zpráv. Zabal se do deky, uvař si čaj nebo jen v tichu koukej z okna.',
    actionPrompt: 'Dnes máš plné právo na malou chvíli odpočinku.',
    colorBorder: 'border-[#C8BAE0]',
    colorBg: 'bg-[#F6F2FB]',
    textColor: 'text-[#503E6B]',
  },
  {
    letter: 'E',
    word: 'Encouragement',
    title: 'Laskavé sebepovzbuzení',
    desc: 'Mluv k sobě tak laskavě, jak bys mluvil ke svému nejlepšímu příteli. Žádná sebekritika, jen pochopení a něha.',
    actionPrompt: 'Řekni si: „Zvládám to. Jsem v bezpečí a dělám to nejlepší, co dovedu.“',
    colorBorder: 'border-[#B4DAC7]',
    colorBg: 'bg-[#F2F8F5]',
    textColor: 'text-[#2D5A42]',
  },
];

const TIPP_ITEMS = [
  {
    letter: 'T',
    word: 'Temperature (Změna teploty)',
    title: 'Aktivace potápěčského reflexu chladem',
    desc: 'Ledová voda na tvář nebo kostka ledu v dlaních aktivuje parasympatikus a okamžitě sníží tepovou frekvenci i hladinu adrenalinu.',
    guide: 'Ponoř obličej do misky s ledovou vodou na 15–30 sekund, nebo si přilož chladivý obklad na čelo a zátylek.',
    colorBorder: 'border-[#BAD6EE]',
    colorBg: 'bg-[#F0F6FA]',
    textColor: 'text-[#245275]',
  },
  {
    letter: 'I',
    word: 'Intense Exercise (Intenzivní pohyb)',
    title: 'Krátké fyzické vybití tělesného stresu',
    desc: 'Když je tělo zaplaveno stresem bojuj-nebo-uteč, krátký intenzivní pohyb pomůže bezpečně metabolizovat nahromaděný kortizol.',
    guide: 'Udělej 20 dřepů, skákej panáka nebo rychlou chůzí vyjdi schody. Stačí 1–2 minuty.',
    colorBorder: 'border-[#B8DDCB]',
    colorBg: 'bg-[#F2F9F5]',
    textColor: 'text-[#26533D]',
  },
  {
    letter: 'P',
    word: 'Paced Breathing (Rytmický dech)',
    title: 'Prodloužený výdech pro zklidnění srdce',
    desc: 'Výdech delší než nádech přímo stimuluje bloudivý nerv (nervus vagus), což signalizuje mozku, že nebezpečí pominulo.',
    guide: 'Nadechuj se nosem na 4 doby a vydechuj ústy na 6 až 8 dob. Opakuj 5 cyklů.',
    colorBorder: 'border-[#C8BAE0]',
    colorBg: 'bg-[#F6F2FB]',
    textColor: 'text-[#4F3E68]',
  },
  {
    letter: 'P',
    word: 'Paired Muscle Relaxation (Svalová relaxace)',
    title: 'Zatnout a úplně povolit',
    desc: 'Vědomé zatnutí svalové skupiny na maximum a následné hluboké uvolnění vytváří v těle fyzickou vlnu úlevy.',
    guide: 'Sevři pěsti a zvedni ramena k uším na 5 sekund. Pak s hlubokým výdechem vše naráz pusť a vnímej těžknoucí teplo.',
    colorBorder: 'border-[#F0C9D7]',
    colorBg: 'bg-[#FAF2F5]',
    textColor: 'text-[#6D344B]',
  },
];

const STOP_ITEMS = [
  {
    step: 'S',
    title: 'Stop (Zastav se)',
    desc: 'Zmrznout na místě. Nezvedej telefon, nepiš zprávu, nedělej žádný impulzivní pohyb. Tvá jediná úloha v této vteřině je nedělat vůbec nic.',
    action: 'Zastav pohyb rukou i těla a setrvej.',
  },
  {
    step: 'T',
    title: 'Take a step back (Udělej krok zpět)',
    desc: 'Fyzicky i mentálně odstup ze situace. Napij se vody, uvolni sevření čelisti, zhluboka vydechni. Dopřej svému emočnímu mozku čas vychladnout.',
    action: 'Udělej jeden krok vzad nebo se posaď a uvolni dlaně.',
  },
  {
    step: 'O',
    title: 'Observe (Pozoruj)',
    desc: 'Co se právě děje uvnitř tebe a co kolem tebe? Jaké myšlenky teď přicházejí? Všímej si jich jako mraků na nebi, aniž bys jim věřil/a.',
    action: 'Pojmenuj v duchu: „Vnímám, že mám v těle silnou úzkost, ale já nejsem tato emoce.“',
  },
  {
    step: 'P',
    title: 'Proceed mindfully (Postupuj vědomě)',
    desc: 'Zeptej se svého moudrého já: „Co mi v této chvíli skutečně pomůže a neuškodí?“ Zvol reakci, která situaci nezhorší.',
    action: 'Zvol laskavý a bezpečný další krok.',
  },
];

const ROOM_STEPS = [
  {
    step: 1,
    title: 'Prosvětlení pokoje a stíny',
    desc: 'Všimni si, odkud sem proniká světlo. Je místnost prosvětlená denním sluncem, zataženou oblohou nebo teplým světlem lampy? Jaké jemné stíny dopadají na nábytek a stěny?',
    icon: Sun,
    color: 'text-[#856328]',
    bgIcon: 'bg-[#F9F3E5]',
  },
  {
    step: 2,
    title: 'Barvy a povrch stěn',
    desc: 'Jakou barvu mají stěny kolem tebe? Jsou hladké, zrnité nebo se na nich láme světlo? Visí na nich obraz, police nebo zrcadlo? Popiš si jejich odstín bez hodnocení.',
    icon: Palette,
    color: 'text-[#634E7D]',
    bgIcon: 'bg-[#EFE7F8]',
  },
  {
    step: 3,
    title: 'Podlaha a stabilita opory',
    desc: 'Zaměř se na podlahu. Je to dřevo, koberec nebo dlažba? Vnímej, jak pevná a nehybná tato podlaha je. Gravitace tě bezpečně drží, ať se děje cokoliv.',
    icon: Footprints,
    color: 'text-[#2D5E46]',
    bgIcon: 'bg-[#E3F4EA]',
  },
  {
    step: 4,
    title: '3 konkrétní předměty v místnosti',
    desc: 'Vyber si očima tři konkrétní věci. Všimni si jejich tvaru (obdélník, ovál), materiálu (dřevo, sklo, papír) a barvy. Jmenuj je v duchu: „Vidím dřevěnou židli, keramický hrnek a zelený list fíkusu.“',
    icon: Eye,
    color: 'text-[#305C7C]',
    bgIcon: 'bg-[#E2EFF8]',
  },
  {
    step: 5,
    title: 'Teplota a proudění vzduchu',
    desc: 'Jaký je vzduch na tvé pokožce? Cítíš příjemné teplo svetru, chladnější závan od okna nebo vůni dřeva či svíčky? Vnímej, jak tě tento prostor právě teď obklopuje.',
    icon: Wind,
    color: 'text-[#487898]',
    bgIcon: 'bg-[#E0EFF8]',
  },
];

const SENSORY_54321 = [
  { count: '5', label: 'Věcí, které vidíš', prompt: 'Najdi 5 věcí v okolí a v duchu si všimni jejich tvarů a odstínů.' },
  { count: '4', label: 'Věcí, kterých se můžeš dotknout', prompt: 'Pohlaď látku oblečení, chlad stolu, své vlastní dlaně či opěradlo.' },
  { count: '3', label: 'Zvuky, které slyšíš', prompt: 'Zaposlouchej se: tichý šum místnosti, vzdálený vítr venku, tvůj vlastní dech.' },
  { count: '2', label: 'Vůně, které vnímáš', prompt: 'Nasaj vzduch: vůně čaje, mýdla, čerstvého vzduchu či nábytku.' },
  { count: '1', label: 'Pozitivní vjem v těle', prompt: 'Uvolnění v šíji, teplo v dlaních nebo pocit klidné opory v zádech.' },
];

export const GroundingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GroundingTab>('improve');
  const [roomStep, setRoomStep] = useState(0);
  const [checkedSensory, setCheckedSensory] = useState<Record<number, boolean>>({});

  // Butterfly hug interactive tap pacing
  const [butterflySide, setButterflySide] = useState<'left' | 'right'>('left');
  const [butterflyCount, setButterflyCount] = useState<number>(0);

  const handleButterflyTap = (side: 'left' | 'right') => {
    playChime(side === 'left' ? 1 : 3);
    setButterflySide(side === 'left' ? 'right' : 'left');
    setButterflyCount((c) => c + 1);
  };

  const handleToggleSensory = (idx: number) => {
    playChime(idx);
    setCheckedSensory((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section id="uzemneni" className="py-20 bg-[#F5F2F9] border-t border-[#EDE7F6]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#CDE8D8] border border-[#B1DCBF] text-xs font-medium text-[#29573E] mb-3">
            <Anchor className="w-3.5 h-3.5" />
            <span>Techniky uzemnění a krizové odolnosti (DBT & Mindfulness)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#2D223F] font-display mb-3 text-balance">
            Návrat k sobě a do přítomného okamžiku
          </h2>

          <p className="text-sm sm:text-base text-[#616D7E] leading-relaxed">
            Vyzkoušej osvědčené vědecké postupy pro zvládání akutního stresu, přetížení a zklidnění nervového systému:
          </p>
        </div>

        {/* Tab Switcher - 6 Techniques */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/70 border border-[#E3DCED] rounded-2xl max-w-3xl mx-auto mb-10 shadow-xs">
          <button
            onClick={() => { setActiveTab('improve'); playChime(0); }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'improve' ? 'bg-[#E8DFF5] text-[#412E5D] shadow-xs font-semibold' : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            Metoda IMPROVE
          </button>

          <button
            onClick={() => { setActiveTab('tipp'); playChime(1); }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tipp' ? 'bg-[#D2E7F6] text-[#224A69] shadow-xs font-semibold' : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            Krize: Metoda TIPP
          </button>

          <button
            onClick={() => { setActiveTab('stop'); playChime(2); }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stop' ? 'bg-[#F9E2E8] text-[#712F43] shadow-xs font-semibold' : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            Brzda: Metoda STOP
          </button>

          <button
            onClick={() => { setActiveTab('butterfly'); playChime(3); }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'butterfly' ? 'bg-[#F5EDDE] text-[#694F2B] shadow-xs font-semibold' : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            Motýlí objetí
          </button>

          <button
            onClick={() => { setActiveTab('room-mapping'); playChime(4); }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'room-mapping' ? 'bg-[#CDE8D8] text-[#29523D] shadow-xs font-semibold' : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            Mapování pokoje
          </button>

          <button
            onClick={() => { setActiveTab('sensory-54321'); playChime(5); }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sensory-54321' ? 'bg-[#E5D8F2] text-[#472E66] shadow-xs font-semibold' : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            Kotva 5-4-3-2-1
          </button>
        </div>

        {/* 1. METODA IMPROVE */}
        {activeTab === 'improve' && (
          <div className="bg-white/90 border border-[#E4DEF0] rounded-3xl p-6 sm:p-10 shadow-sm animate-fadeIn">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9F7] text-xs font-semibold text-[#5A4575] mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Krizová technika DBT (Distress Tolerance)</span>
              </div>
              <h3 className="text-2xl font-light text-[#2E2342] font-display mb-2">
                Metoda I·M·P·R·O·V·E
              </h3>
              <p className="text-xs sm:text-sm text-[#6C798B]">
                7 jemných mentálních a tělesných kotev, které pomáhají překonat náročné chvíle a navrátit pocit bezpečí.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IMPROVE_ITEMS.map((item) => (
                <div
                  key={item.letter}
                  className={`p-5 rounded-2xl border ${item.colorBorder} ${item.colorBg} flex items-start gap-4 transition-all hover:shadow-xs`}
                >
                  <div className={`w-11 h-11 rounded-2xl bg-white shadow-xs border ${item.colorBorder} flex items-center justify-center shrink-0`}>
                    <span className={`text-xl font-bold font-display ${item.textColor}`}>{item.letter}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-base font-medium ${item.textColor}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-[#8B7C9E] tracking-wider">
                        ({item.word})
                      </span>
                    </div>

                    <p className="text-xs text-[#5E6B7C] leading-relaxed mb-2.5">
                      {item.desc}
                    </p>

                    <div className="p-2.5 rounded-xl bg-white/70 border border-black/5 text-[11px] text-[#48375F] italic">
                      ✨ {item.actionPrompt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. METODA TIPP */}
        {activeTab === 'tipp' && (
          <div className="bg-white/90 border border-[#D5E5F2] rounded-3xl p-6 sm:p-10 shadow-sm animate-fadeIn">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#224A69] block mb-1">
                Fyziologická záchranná brzda
              </span>
              <h3 className="text-2xl font-light text-[#1F415D] font-display mb-2">
                Metoda T·I·P·P (Okamžité zklidnění těla)
              </h3>
              <p className="text-xs sm:text-sm text-[#667B8E]">
                Když je stres na škále 10 z 10 a slova nepomáhají, TIPP přímo přepne autonomní nervový systém z paniky do bezpečí.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIPP_ITEMS.map((item) => (
                <div
                  key={item.letter}
                  className={`p-5 rounded-2xl border ${item.colorBorder} ${item.colorBg} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center font-bold text-base text-[#245275]">
                        {item.letter}
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${item.textColor}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-[#697E90] uppercase font-medium">
                          {item.word}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#526678] leading-relaxed mb-3">
                      {item.desc}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 border border-black/5 text-xs text-[#204561]">
                    <strong>Jak na to:</strong> {item.guide}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. METODA STOP */}
        {activeTab === 'stop' && (
          <div className="bg-white/90 border border-[#F4D6DE] rounded-3xl p-6 sm:p-10 shadow-sm animate-fadeIn">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE8ED] text-xs font-semibold text-[#8B344D] mb-2">
                <PauseOctagon className="w-3.5 h-3.5" />
                <span>Záchranná brzda před impulzivním jednáním</span>
              </div>
              <h3 className="text-2xl font-light text-[#2E2342] font-display mb-2">
                Metoda S·T·O·P
              </h3>
              <p className="text-xs sm:text-sm text-[#6C798B]">
                Jednoduchý čtyřkrokový rituál, který zabrání udělat v afektu či bolesti věci, kterých bys později litoval/a.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3.5">
              {STOP_ITEMS.map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F5D8E0] flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#FAD2DC] text-[#7E2841] font-bold font-display text-lg flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#652034] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#635359] leading-relaxed mb-2">
                      {item.desc}
                    </p>
                    <div className="text-[11px] font-medium text-[#7A364C] bg-white/80 px-2.5 py-1 rounded-lg inline-block border border-[#F0D0D9]">
                      👉 {item.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MOTÝLÍ OBJETÍ (Bilaterální stimulace) */}
        {activeTab === 'butterfly' && (
          <div className="bg-white/90 border border-[#EBE2D4] rounded-3xl p-6 sm:p-10 shadow-sm animate-fadeIn text-center">
            <div className="max-w-xl mx-auto mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#694E27] block mb-1">
                Neurologické zklidnění
              </span>
              <h3 className="text-2xl font-light text-[#3B2C16] font-display mb-2">
                Motýlí objetí (Butterfly Hug)
              </h3>
              <p className="text-xs sm:text-sm text-[#74644E] leading-relaxed">
                Metoda bilaterální stimulace používaná v psychoterapii traumat (EMDR). Střídavé poklepávání na ramena pomáhá synchronizovat obě mozkové hemisféry a navozuje pocit hlubokého bezpečí.
              </p>
            </div>

            {/* Interactive Butterfly Tap Assistant */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#FBF7F0] border border-[#E8DDCD] mb-6">
              <div className="flex items-center justify-center gap-6 my-4">
                <button
                  onClick={() => handleButterflyTap('left')}
                  className={`w-24 h-24 rounded-3xl border-2 font-display text-xs font-semibold transition-all transform active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1 shadow-xs ${
                    butterflySide === 'left'
                      ? 'bg-[#E3D4BC] border-[#9E7F55] text-[#423118] scale-105'
                      : 'bg-white border-[#DFD1BF] text-[#7E6C55] hover:bg-white/80'
                  }`}
                >
                  <Heart className="w-5 h-5 fill-[#E3D4BC]" />
                  <span>Levé rameno</span>
                </button>

                <button
                  onClick={() => handleButterflyTap('right')}
                  className={`w-24 h-24 rounded-3xl border-2 font-display text-xs font-semibold transition-all transform active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1 shadow-xs ${
                    butterflySide === 'right'
                      ? 'bg-[#E3D4BC] border-[#9E7F55] text-[#423118] scale-105'
                      : 'bg-white border-[#DFD1BF] text-[#7E6C55] hover:bg-white/80'
                  }`}
                >
                  <Heart className="w-5 h-5 fill-[#E3D4BC]" />
                  <span>Pravé rameno</span>
                </button>
              </div>

              <p className="text-xs text-[#705E47] mb-2">
                Zkřiž dlaně na hrudi tak, aby prsty směřovaly ke klíčním kostem a palce tvořily tělo motýla.
                Klikej střídavě na tlačítka nebo střídavě poklepávej prsty na svá ramena v pomalém rytmu dechu.
              </p>

              <div className="text-xs text-[#8A7963]">
                Počet jemných doteků: <strong className="text-[#3B2C16] font-semibold tabular-nums">{butterflyCount}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 5. DESKRIPTIVNÍ MAPOVÁNÍ MÍSTNOSTI */}
        {activeTab === 'room-mapping' && (
          <div className="bg-white/90 border border-[#DFEDE5] rounded-3xl p-6 sm:p-10 shadow-sm animate-fadeIn">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3D6C53] block mb-1">
                Vědomé ukotvení v prostoru
              </span>
              <h3 className="text-2xl font-light text-[#214332] font-display mb-2">
                Deskriptivní mapování místnosti
              </h3>
              <p className="text-xs sm:text-sm text-[#677A6F]">
                Když tě zaplavují myšlenky, začni nestranně a podrobně popisovat prostředí kolem sebe.
                Prozkoumej světlo, zdi, podlahu a předměty jako laskavý pozorovatel.
              </p>
            </div>

            <div className="max-w-xl mx-auto mb-8">
              <div className="flex items-center justify-between text-xs text-[#637C6D] mb-2 font-medium">
                <span>Krok {roomStep + 1} z {ROOM_STEPS.length}: {ROOM_STEPS[roomStep].title}</span>
                <span className="tabular-nums">{Math.round(((roomStep + 1) / ROOM_STEPS.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5F0E9] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#A3D9C9] to-[#6EB397] transition-all duration-300"
                  style={{ width: `${((roomStep + 1) / ROOM_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {(() => {
              const current = ROOM_STEPS[roomStep];
              const Icon = current.icon;

              return (
                <div className="max-w-xl mx-auto bg-[#F7FAF8] border border-[#D8EADB] rounded-2xl p-6 sm:p-8 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${current.bgIcon} flex items-center justify-center mx-auto mb-4 shadow-2xs`}>
                    <Icon className={`w-7 h-7 ${current.color}`} />
                  </div>

                  <h4 className="text-xl font-medium text-[#224433] font-display mb-2">
                    {current.title}
                  </h4>

                  <p className="text-sm text-[#506659] leading-relaxed mb-6">
                    {current.desc}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setRoomStep((s) => Math.max(0, s - 1))}
                      disabled={roomStep === 0}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        roomStep === 0
                          ? 'opacity-40 cursor-not-allowed border-transparent text-[#97A89F]'
                          : 'bg-white border-[#D2E4DA] text-[#345B45] hover:bg-[#F2F7F4]'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Předchozí vjem</span>
                    </button>

                    {roomStep < ROOM_STEPS.length - 1 ? (
                      <button
                        onClick={() => {
                          setRoomStep((s) => s + 1);
                          playChime(roomStep + 1);
                        }}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[#2C5940] text-white hover:bg-[#234733] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Další vjem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#CDE8D8] text-[#24523B]">
                        <CheckCircle2 className="w-4 h-4 text-[#2E6B4B]" />
                        <span>Místnost vědomě zmapována</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. SMYSLOVÁ KOTVA 5-4-3-2-1 */}
        {activeTab === 'sensory-54321' && (
          <div className="bg-white/90 border border-[#D7E6F4] rounded-3xl p-6 sm:p-10 shadow-sm animate-fadeIn">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B5E85] block mb-1">
                Klasická smyslová kotva
              </span>
              <h3 className="text-2xl font-light text-[#1F415D] font-display mb-2">
                Metoda 5 - 4 - 3 - 2 - 1
              </h3>
              <p className="text-xs sm:text-sm text-[#667B8E]">
                Postupně zapoj všech pět smyslů. Kliknutím na řádek si položku odškrtneš a uslyšíš jemný zvonivý tón.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-3">
              {SENSORY_54321.map((item, idx) => {
                const isChecked = Boolean(checkedSensory[idx]);

                return (
                  <button
                    key={item.count}
                    onClick={() => handleToggleSensory(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                      isChecked
                        ? 'bg-[#EBF5FA] border-[#B9D7ED] shadow-xs'
                        : 'bg-[#FAF8FD] border-[#E5DEEE] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-display text-base shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#2B5E85] text-white'
                            : 'bg-[#E3EFF8] text-[#2B5E85]'
                        }`}
                      >
                        {item.count}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#2E2342]">
                          {item.label}
                        </h4>
                        <p className="text-xs text-[#6A788A] mt-0.5">
                          {item.prompt}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-[#2B5E85] border-[#2B5E85] text-white'
                          : 'border-[#CAD8E4] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
