"use client";

import Link from "next/link";
import { GROUPS, SPECIAL, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import { Album } from "@/lib/types";

interface PublicAlbumClientProps {
  album: Album;
  collectedMap: Record<string, boolean>;
}

export default function PublicAlbumClient({
  album,
  collectedMap,
}: PublicAlbumClientProps) {
  const total = getTotalStickers();
  const collected = Object.values(collectedMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400">
              Copa 2026
            </span>
          </div>

          <AlbumStats
            collected={collected}
            total={total}
            albumName={album.name}
            compact
          />

          <Link
            href="/login"
            className="font-bebas text-sm px-3 py-1.5 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 transition-all whitespace-nowrap"
          >
            Criar meu álbum
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner somente leitura */}
        <div className="mb-6 bg-dark-card border border-dark-border rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-yellow-400">👁️</span>
          <p className="text-gray-400 text-sm font-nunito">
            Você está vendo o álbum de{" "}
            <strong className="text-white">{album.name}</strong> em modo
            somente leitura.{" "}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Crie o seu!
            </Link>
          </p>
        </div>

        {/* Stats */}
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
            readOnly
          />
        ))}

        {/* Especiais */}
        {SPECIAL.map((special) => (
          <GroupSection
            key={special.code}
            groupName={`${special.flag} ${special.name}`}
            teams={[{ code: special.code, name: special.name, flag: special.flag }]}
            collectedMap={collectedMap}
            readOnly
            nums={special.nums}
          />
        ))}
      </main>
    </div>
  );
}
