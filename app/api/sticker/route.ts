import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Rate limiting simples em memória
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.reset) {
    rateLimitMap.set(userId, { count: 1, reset: now + 60_000 });
    return true;
  }

  if (entry.count >= 60) return false;

  entry.count++;
  return true;
}

// POST /api/sticker — marcar/desmarcar figurinha
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Muitas requisições. Aguarde 1 minuto." },
      { status: 429 }
    );
  }

  const { album_id, team_code, number, collected } = await request.json();

  // Verificar se o álbum pertence ao usuário
  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("id")
    .eq("id", album_id)
    .eq("user_id", user.id)
    .single();

  if (albumError || !album) {
    return NextResponse.json({ error: "Álbum não encontrado" }, { status: 404 });
  }

  // Upsert da figurinha
  const { data, error } = await supabase
    .from("stickers")
    .upsert(
      {
        album_id,
        team_code,
        number,
        collected,
        collected_at: collected ? new Date().toISOString() : null,
      },
      { onConflict: "album_id,team_code,number" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ sticker: data });
}
