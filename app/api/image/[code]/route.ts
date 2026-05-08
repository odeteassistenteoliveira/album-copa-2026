import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { STAR_PLAYERS, getWikipediaImage } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  const admin = createServerClient();

  // Buscar no cache primeiro
  const { data: cached } = await admin
    .from("player_images")
    .select("image_url, player_name")
    .eq("team_code", code)
    .eq("number", 1) // Usamos number=1 como "imagem principal da seleção"
    .single();

  if (cached) {
    return NextResponse.json({
      image_url: cached.image_url,
      player_name: cached.player_name,
    });
  }

  // Buscar na Wikipedia
  const playerName = STAR_PLAYERS[code];
  let imageUrl: string | null = null;

  if (playerName) {
    imageUrl = await getWikipediaImage(playerName);
  }

  // Salvar no cache
  await admin.from("player_images").upsert(
    {
      team_code: code,
      number: 1,
      image_url: imageUrl,
      player_name: playerName || null,
    },
    { onConflict: "team_code,number" }
  );

  return NextResponse.json({
    image_url: imageUrl,
    player_name: playerName || null,
  });
}
