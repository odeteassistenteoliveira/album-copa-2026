"use client";

import { useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { GROUPS, SPECIAL, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import ShareButton from "@/components/ShareButton";
import { Album } from "@/lib/types";

interface DashboardClientProps {
  album: Album;
  initialCollected: Record<string, boolean>;
  userId: string;
}

export default function DashboardClient({
  album,
  initialCollected,
}: DashboardClientProps) {
  const [collectedMap, setCollectedMap] = useState(initialCollected);
  const [imageCache] = useState<Record<string, string | null>>({});
  const supabase = createBrowserClient();

  const total = getTotalStickers();
  const collected = Object.values(collectedMap).filter(Boolean).length;

  const handleToggle = useCallback(
    async (teamCode: string, number: number) => {
      const key = `${teamCode}_${number}`;
      const currentlyCollected = !!collectedMap[key];
      const newCollected = !currentlyCollected;

      // Otimistic update
      setCollectedMap((prev) => ({
        ...prev,
        [key]: newCollected,
      }));

      try {
        const res = await fetch("/api/sticker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            album_id: album.id,
            team_code: teamCode,
            number,
            collected: newCollected,
          }),
        });

        if (!res.ok) {
          // Reverter
          setCollectedMap((prev) => ({
            ...prev,
            [key]: currentlyCollected,
          }));
          console.error("Erro ao atualizar figurinha");
        }
      } catch {
        // Reverter
        setCollectedMap((prev) => ({
          ...prev,
          [key]: currentlyCollected,
        }));
      }
    },
    [collectedMap, album.id, supabase]
  );

  return (
    <div className="min-h-screen bg-dark">
      {/* Header fixo */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400 hidden sm:block">
              Copa 2026
            </span>
          </div>

          <AlbumStats
            collected={collected}
            total={total}
            albumName={album.name}
            compact
          />

          <div className="flex items-center gap-2">
            <ShareButton slug={album.slug} />
            <a
              href="/api/auth/signout"
              className="text-gray-500 hover:text-white text-sm font-nunito transition-colors"
            >
              Sair
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats completo */}
        <div className="mb-8">
          <AlbumStats
            collected={collected}
            total={total}
            albumName={album.name}
          />
        </div>

        {/* Grupos */}
        {GROUPS.map((group) => (
          <GroupSection
            key={group.name}
            groupName={group.name}
            teams={group.teams}
            collectedMap={collectedMap}
            imageCache={imageCache}
            onToggle={handleToggle}
            readOnly={false}
          />
        ))}

        {/* Especiais */}
        {SPECIAL.map((special) => (
          <GroupSection
            key={special.code}
            groupName={`${special.flag} ${special.name}`}
            teams={[{ code: special.code, name: special.name, flag: special.flag }]}
            collectedMap={collectedMap}
            imageCache={imageCache}
            onToggle={handleToggle}
            readOnly={false}
            nums={special.nums}
          />
        ))}
      </main>
    </div>
  );
}
