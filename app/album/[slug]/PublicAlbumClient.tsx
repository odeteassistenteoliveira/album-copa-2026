"use client";

import { useState } from "react";
import Link from "next/link";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import { Album } from "@/lib/types";

interface PublicAlbumClientProps {
  album: Album;
  quantityMap: Record<string, number>;
}

type ActiveTeam = {
  code: string;
  name: string;
  flag: string;
  groupName: string;
  nums?: number[];
} | null;

export default function PublicAlbumClient({ album, quantityMap }: PublicAlbumClientProps) {
  const [activeTeam, setActiveTeam] = useState<ActiveTeam>(null);

  const total = getTotalStickers();
  const collected = Object.values(quantityMap).filter(q => q >= 1).length;

  const teamProgress = (code: string, nums?: number[]) => {
    const numbers = nums ?? Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
    const have = numbers.filter(n => (quantityMap[`${code}_${n}`] ?? 0) >= 1).length;
    return { have, total: numbers.length, pct: numbers.length ? (have / numbers.length) * 100 : 0 };
  };

  // ── VIEW: figurinhas de uma seleção (somente leitura) ─────────────────────
  if (activeTeam) {
    const { code, name, flag, groupName, nums } = activeTeam;
    const prog = teamProgress(code, nums);

    return (
      <div className="min-h-screen bg-dark">
        <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setActiveTeam(null)}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-lg shrink-0"
            >
              ←
            </button>
            <span className="text-2xl shrink-0">{flag}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bebas text-xl text-white leading-tight truncate">{name}</p>
              <p className="text-gray-500 text-xs font-nunito">{groupName} · {prog.have}/{prog.total} figurinhas</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${prog.pct}%` }} />
              </div>
              <span className="text-gray-400 text-xs font-nunito">{Math.round(prog.pct)}%</span>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          <GroupSection
            groupName=""
            teams={[{ code, name, flag }]}
            quantityMap={quantityMap}
            readOnly
            nums={nums}
            hideteamHeader={true}
          />
        </main>
      </div>
    );
  }

  // ── VIEW: seletor de seleções ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400">Copa 2026</span>
          </div>
          <AlbumStats collected={collected} total={total} albumName={album.name} compact />
          <Link
            href="/login"
            className="font-bebas text-sm px-3 py-1.5 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 transition-all whitespace-nowrap"
          >
            Criar meu álbum
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Banner somente leitura */}
        <div className="mb-6 bg-dark-card border border-dark-border rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-yellow-400">👁️</span>
          <p className="text-gray-400 text-sm font-nunito">
            Álbum de <strong className="text-white">{album.name}</strong> — somente leitura.{" "}
            <Link href="/login" className="text-yellow-400 hover:underline">Crie o seu!</Link>
          </p>
        </div>

        <div className="mb-8">
          <AlbumStats collected={collected} total={total} albumName={album.name} />
        </div>

        {/* Grupos */}
        {GROUPS.map((group) => (
          <section key={group.name} className="mb-8">
            <h2 className="font-bebas text-lg text-yellow-400 tracking-wide mb-3 flex items-center gap-2">
              {group.name}
              <span className="h-px flex-1 bg-yellow-400/20 ml-2" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {group.teams.map((team) => {
                const prog = teamProgress(team.code);
                const complete = prog.have === prog.total;
                return (
                  <button
                    key={team.code}
                    onClick={() => setActiveTeam({ ...team, groupName: group.name })}
                    className="flex flex-col items-center gap-2 bg-dark-card border border-dark-border rounded-2xl px-3 py-4 hover:border-yellow-400/40 hover:bg-white/5 active:scale-95 transition-all relative overflow-hidden"
                  >
                    {complete && (
                      <span className="absolute top-2 right-2 text-xs bg-green-500/20 border border-green-500/40 text-green-400 font-nunito font-bold px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                    <span className="text-4xl">{team.flag}</span>
                    <span className="font-bebas text-white text-base tracking-wide text-center leading-tight">{team.name}</span>
                    <div className="w-full">
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-green-400" : prog.pct > 0 ? "bg-yellow-400" : "bg-gray-700"}`}
                          style={{ width: `${prog.pct}%` }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs font-nunito text-center mt-1">{prog.have}/{prog.total}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Especiais */}
        <section className="mb-8">
          <h2 className="font-bebas text-lg text-yellow-400 tracking-wide mb-3 flex items-center gap-2">
            Especiais
            <span className="h-px flex-1 bg-yellow-400/20 ml-2" />
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SPECIAL.map((special) => {
              const prog = teamProgress(special.code, special.nums);
              const complete = prog.have === prog.total;
              return (
                <button
                  key={special.code}
                  onClick={() => setActiveTeam({ code: special.code, name: special.name, flag: special.flag, groupName: "Especiais", nums: special.nums })}
                  className="flex flex-col items-center gap-2 bg-dark-card border border-dark-border rounded-2xl px-4 py-5 hover:border-yellow-400/40 hover:bg-white/5 active:scale-95 transition-all relative overflow-hidden"
                >
                  {complete && (
                    <span className="absolute top-2 right-2 text-xs bg-green-500/20 border border-green-500/40 text-green-400 font-nunito font-bold px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                  <span className="text-4xl">{special.flag}</span>
                  <span className="font-bebas text-white text-base tracking-wide text-center leading-tight">{special.name}</span>
                  <div className="w-full">
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-green-400" : prog.pct > 0 ? "bg-yellow-400" : "bg-gray-700"}`}
                        style={{ width: `${prog.pct}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs font-nunito text-center mt-1">{prog.have}/{prog.total}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
