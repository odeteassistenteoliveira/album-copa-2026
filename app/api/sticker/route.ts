import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(userId, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 120) return false;
  entry.count++;
  return true;
}

// POST /api/sticker — atualizar figurinha (toggle ou quantity)
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (!checkRateLimit(user.id)) return NextResponse.json({ error: "Muitas requisições." }, { status: 429 });

  const { album_id, team_code, number, collected, quantity } = await request.json();

  // Verificar propriedade do álbum
  const { data: album, error: albumError } = await supabase
    .from("albums").select("id").eq("id", album_id).eq("user_id", user.id).single();

  if (albumError || !album) return NextResponse.json({ error: "Álbum não encontrado" }, { status: 404 });

  // Calcular quantity e collected
  let finalQuantity: number;
  let finalCollected: boolean;

  if (quantity !== undefined) {
    // Atualização de quantity direta (botão +/-)
    finalQuantity = Math.max(0, quantity);
    finalCollected = finalQuantity >= 1;
  } else {
    // Toggle simples (coletar/descoletar)
    finalCollected = collected ?? false;
    finalQuantity = finalCollected ? 1 : 0;
  }

  const { data, error } = await supabase
    .from("stickers")
    .upsert(
      {
        album_id,
        team_code,
        number,
        collected: finalCollected,
        quantity: finalQuantity,
        collected_at: finalCollected ? new Date().toISOString() : null,
      },
      { onConflict: "album_id,team_code,number" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ sticker: data });
}
