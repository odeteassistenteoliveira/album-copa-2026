import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, generateSlug } from "@/lib/data";

export async function POST(request: Request) {
  const { email, password, albumName } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
  }

  // Cliente admin para operações no banco (funciona com sb_secret_* key)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Cadastrar usuário (com anon key via REST direto)
  const signupResp = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const signupData = await signupResp.json();

  if (!signupResp.ok) {
    const msg = signupData.msg || signupData.message || "Erro ao criar conta";
    // Usuário já existe — ok, deixar fazer login
    if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
      return NextResponse.json({ ok: true, exists: true });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId: string = signupData.id || signupData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Erro interno: usuário não criado" }, { status: 500 });
  }

  // 2. Confirmar email via função SQL (sem precisar de JWT admin key)
  await admin.rpc("confirm_user_email", { user_id: userId });

  // 3. Criar perfil
  const name = albumName || `Álbum de ${email.split("@")[0]}`;
  await admin.from("profiles").upsert(
    { id: userId, email, display_name: name },
    { onConflict: "id" }
  );

  // 4. Verificar se álbum já existe
  const { data: existing } = await admin
    .from("albums")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    return NextResponse.json({ ok: true });
  }

  // 5. Criar álbum
  const slug = generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);
  const { data: album, error: albumError } = await admin
    .from("albums")
    .insert({ user_id: userId, name, slug })
    .select()
    .single();

  if (albumError) {
    return NextResponse.json({ error: albumError.message }, { status: 400 });
  }

  // 6. Criar figurinhas em batch
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
