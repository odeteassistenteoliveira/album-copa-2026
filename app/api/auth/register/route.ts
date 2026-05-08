import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, generateSlug } from "@/lib/data";

export async function POST(request: Request) {
  const { email, password, albumName } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Criar usuário já com email confirmado (sem precisar de link)
  const name = albumName || `Álbum de ${email.split("@")[0]}`;
  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: name },
  });

  if (userError) {
    // Usuário já existe — tentar confirmar e continuar
    if (!userError.message.includes("already registered")) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }
    // Se já existe, apenas retornar sucesso para que o cliente faça signIn
    return NextResponse.json({ ok: true, exists: true });
  }

  const userId = userData.user.id;

  // 2. Criar perfil (caso o trigger não tenha disparado ainda)
  await admin.from("profiles").upsert({ id: userId, email, display_name: name }, { onConflict: "id" });

  // 3. Criar álbum
  const slug = generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);
  const { data: album, error: albumError } = await admin
    .from("albums")
    .insert({ user_id: userId, name, slug })
    .select()
    .single();

  if (albumError) {
    return NextResponse.json({ error: albumError.message }, { status: 400 });
  }

  // 4. Criar todas as figurinhas em batch
  const stickers: { album_id: string; team_code: string; number: number }[] = [];
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

  for (let i = 0; i < stickers.length; i += 500) {
    await admin.from("stickers").insert(stickers.slice(i, i + 500));
  }

  return NextResponse.json({ ok: true });
}
