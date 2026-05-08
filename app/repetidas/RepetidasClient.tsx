"use client";

import { useState, useCallback, useMemo } from "react";
import { GROUPS, SPECIAL, PLAYER_NAMES } from "@/lib/data";

const ALL_TEAMS = [
  ...GROUPS.flatMap(g => g.teams),
  ...SPECIAL.map(s => ({ code: s.code, name: s.name, flag: s.flag })),
];

interface Props {
  albumId: string;
  initialQuantityMap: Record<string, number>;
}

export default function RepetidasClient({ albumId, initialQuantityMap }: Props) {
  const [quantityMap, setQuantityMap] = useState(initialQuantityMap);
  const [saving, setSaving] = useState<string | null>(null);

  // Todas as figurinhas com quantidade >= 2
  const duplicates = useMemo(() => {
    const result: Array<{
      teamCode: string;
      teamName: string;
      teamFlag: string;
      number: number;
      qty: number;
      dupes: number; // qty - 1
      playerName: string;
    }> = [];

    for (const [key, qty] of Object.entries(quantityMap)) {
      if (qty >= 2) {
        const [teamCode, numStr] = key.split("_");
        const number = parseInt(numStr);
        const team = ALL_TEAMS.find(t => t.code === teamCode);
        if (!team) continue;
        const playerName = PLAYER_NAMES[teamCode]?.[number] ?? `#${number}`;
        result.push({
          teamCode,
          teamName: team.name,
          teamFlag: team.flag,
          number,
          qty,
          dupes: qty - 1,
          playerName,
        });
      }
    }

    // Ordenar: por time, depois por número
    return result.sort((a, b) => {
      if (a.teamCode !== b.teamCode) return a.teamCode.localeCompare(b.teamCode);
      return a.number - b.number;
    });
  }, [quantityMap]);

  const totalDupes = duplicates.reduce((acc, d) => acc + d.dupes, 0);

  // Agrupar por time
  const grouped = useMemo(() => {
    const map = new Map<string, typeof duplicates>();
    for (const d of duplicates) {
      if (!map.has(d.teamCode)) map.set(d.teamCode, []);
      map.get(d.teamCode)!.push(d);
    }
    return map;
  }, [duplicates]);

  const handleChange = useCallback(async (teamCode: string, number: number, delta: number) => {
    const key = `${teamCode}_${number}`;
    const current = quantityMap[key] ?? 0;
    const newQty = Math.max(0, current + delta);
    const saveKey = `${key}_${delta}`;

    setQuantityMap(prev => ({ ...prev, [key]: newQty }));
    setSaving(saveKey);

    await fetch("/api/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        album_id: albumId,
        team_code: teamCode,
        number,
        quantity: newQty,
        collected: newQty >= 1,
      }),
    });

    setSaving(null);
  }, [quantityMap, albumId]);

  return (
    <div className="min-h-screen bg-dark pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-lg"
          >
            ←
          </a>
          <span className="text-xl">🔁</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Figurinhas Repetidas</h1>
          {totalDupes > 0 && (
            <span className="ml-auto bg-blue-600 text-white text-xs font-bold font-nunito px-2.5 py-1 rounded-full">
              {totalDupes} repetida{totalDupes > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Empty state */}
        {duplicates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🏆</span>
            <h2 className="font-bebas text-2xl text-white mb-2">Nenhuma repetida ainda!</h2>
            <p className="text-gray-400 text-sm font-nunito max-w-xs">
              Quando você tiver figurinhas em duplicata, elas aparecerão aqui para facilitar as trocas.
            </p>
            <a
              href="/dashboard"
              className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bebas text-base px-6 py-2.5 rounded-xl transition-colors"
            >
              Ir para o álbum
            </a>
          </div>
        )}

        {/* Summary + trades CTA */}
        {totalDupes > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-center">
                <p className="font-bebas text-3xl text-yellow-400">{duplicates.length}</p>
                <p className="text-gray-400 text-xs font-nunito">figurinha{duplicates.length > 1 ? "s" : ""} diferente{duplicates.length > 1 ? "s" : ""}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-center">
                <p className="font-bebas text-3xl text-blue-400">{totalDupes}</p>
                <p className="text-gray-400 text-xs font-nunito">cópia{totalDupes > 1 ? "s" : ""} extra</p>
              </div>
            </div>

            <a
              href="/trocas"
              className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              style={{ background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)" }}
            >
              <span className="text-2xl">🔄</span>
              <div className="flex-1">
                <p className="text-white font-bebas text-lg leading-tight">Encontrar trocas</p>
                <p className="text-orange-100 text-xs font-nunito">Conecte com colecionadores que precisam das suas</p>
              </div>
              <span className="text-white text-lg">→</span>
            </a>
          </>
        )}

        {/* Lista agrupada por time */}
        {Array.from(grouped.entries()).map(([teamCode, stickers]) => {
          const team = ALL_TEAMS.find(t => t.code === teamCode)!;
          const teamDupes = stickers.reduce((acc, s) => acc + s.dupes, 0);

          return (
            <div key={teamCode} className="mb-6">
              {/* Team header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{team.flag}</span>
                <span className="font-bebas text-white text-lg tracking-wide">{team.name}</span>
                <span className="ml-auto text-xs font-nunito text-blue-400 bg-blue-900/30 border border-blue-800/40 px-2 py-0.5 rounded-full">
                  {teamDupes} extra{teamDupes > 1 ? "s" : ""}
                </span>
              </div>

              {/* Sticker cards */}
              <div className="space-y-2">
                {stickers.map(s => {
                  const key = `${s.teamCode}_${s.number}`;
                  const isSaving = saving?.startsWith(key);

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-xl px-4 py-3"
                    >
                      {/* Badge número */}
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-600/40 flex flex-col items-center justify-center shrink-0">
                        <span className="font-bebas text-blue-300 text-xs leading-none">{s.teamCode}</span>
                        <span className="font-bebas text-white text-base leading-none">{s.number}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-nunito font-semibold truncate">{s.playerName}</p>
                        <p className="text-gray-500 text-xs font-nunito">
                          {s.qty} cópias · <span className="text-blue-400">{s.dupes} para trocar</span>
                        </p>
                      </div>

                      {/* Controles +/- */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleChange(s.teamCode, s.number, -1)}
                          disabled={isSaving}
                          className="w-8 h-8 rounded-lg bg-red-900/30 border border-red-800/40 text-red-400 hover:bg-red-800/50 active:scale-90 transition-all text-lg font-bold flex items-center justify-center disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className={`w-7 text-center font-bebas text-lg transition-all ${isSaving ? "text-gray-500" : "text-white"}`}>
                          {quantityMap[key] ?? s.qty}
                        </span>
                        <button
                          onClick={() => handleChange(s.teamCode, s.number, +1)}
                          disabled={isSaving}
                          className="w-8 h-8 rounded-lg bg-green-900/30 border border-green-800/40 text-green-400 hover:bg-green-800/50 active:scale-90 transition-all text-lg font-bold flex items-center justify-center disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
