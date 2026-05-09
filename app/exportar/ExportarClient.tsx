"use client";

import { useRef } from "react";
import Link from "next/link";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, PLAYER_NAMES } from "@/lib/data";

interface Props {
  albumName: string;
  quantityMap: Record<string, number>;
}

export default function ExportarClient({ albumName, quantityMap }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  // Figurinhas faltantes por time
  const missingByTeam: Array<{ flag: string; name: string; code: string; groupName: string; missing: number[] }> = [];

  for (const group of GROUPS) {
    for (const team of group.teams) {
      const nums = Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
      const missing = nums.filter(n => (quantityMap[`${team.code}_${n}`] ?? 0) === 0);
      if (missing.length > 0) {
        missingByTeam.push({ ...team, groupName: group.name, missing });
      }
    }
  }
  for (const special of SPECIAL) {
    const missing = special.nums.filter(n => (quantityMap[`${special.code}_${n}`] ?? 0) === 0);
    if (missing.length > 0) {
      missingByTeam.push({ flag: special.flag, name: special.name, code: special.code, groupName: "Especiais", missing });
    }
  }

  const totalMissing = missingByTeam.reduce((acc, t) => acc + t.missing.length, 0);
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-dark pb-16">
      {/* Header — oculto na impressão */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30">
            ← Voltar
          </Link>
          <span className="text-xl">📄</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Figurinhas Faltantes</h1>
          <button
            onClick={handlePrint}
            className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bebas text-base px-4 py-2 rounded-xl transition-colors active:scale-95"
          >
            🖨️ Imprimir / PDF
          </button>
        </div>
      </header>

      {/* Conteúdo para impressão */}
      <main ref={printRef} className="max-w-3xl mx-auto px-4 py-6">
        {/* Cabeçalho do documento */}
        <div className="mb-6 print:mb-4">
          <div className="flex items-center justify-between print:flex">
            <div>
              <h1 className="font-bebas text-3xl text-yellow-400 print:text-black">🏆 Copa do Mundo 2026</h1>
              <p className="text-gray-400 font-nunito text-sm print:text-gray-600">{albumName} · Gerado em {today}</p>
            </div>
            <div className="text-right">
              <p className="font-bebas text-2xl text-white print:text-black">{totalMissing}</p>
              <p className="text-gray-400 text-xs font-nunito print:text-gray-600">figurinhas faltando</p>
            </div>
          </div>
        </div>

        {totalMissing === 0 ? (
          <div className="text-center py-20 print:py-8">
            <span className="text-6xl block mb-4">🎉</span>
            <p className="font-bebas text-2xl text-green-400 print:text-green-700">Álbum completo!</p>
            <p className="text-gray-400 font-nunito">Você tem todas as {Object.values(quantityMap).filter(q => q >= 1).length} figurinhas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {missingByTeam.map(team => (
              <div key={team.code} className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 print:border-gray-300 print:bg-white print:rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{team.flag}</span>
                  <span className="font-bebas text-white text-base print:text-black">{team.name}</span>
                  <span className="ml-auto text-xs font-nunito text-gray-500 print:text-gray-500">{team.missing.length} falt.</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {team.missing.map(n => (
                    <span
                      key={n}
                      title={PLAYER_NAMES[team.code]?.[n]}
                      className="bg-gray-800 border border-gray-700 text-gray-300 font-bebas text-xs px-1.5 py-0.5 rounded print:bg-gray-100 print:border-gray-300 print:text-gray-700"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-gray-600 text-xs font-nunito mt-8 print:mt-4">
          album-copa-2026.vercel.app
        </p>
      </main>

      {/* CSS de impressão */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
