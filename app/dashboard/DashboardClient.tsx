"use client";

import { useState, useCallback } from "react";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import ShareButton from "@/components/ShareButton";
import InstallPWA from "@/components/InstallPWA";
import { Album } from "@/lib/types";

interface DashboardClientProps {
  album: Album;
  initialQuantityMap: Record<string, number>;
  userId: string;
}

type ActiveTeam = {
  code: string;
  name: string;
  flag: string;
  groupName: string;
  nums?: number[];
} | null;

export default function DashboardClient({ album, initialQuantityMap }: DashboardClientProps) {
  const [quantityMap, setQuantityMap] = useState(initialQuantityMap);
  const [activeTeam, setActiveTeam] = useState<ActiveTeam>(null);

  const total = getTotalStickers();
  const collected = Object.values(quantityMap).filter(q => q >= 1).length;
  const totalDupes = Object.values(quantityMap).filter(q => q >= 2).reduce((acc, q) => acc + (q - 1), 0);

  const handleToggle = useCallback(async (teamCode: string, number: number) => {
    const key = `${teamCode}_${number}`;
    const current = quantityMap[key] ?? 0;
    const newQty = current >= 1 ? 0 : 1;
    setQuantityMap(prev => ({ ...prev, [key]: newQty }));
    const res = await fetch("/api/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_id: album.id, team_code: teamCode, number, collected: newQty >= 1, quantity: newQty }),
    });
    if (!res.ok) setQuantityMap(prev => ({ ...prev, [key]: current }));
  }, [quantityMap, album.id]);

  const handleQuantityChange = useCallback(async (teamCode: string, number: number, delta: number) => {
    const key = `${teamCode}_${number}`;
    const current = quantityMap[key] ?? 0;
    const newQty = Math.max(0, current + delta);
    setQuantityMap(prev => ({ ...prev, [key]: newQty }));
    const res = await fetch("/api/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_id: album.id, team_code: teamCode, number, quantity: newQty }),
    });
    if (!res.ok) setQuantityMap(prev => ({ ...prev, [key]: current }));
  }, [quantityMap, album.id]);

  // ── helpers de progresso ──────────────────────────────────────────────────
  const teamProgress = (code: string, nums?: number[]) => {
    const numbers = nums ?? Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
    const have = numbers.filter(n => (quantityMap[`${code}_${n}`] ?? 0) >= 1).length;
    const dupes = numbers.filter(n => (quantityMap[`${code}_${n}`] ?? 0) >= 2).length;
    return { have, total: numbers.length, pct: numbers.length ? (have / numbers.length) * 100 : 0, dupes };
  };

  // ── VIEW: figurinhas de uma seleção ───────────────────────────────────────
  if (activeTeam) {
    const { code, name, flag, groupName, nums } = activeTeam;
    const prog = teamProgress(code, nums);

    return (
      <div className="min-h-screen bg-dark">
        {/* Header da seleção */}
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
            {/* mini barra de progresso */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${prog.pct}%` }} />
              </div>
              <span className="text-gray-400 text-xs font-nunito">{Math.round(prog.pct)}%</span>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Instrução */}
          <div className="mb-5 bg-dark-card border border-dark-border rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-base shrink-0">💡</span>
            <p className="text-gray-400 text-xs font-nunito leading-relaxed">
              <span className="text-yellow-400 font-bold">Duplo toque</span> para marcar.{" "}
              <span className="text-gray-300 font-bold">Segure</span> para ver o jogador ou desmarcar.
            </p>
          </div>

          <GroupSection
            groupName=""
            teams={[{ code, name, flag }]}
            quantityMap={quantityMap}
            onToggle={handleToggle}
            onQuantityChange={handleQuantityChange}
            readOnly={false}
            nums={nums}
            hideteamHeader={true}
          />
        </main>
      </div>
    );
  }

  // ── VIEW: seletor de seleções (tela principal) ────────────────────────────
  return (
    <div className="min-h-screen bg-dark">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400 hidden sm:block">Copa 2026</span>
          </div>

          <AlbumStats collected={collected} total={total} albumName={album.name} compact />

          <div className="flex items-center gap-1.5 shrink-0">
            {totalDupes > 0 && (
              <>
                <a href="/repetidas"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bebas text-sm px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  <span>🔁</span>
                  <span className="hidden sm:inline">Repetidas</span>
                  <span className="bg-white/25 rounded-full px-1.5 text-xs font-bold">{totalDupes}</span>
                </a>
                <a href="/trocas"
                  className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white font-bebas text-sm px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  <span>🔄</span>
                  <span className="hidden sm:inline">Trocas</span>
                </a>
              </>
            )}
            <InstallPWA />
            <ShareButton slug={album.slug} compact />
            <a href="/perfil" className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-white text-sm transition-colors rounded-lg hover:bg-white/5" title="Perfil">👤</a>
            <a href="/api/auth/signout" className="text-gray-500 hover:text-white text-xs font-nunito transition-colors px-1 hidden sm:block">Sair</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats gerais */}
        <div className="mb-6">
          <AlbumStats collected={collected} total={total} albumName={album.name} />
        </div>

        {/* Banner repetidas */}
        {totalDupes > 0 && (
          <a href="/repetidas"
            className="block mb-8 rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)" }}
          >
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔄</span>
                <div>
                  <p className="text-white font-bebas text-xl leading-tight">
                    {totalDupes} figurinha{totalDupes > 1 ? "s" : ""} repetida{totalDupes > 1 ? "s" : ""} para trocar!
                  </p>
                  <p className="text-orange-100 text-sm font-nunito">Ver lista e encontrar colecionadores para trocar</p>
                </div>
              </div>
              <div className="shrink-0 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 text-white font-bebas text-base whitespace-nowrap">
                Ver lista →
              </div>
            </div>
          </a>
        )}

        {/* Grupos de seleções */}
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
                    className="flex flex-col items-center gap-2 bg-dark-card border border-dark-border rounded-2xl px-3 py-4 hover:border-yellow-400/40 hover:bg-white/5 active:scale-95 transition-all text-left relative overflow-hidden"
                  >
                    {/* Badge completo */}
                    {complete && (
                      <span className="absolute top-2 right-2 text-xs bg-green-500/20 border border-green-500/40 text-green-400 font-nunito font-bold px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                    {/* Badge repetidas */}
                    {prog.dupes > 0 && !complete && (
                      <span className="absolute top-2 right-2 text-xs bg-blue-500/20 border border-blue-500/40 text-blue-400 font-nunito font-bold px-1.5 py-0.5 rounded-full">+{prog.dupes}</span>
                    )}

                    <span className="text-4xl">{team.flag}</span>
                    <span className="font-bebas text-white text-base tracking-wide text-center leading-tight">{team.name}</span>

                    {/* Barra de progresso */}
                    <div className="w-full">
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-green-400" : prog.pct > 0 ? "bg-yellow-400" : "bg-gray-700"}`}
                          style={{ width: `${prog.pct}%` }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs font-nunito text-center mt-1">
                        {prog.have}/{prog.total}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Seções especiais */}
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
                  onClick={() => setActiveTeam({
                    code: special.code,
                    name: special.name,
                    flag: special.flag,
                    groupName: "Especiais",
                    nums: special.nums,
                  })}
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
