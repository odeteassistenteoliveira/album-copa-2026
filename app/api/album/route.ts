import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM } from "@/lib/data";

// POST /api/album — cria álbum + todas as figurinhas para o usuário logado
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug } = body;

  const admin = createServerClient();

  // Criar álbum
  const { data: album, error: albumError } = await admin
    .from("albums")
    .insert({ user_id: user.id, name, slug })
    .select()
    .single();

  if (albumError) {
    return NextResponse.json({ error: albumError.message }, { status: 400 });
  }

  // Criar todas as figurinhas em batch
  const stickers: Array<{ album_id: string; team_code: string; number: number }> = [];

  for (const group of GROUPS) {
    for (const team of group.teams) {
      for (let n = 1; n <= STICKERS_PER_TEAM; n++) {
        stickers.push({ album_id: album.id, team_code: team.code, number: n });
      }
    }
  }

  for (const special of SPECIAL) {
    for (const num of special.nums) {
      stickers.push({ album_id: album.id, team_code: special.code, number: num });
    }
  }

  // Inserir em chunks de 500
  for (let i = 0; i < stickers.length; i += 500) {
    const chunk = stickers.slice(i, i + 500);
    const { error } = await admin.from("stickers").insert(chunk);
    if (error) {
      console.error("Erro inserindo figurinhas:", error);
    }
  }

  return NextResponse.json({ album });
}
