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

const WhatsAppIcon = ({ size = 5 }: { size?: number }) => (
  <svg className={`w-${size} h-${size}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function RepetidasClient({ albumId, initialQuantityMap }: Props) {
  const [quantityMap, setQuantityMap] = useState(initialQuantityMap);
  const [saving, setSaving] = useState<string | null>(null);

  const duplicates = useMemo(() => {
    const result: Array<{
      teamCode: string;
      teamName: string;
      teamFlag: string;
      number: number;
      qty: number;
      dupes: number;
      playerName: string;
    }> = [];

    for (const [key, qty] of Object.entries(quantityMap)) {
      if (qty >= 2) {
        const [teamCode, numStr] = key.split("_");
        const number = parseInt(numStr);
        const team = ALL_TEAMS.find(t => t.code === teamCode);
        if (!team) continue;
        const playerName = PLAYER_NAMES[teamCode]?.[number] ?? `#${number}`;
        result.push({ teamCode, teamName: team.name, teamFlag: team.flag, number, qty, dupes: qty - 1, playerName });
      }
    }

    return result.sort((a, b) => {
      if (a.teamCode !== b.teamCode) return a.teamCode.localeCompare(b.teamCode);
      return a.number - b.number;
    });
  }, [quantityMap]);

  const totalDupes = duplicates.reduce((acc, d) => acc + d.dupes, 0);

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
      body: JSON.stringify({ album_id: albumId, team_code: teamCode, number, quantity: newQty, collected: newQty >= 1 }),
    });

    setSaving(null);
  }, [quantityMap, albumId]);

  const handleWhatsApp = () => {
    if (totalDupes === 0) return;

    let msg = `🔁 *Copa do Mundo 2026 — Figurinhas REPETIDAS*\n`;
    msg += `📊 ${totalDupes} cópia${totalDupes > 1 ? "s" : ""} extra para trocar\n\n`;

    for (const [teamCode, stickers] of Array.from(grouped.entries())) {
      const team = ALL_TEAMS.find(t => t.code === teamCode)!;
      const teamTotal = stickers.reduce((acc, s) => acc + s.dupes, 0);
      const items = stickers.map(s => s.dupes > 1 ? `${s.number}(${s.dupes}x)` : `${s.number}`).join(", ");
      msg += `${team.flag} *${team.name}*: ${items} — ${teamTotal} extra${teamTotal > 1 ? "s" : ""}\n`;
    }

    msg += `\n_album-copa-2026.vercel.app_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-dark pb-16">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30">
            Voltar
          </a>
          <span className="text-xl">🔁</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Repetidas</h1>
          {totalDupes > 0 && (
            <>
              <span className="bg-blue-600 text-white text-xs font-bold font-nunito px-2.5 py-1 rounded-full">
                {totalDupes} extra{totalDupes > 1 ? "s" : ""}
              </span>
              <button
                onClick={handleWhatsApp}
                className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bebas text-base px-4 py-2 rounded-xl transition-all shadow-lg shadow-green-900/30"
              >
                <WhatsAppIcon size={5} />
                Compartilhar
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Resumo em cards */}
        {totalDupes > 0 && (
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
        )}

        {/* CTA trocas */}
        {totalDupes > 0 && (
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
        )}

        {/* Empty state */}
        {duplicates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🏆</span>
            <h2 className="font-bebas text-2xl text-white mb-2">Nenhuma repetida ainda!</h2>
            <p className="text-gray-400 text-sm font-nunito max-w-xs">
              Quando você tiver figurinhas em duplicata, elas aparecerão aqui para facilitar as trocas.
            </p>
            <a href="/dashboard" className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bebas text-base px-6 py-2.5 rounded-xl transition-colors">
              Ir para o álbum
            </a>
          </div>
        )}

        {/* Lista por time */}
        {Array.from(grouped.entries()).map(([teamCode, stickers]) => {
          const team = ALL_TEAMS.find(t => t.code === teamCode)!;
          const teamDupes = stickers.reduce((acc, s) => acc + s.dupes, 0);

          return (
            <div key={teamCode} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{team.flag}</span>
                <span className="font-bebas text-white text-lg tracking-wide">{team.name}</span>
                <span className="ml-auto text-xs font-nunito text-blue-400 bg-blue-900/30 border border-blue-800/40 px-2 py-0.5 rounded-full">
                  {teamDupes} extra{teamDupes > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-2">
                {stickers.map(s => {
                  const key = `${s.teamCode}_${s.number}`;
                  const isSaving = saving?.startsWith(key);

                  return (
                    <div key={key} className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-xl px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-600/40 flex flex-col items-center justify-center shrink-0">
                        <span className="font-bebas text-blue-300 text-xs leading-none">{s.teamCode}</span>
                        <span className="font-bebas text-white text-base leading-none">{s.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-nunito font-semibold truncate">{s.playerName}</p>
                        <p className="text-gray-500 text-xs font-nunito">
                          {s.qty} cópias · <span className="text-blue-400">{s.dupes} para trocar</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleChange(s.teamCode, s.number, -1)}
                          disabled={!!isSaving}
                          className="w-8 h-8 rounded-lg bg-red-900/30 border border-red-800/40 text-red-400 hover:bg-red-800/50 active:scale-90 transition-all text-lg font-bold flex items-center justify-center disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className={`w-7 text-center font-bebas text-lg transition-all ${isSaving ? "text-gray-500" : "text-white"}`}>
                          {quantityMap[key] ?? s.qty}
                        </span>
                        <button
                          onClick={() => handleChange(s.teamCode, s.number, +1)}
                          disabled={!!isSaving}
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

        {/* Botão WhatsApp grande no final */}
        {totalDupes > 0 && (
          <button
            onClick={handleWhatsApp}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bebas text-xl py-4 rounded-2xl transition-all shadow-lg shadow-green-900/40"
          >
            <WhatsAppIcon size={6} />
            Enviar Repetidas por WhatsApp
          </button>
        )}
      </main>
    </div>
  );
}
