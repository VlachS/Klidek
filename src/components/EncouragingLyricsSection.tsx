/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Music, Heart, Sparkles, RefreshCw, Disc3, Quote } from 'lucide-react';

interface LyricExcerpt {
  id: string;
  lines: string[];
  songTitle: string;
  artist: string;
  standalone?: boolean;
}

const LYRIC_EXCERPTS: LyricExcerpt[] = [
  {
    id: 'hurting-1',
    lines: [
      'I know life can be a bitch, some call her Monday',
      "And I'm thinkin' of you, dear, I hope you're okay, yeah",
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
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
  },
  {
    id: 'hurting-3',
    lines: ["Please, my dear, don't stop believing in miracles"],
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
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
  },
  {
    id: 'hurting-6',
    lines: ["It's gonna be fine, it's gonna be alright, it's gonna be okay, it's gonna be okay"],
    songTitle: "I Know You're Hurting",
    artist: 'RAYE',
    standalone: true,
  },
  {
    id: 'lifeboat-1',
    lines: ['Say, "I\'m not giving up yet"'],
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
    songTitle: 'Lifeboat',
    artist: 'RAYE',
  },
  {
    id: 'lifeboat-3',
    lines: ["Don't know how I'll do this", "I'm not giving up"],
    songTitle: 'Lifeboat',
    artist: 'RAYE',
  },
];

export const EncouragingLyricsSection: React.FC = () => {
  const [featuredIndex, setFeaturedIndex] = useState<number>(2); // Default to "Please, my dear, don't stop believing in miracles"
  const [selectedSongFilter, setSelectedSongFilter] = useState<'all' | "I Know You're Hurting" | 'Lifeboat'>('all');

  const featured = LYRIC_EXCERPTS[featuredIndex];

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % LYRIC_EXCERPTS.length);
  };

  const filteredLyrics =
    selectedSongFilter === 'all'
      ? LYRIC_EXCERPTS
      : LYRIC_EXCERPTS.filter((item) => item.songTitle === selectedSongFilter);

  return (
    <section className="py-16 bg-white/50 border-t border-[#DFD5EC] transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DFF5] border border-[#D5C6E8] text-xs font-medium text-[#543878] mb-3">
            <Music className="w-3.5 h-3.5" />
            <span>Slova z písní, která drží nad vodou</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#2D223F] font-display mb-3 text-balance">
            Když potřebuješ slyšet, že v tom nejsi sám
          </h2>

          <p className="text-sm sm:text-base text-[#616D7E] leading-relaxed">
            Úryvky z písní od <strong>RAYE</strong>, které připomínají, že i v těžkých chvílích existuje naděje, cesta dál a že na všechno nemusíš stačit sám.
          </p>
        </div>

        {/* Featured Quote Spotlight */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative p-7 sm:p-9 rounded-3xl bg-white/90 border border-[#DACCEE] shadow-sm text-center transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[#E8DFF5] flex items-center justify-center mx-auto mb-4 text-[#543878]">
              <Quote className="w-5 h-5" />
            </div>

            <blockquote className="space-y-2 mb-6">
              {featured.lines.map((line, idx) => (
                <p
                  key={idx}
                  className={`${
                    featured.standalone
                      ? 'text-xl sm:text-2xl font-medium'
                      : 'text-lg sm:text-xl font-normal'
                  } text-[#2E2342] font-display leading-relaxed tracking-tight`}
                >
                  {idx === 0 ? `„${line}` : line}
                  {idx === featured.lines.length - 1 ? '“' : ''}
                </p>
              ))}
            </blockquote>

            {/* Proper Song & Artist Credit Badge in Spotlight */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#DFD5EC]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6FC] border border-[#E4DCF0] text-xs text-[#43305D]">
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
          <button
            type="button"
            onClick={() => setSelectedSongFilter("I Know You're Hurting")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              selectedSongFilter === "I Know You're Hurting"
                ? 'bg-[#493563] text-white border-transparent shadow-2xs'
                : 'bg-white/80 text-[#43305D] border-[#DACCEE] hover:bg-white'
            }`}
          >
            RAYE — I Know You're Hurting
          </button>
          <button
            type="button"
            onClick={() => setSelectedSongFilter('Lifeboat')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              selectedSongFilter === 'Lifeboat'
                ? 'bg-[#493563] text-white border-transparent shadow-2xs'
                : 'bg-white/80 text-[#43305D] border-[#DACCEE] hover:bg-white'
            }`}
          >
            RAYE — Lifeboat
          </button>
        </div>

        {/* All Lyric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredLyrics.map((excerpt) => {
            const globalIdx = LYRIC_EXCERPTS.findIndex((e) => e.id === excerpt.id);
            const isSelected = globalIdx === featuredIndex;

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
                  {/* Top Badge: Standalone thought vs stanza */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DFF5] text-[#43305D]">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{excerpt.standalone ? 'Samostatná myšlenka' : 'Sloka písně'}</span>
                    </span>
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isSelected ? 'text-[#543878] fill-current' : 'text-[#B8AFC7] group-hover:text-[#543878]'
                      }`}
                    />
                  </div>

                  {/* Lyric Lines */}
                  <blockquote className="space-y-1.5 my-2">
                    {excerpt.lines.map((line, i) => (
                      <p
                        key={i}
                        className={`${
                          excerpt.standalone
                            ? 'text-base sm:text-lg font-medium text-[#2E2342]'
                            : 'text-sm sm:text-[15px] font-normal text-[#2D223F]'
                        } leading-relaxed font-display`}
                      >
                        {i === 0 ? `„${line}` : line}
                        {i === excerpt.lines.length - 1 ? '“' : ''}
                      </p>
                    ))}
                  </blockquote>
                </div>

                {/* Proper Credit Footer on Every Card */}
                <div className="mt-4 pt-3 border-t border-[#E4DCF0] flex items-center justify-between text-[11px] text-[#5B6778]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Music className="w-3 h-3 text-[#543878] shrink-0" />
                    <span className="font-semibold text-[#43305D] truncate">
                      {excerpt.songTitle}
                    </span>
                  </div>
                  <span className="font-semibold text-[#43305D] shrink-0 ml-2">
                    — {excerpt.artist}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formal Proper Credits Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-[#DACCEE] max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#43305D] mb-2">
            <Disc3 className="w-4 h-4 text-[#543878]" />
            <span>Hudební kredity a autorské uvedení (Song Credits)</span>
          </div>
          <p className="text-xs text-[#5A6577] leading-relaxed mb-3">
            Všechny výše uvedené texty pocházejí z autorské tvorby britské zpěvačky a skladatelky <strong>RAYE</strong>:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#2E2342]">
            <div className="px-3.5 py-2 rounded-xl bg-[#FAF6FC] border border-[#E4DCF0]">
              <strong>„I Know You're Hurting“</strong> — Interpret & autor: <strong>RAYE</strong>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#FAF6FC] border border-[#E4DCF0]">
              <strong>„Lifeboat“</strong> — Interpret & autor: <strong>RAYE</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
