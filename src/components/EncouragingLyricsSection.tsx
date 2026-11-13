/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Music, Heart, Sparkles, RefreshCw, Disc3, Quote, Languages } from 'lucide-react';

interface LyricExcerpt {
  id: string;
  lines: string[];
  linesCz: string[];
  songTitle: string;
  artist: string;
  standalone?: boolean;
}

const LYRIC_EXCERPTS: LyricExcerpt[] = [
  // RAYE — I Know You're Hurting
  {
    id: 'hurting-1',
    lines: [
      'I know life can be a bitch, some call her Monday',
      "And I'm thinkin' of you, dear, I hope you're okay, yeah",
    ],
    linesCz: [
      'Vím, že život umí být pěkná potvora – někteří jí říkají pondělí',
      'A myslím na tebe, drahý/á, doufám, že jsi v pořádku',
    ],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
  },
  {
    id: 'hurting-2',
    lines: [
      "If you need two more arms to hold these burdens, I'm here",
      "I said a prayer for you, I hope it's working",
    ],
    linesCz: [
      'Pokud potřebuješ další dvě paže, které ti pomohou nést tuhle tíhu, jsem tady',
      'Pomodlila jsem se za tebe a doufám, že to pomáhá',
    ],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
  },
  {
    id: 'hurting-3',
    lines: ["Please, my dear, don't stop believing in miracles"],
    linesCz: ['Prosím, nejdražší, nepřestávej věřit na zázraky'],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
    standalone: true,
  },
  {
    id: 'hurting-4',
    lines: [
      'Please, stop trying to be so strong all alone, all alone',
      "You don't have to do this all alone",
    ],
    linesCz: [
      'Prosím, přestaň se snažit být tak silný/á úplně sám, úplně sama',
      'Nemusíš to všechno zvládat o samotě',
    ],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
  },
  {
    id: 'hurting-5',
    lines: [
      "If you're listening to this, I need you to hear me now",
      "Don't you give up on your life",
      'Stay with me now, oh',
    ],
    linesCz: [
      'Jestli tohle posloucháš, potřebuji, abys mě teď slyšel/a',
      'Nevzdávej svůj život',
      'Zůstaň tu teď se mnou',
    ],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
  },
  {
    id: 'hurting-6',
    lines: ["It's gonna be fine, it's gonna be alright, it's gonna be okay, it's gonna be okay"],
    linesCz: ['Bude to dobré, všechno dobře dopadne, bude to v pořádku, bude to v pořádku'],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
    standalone: true,
  },

  // RAYE — Lifeboat
  {
    id: 'lifeboat-1',
    lines: ['Say, "I\'m not giving up yet"'],
    linesCz: ['Řekni si: „Ještě to nevzdávám“'],
    songTitle: 'Lifeboat',
    artist: 'RAYE',
    standalone: true,
  },
  {
    id: 'lifeboat-2',
    lines: [
      "Whether you're going through darkness, there is a future",
      "There's a way forward",
      "There's, there's hope",
    ],
    linesCz: [
      'I když teď procházíš temnotou, budoucnost existuje',
      'Existuje cesta vpřed',
      'Je tu, pořád je tu naděje',
    ],
    songTitle: 'Lifeboat',
    artist: 'RAYE',
  },
  {
    id: 'lifeboat-3',
    lines: ["Don't know how I'll do this", "I'm not giving up"],
    linesCz: ['Nevím sice, jak tohle zvládnu', 'Ale nevzdávám se'],
    songTitle: 'Lifeboat',
    artist: 'RAYE',
  },
  {
    id: 'lifeboat-4',
    lines: [
      'You might not believe it',
      'But I need you to speak it (never give up)',
      'Say it like you mean it',
    ],
    linesCz: [
      'Možná tomu teď ještě nevěříš',
      'Ale potřebuji, abys to vyslovil/a nahlas (nikdy se nevzdávej)',
      'Řekni to tak, že to myslíš vážně',
    ],
    songTitle: 'Lifeboat',
    artist: 'RAYE',
  },

  // Jeremy Zucker & Chelsea Cutler — Just Breathe
  {
    id: 'just-breathe-1',
    lines: ["You're gonna be fine", "You're doing alright"],
    linesCz: ['Budeš v pořádku', 'Vedeš si dobře'],
    songTitle: 'Just Breathe',
    artist: 'Jeremy Zucker & Chelsea Cutler',
    standalone: true,
  },

  // RAYE — Joy
  {
    id: 'joy-1',
    lines: ['I may cry through the night, but my joy comes in the morning'],
    linesCz: ['Možná propláču celou noc, ale s ránem přichází má radost'],
    songTitle: 'Joy',
    artist: 'RAYE',
    standalone: true,
  },
  {
    id: 'joy-2',
    lines: ['I declare there will be joy, I declare there will be joy, I declare there will be joy'],
    linesCz: ['Prohlašuji, že přijde radost, přijde radost, zase přijde radost'],
    songTitle: 'Joy',
    artist: 'RAYE',
    standalone: true,
  },
  {
    id: 'joy-3',
    lines: [
      "There's a war in your mind",
      'Your sorrows may endure',
      'But the light comes with the morning',
    ],
    linesCz: [
      'V tvé mysli teď zuří válka',
      'Tvůj smutek možná ještě chvíli potrvá',
      'Ale s ránem vždycky přichází světlo',
    ],
    songTitle: 'Joy',
    artist: 'RAYE',
  },

  // RAYE — Happier Times Ahead (rozděleno do 2 přirozených celků)
  {
    id: 'happier-1',
    lines: [
      'Happier times ahead',
      'Life is not fair',
      'Life can be hard',
      'But we only get one',
    ],
    linesCz: [
      'Čekají nás šťastnější časy',
      'Život není fér',
      'Život umí být těžký',
      'Ale máme jenom jeden',
    ],
    songTitle: 'Happier Times Ahead',
    artist: 'RAYE',
  },
  {
    id: 'happier-2',
    lines: [
      'Whatever may come',
      'Find a little faith to hold on, my friend',
      'There will be happier times again',
    ],
    linesCz: [
      'Ať už přijde cokoliv',
      'Najdi v sobě kousek víry a drž se, příteli',
      'Zase přijdou šťastnější časy',
    ],
    songTitle: 'Happier Times Ahead',
    artist: 'RAYE',
  },

  // RAYE — Click Clack Symphony
  {
    id: 'click-clack-1',
    lines: [
      'The cold never lasts, my darling',
      'It just teaches the heart how to burn',
    ],
    linesCz: [
      'Chlad nikdy netrvá věčně, můj milý / má milá',
      'Jen učí srdce, jak znovu hřát a hořet',
    ],
    songTitle: 'Click Clack Symphony',
    artist: 'RAYE',
    standalone: true,
  },
];

