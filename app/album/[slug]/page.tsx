import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicAlbumClient from "./PublicAlbumClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Álbum Copa 2026 — ${params.slug}`,
    description: "Veja a coleção de figurinhas da Copa 2026!",
    openGraph: {
      title: `Álbum Copa 2026 🏆`,
      description: "Confira minha coleção de figurinhas da Copa do Mundo 2026!",
      type: "website",
    },
  };
}

export default async function PublicAlbumPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });

  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!album) {
    notFound();
  }

  const { data: stickers } = await supabase
    .from("stickers")
    .select("team_code, number, collected")
    .eq("album_id", album.id)
    .eq("collected", true);

  const collectedMap: Record<string, boolean> = {};
  for (const s of stickers || []) {
    collectedMap[`${s.team_code}_${s.number}`] = true;
  }

  return <PublicAlbumClient album={album} collectedMap={collectedMap} />;
}
