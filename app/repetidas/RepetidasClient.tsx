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

  const handlePrint = () => window.print();

  // Todas as figurinhas com quantidade >= 2
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

  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-dark pb-16">
      {/* Header — oculto na impressão */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3 print:hidden">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30"
          >
            ← Voltar
          </a>
          <span className="text-xl">🔁</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Repetidas</h1>
          {totalDupes > 0 && (
            <>
              <span className="bg-blue-600 text-white text-xs font-bold font-nunito px-2.5 py-1 rounded-full">
                {totalDupes} extra{totalDupes > 1 ? "s" : ""}
              </span>
              <button
                onClick={handlePrint}
                className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bebas text-base px-4 py-2 rounded-xl transition-colors active:scale-95 shadow-lg shadow-green-900/30"
              >
                🖨️ Exportar PDF
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── CONTEÚDO PARA IMPRESSÃO ── */}
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Cabeçalho do documento (visível só na impressão) */}
        <div className="hidden print:block mb-6 border-b-2 border-gray-300 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">🏆 Copa do Mundo 2026 — Figurinhas Repetidas</h1>
              <p className="text-gray-600 text-sm mt-1">Gerado em {today} · album-copa-2026.vercel.app</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-black">{totalDupes}</p>
              <p className="text-gray-500 text-sm">cópias extras</p>
              <p className="text-gray-500 text-sm">{duplicates.length} figurinha{duplicates.length !== 1 ? "s" : ""} diferente{duplicates.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Summary — visível na tela */}
        {totalDupes > 0 && (
          <div className="print:hidden grid grid-cols-2 gap-3 mb-6">
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

        {/* CTA trocas — só na tela */}
        {totalDupes > 0 && (
          <a
            href="/trocas"
            className="print:hidden flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 hover:scale-[1.01] active:scale-[0.99] transition-transform"
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
            <a
              href="/dashboard"
              className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bebas text-base px-6 py-2.5 rounded-xl transition-colors"
            >
              Ir para o álbum
            </a>
          </div>
        )}

        {/* Lista agrupada por time — tela: cards interativos / impressão: tabela compacta */}
        {Array.from(grouped.entries()).map(([teamCode, stickers]) => {
          const team = ALL_TEAMS.find(t => t.code === teamCode)!;
          const teamDupes = stickers.reduce((acc, s) => acc + s.dupes, 0);

          return (
            <div key={teamCode} className="mb-6 print:mb-4 print:break-inside-avoid">
              {/* Team header */}
              <div className="flex items-center gap-2 mb-3 print:mb-2">
                <span className="text-lg print:text-base">{team.flag}</span>
                <span className="font-bebas text-white text-lg tracking-wide print:text-black print:font-bold print:text-base">{team.name}</span>
                <span className="ml-auto text-xs font-nunito text-blue-400 bg-blue-900/30 border border-blue-800/40 px-2 py-0.5 rounded-full print:text-gray-600 print:bg-gray-100 print:border-gray-300">
                  {teamDupes} extra{teamDupes > 1 ? "s" : ""}
                </span>
              </div>

              {/* TELA: cards interativos */}
              <div className="space-y-2 print:hidden">
                {stickers.map(s => {
                  const key = `${s.teamCode}_${s.number}`;
                  const isSaving = saving?.startsWith(key);

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-xl px-4 py-3"
                    >
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

              {/* IMPRESSÃO: tabela compacta */}
              <table className="hidden print:table w-full text-sm border-collapse">
                <tbody>
                  {stickers.map(s => (
                    <tr key={`${s.teamCode}_${s.number}`} className="border-b border-gray-200">
                      <td className="py-1 pr-3 font-mono text-gray-700 w-16">
                        <span className="bg-gray-100 border border-gray-300 rounded px-1 font-bold">{s.teamCode}-{s.number}</span>
                      </td>
                      <td className="py-1 pr-3 text-gray-800 flex-1">{s.playerName}</td>
                      <td className="py-1 text-right text-gray-600 w-32">
                        {s.qty}x · <span className="font-bold text-blue-700">{s.dupes} p/ trocar</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Rodapé da impressão */}
        {totalDupes > 0 && (
          <p className="hidden print:block text-center text-gray-400 text-xs mt-8 border-t border-gray-200 pt-4">
            🏆 Álbum Copa do Mundo 2026 · album-copa-2026.vercel.app
          </p>
        )}
      </main>

      {/* CSS de impressão */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt;
          }
          header { display: none !important; }
          .print\\:hidden { display: none !important; }
          .hidden.print\\:block { display: block !important; }
          .hidden.print\\:table { display: table !important; }
          @page {
            margin: 1.5cm 2cm;
            size: A4 portrait;
          }
        }
      `}</style>
    </div>
  );
}