const SONG_CREDITS = [
  { songTitle: "I Know You're Hurting", artist: 'RAYE' },
  { songTitle: 'Lifeboat', artist: 'RAYE' },
  { songTitle: 'Joy', artist: 'RAYE' },
  { songTitle: 'Happier Times Ahead', artist: 'RAYE' },
  { songTitle: 'Click Clack Symphony', artist: 'RAYE' },
  { songTitle: 'Just Breathe', artist: 'Jeremy Zucker & Chelsea Cutler' },
];

export const EncouragingLyricsSection: React.FC = () => {
  const [featuredIndex, setFeaturedIndex] = useState<number>(2);
  const [selectedSongFilter, setSelectedSongFilter] = useState<string>('all');
  const [showGlobalCzech, setShowGlobalCzech] = useState<boolean>(false);
  const [cardTranslated, setCardTranslated] = useState<Record<string, boolean>>({});

  const featured = LYRIC_EXCERPTS[featuredIndex];
  const isFeaturedTranslated = showGlobalCzech || !!cardTranslated[featured.id];

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % LYRIC_EXCERPTS.length);
  };

  const toggleSingleCardTranslation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showGlobalCzech) {
      // If global Czech is active, toggling an individual card switches off global mode and keeps others
      const nextMap: Record<string, boolean> = {};
      LYRIC_EXCERPTS.forEach((item) => {
        nextMap[item.id] = item.id !== id;
      });
      setShowGlobalCzech(false);
      setCardTranslated(nextMap);
    } else {
      setCardTranslated((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleToggleAllTranslations = () => {
    const next = !showGlobalCzech;
    setShowGlobalCzech(next);
    if (!next) {
      setCardTranslated({});
    }
  };

  const filteredLyrics =
    selectedSongFilter === 'all'
      ? LYRIC_EXCERPTS
      : LYRIC_EXCERPTS.filter((item) => item.songTitle === selectedSongFilter);

  return (
    <section className="py-16 bg-white/50 border-t border-[#DFD5EC] transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DFF5] border border-[#D5C6E8] text-xs font-medium text-[#543878] mb-3">
            <Music className="w-3.5 h-3.5" />
            <span>Slova z písní, která drží nad vodou</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#2D223F] font-display mb-3 text-balance">
            Když potřebuješ slyšet, že v tom nejsi sám
          </h2>

          <p className="text-sm sm:text-base text-[#616D7E] leading-relaxed mb-5">
            Úryvky z písní, které připomínají, že i po těžké noci přichází ráno, naděje a cesta dál – a že na všechno nemusíš stačit sám.
          </p>

          {/* Global Czech Translation Toggle Button */}
          <button
            type="button"
            onClick={handleToggleAllTranslations}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs ${
              showGlobalCzech
                ? 'bg-[#493563] text-white border-transparent'
                : 'bg-white/90 text-[#43305D] border-[#DACCEE] hover:bg-white'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>
              {showGlobalCzech
                ? 'Zobrazit původní anglický text (EN)'
                : 'Přeložit všechny texty do češtiny (CZ)'}
            </span>
          </button>
        </div>

        {/* Featured Quote Spotlight */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative p-7 sm:p-9 rounded-3xl bg-white/90 border border-[#DACCEE] shadow-sm text-center transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[#E8DFF5] flex items-center justify-center mx-auto mb-4 text-[#543878]">
              <Quote className="w-5 h-5" />
            </div>

            <blockquote className="space-y-2 mb-6">
              {(isFeaturedTranslated ? featured.linesCz : featured.lines).map((line, idx, arr) => (
                <p
                  key={idx}
                  className={`${
                    featured.standalone
                      ? 'text-xl sm:text-2xl font-medium'
                      : 'text-lg sm:text-xl font-normal'
                  } text-[#2E2342] font-display leading-relaxed tracking-tight`}
                >
                  {idx === 0 ? `„${line}` : line}
                  {idx === arr.length - 1 ? '“' : ''}
                </p>
              ))}
            </blockquote>

            {/* Proper Song & Artist Credit Badge + Translation & Next Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-[#DFD5EC]">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6FC] border border-[#E4DCF0] text-xs text-[#43305D]">
                <Disc3 className="w-3.5 h-3.5 text-[#543878]" />
                <span>
                  Píseň: <strong className="font-semibold">„{featured.songTitle}“</strong>
                </span>
                <span className="text-[#9AA5B4]">•</span>
                <span>
                  Interpret: <strong className="font-semibold">{featured.artist}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => toggleSingleCardTranslation(featured.id, e)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  isFeaturedTranslated
                    ? 'bg-[#493563] text-white border-transparent'
                    : 'bg-white border-[#DACCEE] text-[#43305D] hover:bg-[#FAF6FC]'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isFeaturedTranslated ? 'Původní text (EN)' : 'Český překlad (CZ)'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextFeatured}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8DFF5] hover:opacity-90 border border-[#D5C6E8] text-xs font-semibold text-[#43305D] transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Další úryvek</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills by Song */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
          <button
            type="button"
            onClick={() => setSelectedSongFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              selectedSongFilter === 'all'
                ? 'bg-[#493563] text-white border-transparent shadow-2xs'
                : 'bg-white/80 text-[#43305D] border-[#DACCEE] hover:bg-white'
            }`}
          >
            Všechny úryvky ({LYRIC_EXCERPTS.length})
          </button>
          {SONG_CREDITS.map((credit) => (
            <button
              key={credit.songTitle}
              type="button"
              onClick={() => setSelectedSongFilter(credit.songTitle)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                selectedSongFilter === credit.songTitle
                  ? 'bg-[#493563] text-white border-transparent shadow-2xs'
                  : 'bg-white/80 text-[#43305D] border-[#DACCEE] hover:bg-white'
              }`}
            >
              {credit.artist} — {credit.songTitle}
            </button>
          ))}
        </div>

        {/* All Lyric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredLyrics.map((excerpt) => {
            const globalIdx = LYRIC_EXCERPTS.findIndex((e) => e.id === excerpt.id);
            const isSelected = globalIdx === featuredIndex;
            const isTranslated = showGlobalCzech || !!cardTranslated[excerpt.id];
            const activeLines = isTranslated ? excerpt.linesCz : excerpt.lines;

            return (
              <div
                key={excerpt.id}
                onClick={() => setFeaturedIndex(globalIdx)}
                className={`group p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF6FC] border-[#DACCEE] ring-2 ring-[#E8DFF5] shadow-sm'
                    : 'bg-white/85 border-[#E4DCF0] hover:bg-white hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Badge + Per-Card Translation Button */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DFF5] text-[#43305D]">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{excerpt.standalone ? 'Samostatná myšlenka' : 'Sloka písně'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => toggleSingleCardTranslation(excerpt.id, e)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                          isTranslated
                            ? 'bg-[#493563] text-white border-transparent'
                            : 'bg-white border-[#DACCEE] text-[#43305D] hover:bg-[#FAF6FC]'
                        }`}
                        title={isTranslated ? 'Přepnout zpět na anglický originál' : 'Zobrazit český překlad'}
                      >
                        <Languages className="w-3 h-3" />
                        <span>{isTranslated ? 'EN originál' : 'Český překlad'}</span>
                      </button>

                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isSelected ? 'text-[#543878] fill-current' : 'text-[#B8AFC7] group-hover:text-[#543878]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Lyric Lines */}
                  <blockquote className="space-y-1.5 my-2">
                    {activeLines.map((line, i) => (
                      <p
                        key={i}
                        className={`${
                          excerpt.standalone
                            ? 'text-base sm:text-lg font-medium text-[#2E2342]'
                            : 'text-sm sm:text-[15px] font-normal text-[#2D223F]'
                        } leading-relaxed font-display`}
                      >
                        {i === 0 ? `„${line}` : line}
                        {i === activeLines.length - 1 ? '“' : ''}
                      </p>
                    ))}
                  </blockquote>
                </div>

                {/* Proper Credit Footer on Every Card */}
                <div className="mt-4 pt-3 border-t border-[#E4DCF0] flex flex-col gap-0.5 text-[11px] text-[#5B6778]">
                  <div className="flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-[#543878] shrink-0" />
                    <span className="font-semibold text-[#43305D]">
                      „{excerpt.songTitle}“
                    </span>
                  </div>
                  <div className="text-[11px] text-[#43305D] pl-4.5">
                    Interpret: <strong className="font-semibold">{excerpt.artist}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formal Proper Credits Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-[#DACCEE] max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43305D] mb-2">
            <Disc3 className="w-4 h-4 text-[#543878]" />
            <span>Hudební kredity a autorské uvedení (Song Credits)</span>
          </div>
          <p className="text-xs text-[#5A6577] leading-relaxed mb-3.5">
            Všechny uvedené texty písní náleží svým původním autorům a interpretům:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-[#2E2342]">
            {SONG_CREDITS.map((credit) => (
              <div
                key={credit.songTitle}
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF6FC] border border-[#E4DCF0] flex flex-col justify-center"
              >
                <span className="font-semibold text-[#2E2342]">„{credit.songTitle}“</span>
                <span className="text-[11px] text-[#5A6577] mt-0.5">
                  Interpret: <strong className="text-[#43305D] font-semibold">{credit.artist}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
