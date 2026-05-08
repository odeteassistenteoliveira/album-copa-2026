"use client";

import { useState, useCallback } from "react";
import { GROUPS, SPECIAL, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import ShareButton from "@/components/ShareButton";
import { Album } from "@/lib/types";

interface DashboardClientProps {
  album: Album;
  initialQuantityMap: Record<string, number>;
  userId: string;
}

export default function DashboardClient({ album, initialQuantityMap }: DashboardClientProps) {
  const [quantityMap, setQuantityMap] = useState(initialQuantityMap);
  const [imageCache] = useState<Record<string, string | null>>({});

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

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400 hidden sm:block">Copa 2026</span>
          </div>

          <AlbumStats collected={collected} total={total} albumName={album.name} compact />

          <div className="flex items-center gap-2">
            {totalDupes > 0 && (
              <a
                href="/trocas"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bebas text-sm px-3 py-1.5 rounded-lg transition-colors"
                title="Encontrar trocas"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Trocas</span>
                <span className="bg-white/20 rounded-full px-1.5 text-xs">{totalDupes}</span>
              </a>
            )}
            <a
              href="/trocas"
              className="text-gray-400 hover:text-white text-sm font-nunito transition-colors hidden sm:block"
            >
              Trocas
            </a>
            <ShareButton slug={album.slug} />
            <a href="/perfil" className="text-gray-500 hover:text-white text-sm font-nunito transition-colors" title="Perfil">
              👤
            </a>
            <a href="/api/auth/signout" className="text-gray-500 hover:text-white text-sm font-nunito transition-colors">
              Sair
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <AlbumStats collected={collected} total={total} albumName={album.name} />
        </div>

        {/* Banner de repetidas */}
        {totalDupes > 0 && (
          <a href="/trocas" className="block mb-8 bg-blue-900/30 border border-blue-600/40 rounded-xl p-4 hover:border-blue-500/60 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 font-bebas text-lg">🔄 Você tem {totalDupes} figurinha{totalDupes > 1 ? "s" : ""} repetida{totalDupes > 1 ? "s" : ""}</p>
                <p className="text-gray-400 text-sm font-nunito">Encontre colecionadores para trocar →</p>
              </div>
              <span className="text-blue-400 text-2xl">→</span>
            </div>
          </a>
        )}

        {/* Dica de repetidas */}
        {totalDupes === 0 && collected > 0 && (
          <div className="mb-6 bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-gray-400 text-sm font-nunito">
              💡 <span className="text-gray-300">Tem figurinhas repetidas?</span> Use o botão <span className="text-blue-400 font-bold">+</span> abaixo de cada figurinha coletada para marcá-las e encontrar pessoas para trocar.
            </p>
          </div>
        )}

        {GROUPS.map((group) => (
          <GroupSection
            key={group.name}
            groupName={group.name}
            teams={group.teams}
            quantityMap={quantityMap}
            imageCache={imageCache}
            onToggle={handleToggle}
            onQuantityChange={handleQuantityChange}
            readOnly={false}
          />
        ))}

        {SPECIAL.map((special) => (
          <GroupSection
            key={special.code}
            groupName={`${special.flag} ${special.name}`}
            teams={[{ code: special.code, name: special.name, flag: special.flag }]}
            quantityMap={quantityMap}
            imageCache={imageCache}
            onToggle={handleToggle}
            onQuantityChange={handleQuantityChange}
            readOnly={false}
            nums={special.nums}
          />
        ))}
      </main>
    </div>
  );
}
