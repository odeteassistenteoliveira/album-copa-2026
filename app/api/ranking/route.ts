import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getTotalStickers } from "@/lib/data";

export async function GET() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const total = getTotalStickers();

  // Buscar todos os álbuns
  const { data: albums } = await admin.from("albums").select("id, name, slug, user_id");
  if (!albums) return NextResponse.json({ ranking: [], myRank: null });

  // Para cada álbum, contar figurinhas coletadas
  const counts = await Promise.all(albums.map(async (album) => {
    const { count } = await admin
      .from("stickers")
      .select("*", { count: "exact", head: true })
      .eq("album_id", album.id)
      .gte("quantity", 1);
    return { ...album, collected: count ?? 0, pct: Math.round(((count ?? 0) / total) * 100) };
  }));

  // Ordenar por % decrescente
  counts.sort((a, b) => b.collected - a.collected);

  const ranking = counts.map((a, i) => ({ ...a, rank: i + 1 }));
  const myRank = user ? ranking.find(r => r.user_id === user.id) ?? null : null;

  return NextResponse.json({ ranking, myRank, total });
}
