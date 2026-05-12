import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Álbum do usuário logado
  const { data: myAlbum } = await admin
    .from("albums").select("id").eq("user_id", user.id).single();
  if (!myAlbum) return NextResponse.json({ error: "Seu álbum não encontrado" }, { status: 404 });

  // Álbum do outro usuário pelo slug
  const { data: otherAlbum } = await admin
    .from("albums").select("id, user_id, name").eq("slug", params.slug).single();
  if (!otherAlbum) return NextResponse.json({ error: "Álbum não encontrado" }, { status: 404 });

  // Perfil do outro usuário
  const { data: otherProfile } = await admin
    .from("profiles").select("display_name, city, state, whatsapp").eq("id", otherAlbum.user_id).single();

  // Minhas figurinhas
  const { data: myStickers } = await admin
    .from("stickers").select("team_code, number, quantity").eq("album_id", myAlbum.id);

  // Figurinhas do outro
  const { data: otherStickers } = await admin
    .from("stickers").select("team_code, number, quantity").eq("album_id", otherAlbum.id);

  const myMap = new Map((myStickers || []).map(s => [`${s.team_code}_${s.number}`, s.quantity ?? 0]));
  const otherMap = new Map((otherStickers || []).map(s => [`${s.team_code}_${s.number}`, s.quantity ?? 0]));

  // Eles podem me dar: repetidas deles (qty>=2) que eu não tenho (qty=0)
  const theyGiveMeByTeam: Record<string, number[]> = {};
  for (const [key, qty] of otherMap.entries()) {
    if (qty >= 2 && (myMap.get(key) ?? 0) === 0) {
      const [team, num] = key.split("_");
      if (!theyGiveMeByTeam[team]) theyGiveMeByTeam[team] = [];
      theyGiveMeByTeam[team].push(parseInt(num));
    }
  }

  // Eu posso dar a eles: minhas repetidas (qty>=2) que eles não têm (qty=0)
  const iGiveThemByTeam: Record<string, number[]> = {};
  for (const [key, qty] of myMap.entries()) {
    if (qty >= 2 && (otherMap.get(key) ?? 0) === 0) {
      const [team, num] = key.split("_");
      if (!iGiveThemByTeam[team]) iGiveThemByTeam[team] = [];
      iGiveThemByTeam[team].push(parseInt(num));
    }
  }

  // Ordenar números
  for (const nums of Object.values(theyGiveMeByTeam)) nums.sort((a, b) => a - b);
  for (const nums of Object.values(iGiveThemByTeam)) nums.sort((a, b) => a - b);

  const theyGiveMe = Object.values(theyGiveMeByTeam).reduce((a, b) => a + b.length, 0);
  const iGiveThem = Object.values(iGiveThemByTeam).reduce((a, b) => a + b.length, 0);

  return NextResponse.json({
    other_name: otherProfile?.display_name ?? otherAlbum.name,
    other_city: otherProfile?.city,
    other_state: otherProfile?.state,
    other_whatsapp: otherProfile?.whatsapp,
    they_give_me: theyGiveMe,
    i_give_them: iGiveThem,
    they_give_me_by_team: theyGiveMeByTeam,
    i_give_them_by_team: iGiveThemByTeam,
  });
}
