"use client";

import { useState, useRef } from "react";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, PLAYER_NAMES } from "@/lib/data";

const ALL_TEAMS = [
  ...GROUPS.flatMap(g => g.teams.map(t => ({ ...t, groupName: g.name, nums: undefined as number[] | undefined }))),
  ...SPECIAL.map(s => ({ code: s.code, name: s.name, flag: s.flag, groupName: "Especiais", nums: s.nums })),
];

export interface SearchResult {
  type: "team";
  teamCode: string;
  teamName: string;
  teamFlag: string;
  groupName: string;
  nums?: number[];
  highlightNum?: number;
}

interface SearchBarProps {
  onSelect: (result: SearchResult) => void;
  quantityMap: Record<string, number>;
}

function parseQuery(q: string): { code: string; num: number | null } {
  const clean = q.trim().toUpperCase().replace(/\s+/g, "");
  const match = clean.match(/^([A-Z]+)(\d+)?$/);
  if (!match) return { code: clean, num: null };
  return { code: match[1], num: match[2] ? parseInt(match[2]) : null };
}

export default function SearchBar({ onSelect, quantityMap }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: SearchResult[] = (() => {
    const q = query.trim();
    if (q.length < 1) return [];

    const { code, num } = parseQuery(q);
    const nameQ = q.toLowerCase();

    const matched: SearchResult[] = [];

    for (const team of ALL_TEAMS) {
      const codeMatch = team.code.startsWith(code);
      const nameMatch = team.name.toLowerCase().includes(nameQ);

      if (!codeMatch && !nameMatch) continue;

      if (num !== null && codeMatch) {
        // Busca específica de figurinha
        const nums = team.nums ?? Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
        if (nums.includes(num)) {
          matched.push({ type: "team", teamCode: team.code, teamName: team.name, teamFlag: team.flag, groupName: team.groupName, nums: team.nums, highlightNum: num });
          continue;
        }
      }

      matched.push({ type: "team", teamCode: team.code, teamName: team.name, teamFlag: team.flag, groupName: team.groupName, nums: team.nums });
    }

    // Busca por nome de jogador
    if (num === null) {
      for (const team of ALL_TEAMS) {
        const playerNums = PLAYER_NAMES[team.code];
        if (!playerNums) continue;
        for (const [numStr, playerName] of Object.entries(playerNums)) {
          if (playerName.toLowerCase().includes(nameQ)) {
            const n = parseInt(numStr);
            // evita duplicata
            if (!matched.find(r => r.teamCode === team.code && r.highlightNum === n)) {
              matched.push({ type: "team", teamCode: team.code, teamName: team.name, teamFlag: team.flag, groupName: team.groupName, nums: team.nums, highlightNum: n });
            }
          }
        }
      }
    }

    return matched.slice(0, 8);
  })();

  const handleSelect = (r: SearchResult) => {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    onSelect(r);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-gray-900 border-2 border-gray-600 rounded-xl px-3 py-2.5 focus-within:border-yellow-400 transition-colors shadow-inner">
        <span className="text-gray-400 text-base">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="BRA, BRA5, Vinicius…"
          className="flex-1 bg-transparent text-white text-sm font-nunito outline-none placeholder-gray-500"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-500 hover:text-white text-xs transition-colors">✕</button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl z-50">
          {results.map((r, i) => {
            const key = r.highlightNum ? `${r.teamCode}_${r.highlightNum}` : null;
            const collected = key ? (quantityMap[key] ?? 0) >= 1 : false;
            const playerName = r.highlightNum ? (PLAYER_NAMES[r.teamCode]?.[r.highlightNum] ?? `#${r.highlightNum}`) : null;
            return (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-dark-border last:border-0"
              >
                <span className="text-2xl shrink-0">{r.teamFlag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-nunito font-semibold truncate">{r.teamName}</p>
                  <p className="text-gray-500 text-xs font-nunito">{r.groupName}{playerName ? ` · #${r.highlightNum} ${playerName}` : ""}</p>
                </div>
                {r.highlightNum && (
                  <span className={`shrink-0 font-bebas text-sm px-2 py-0.5 rounded-lg ${collected ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/40" : "bg-gray-800 text-gray-400 border border-gray-700"}`}>
                    #{r.highlightNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {focused && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-card border border-dark-border rounded-xl px-4 py-3 shadow-xl z-50">
          <p className="text-gray-500 text-sm font-nunito">Nenhum resultado para &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
