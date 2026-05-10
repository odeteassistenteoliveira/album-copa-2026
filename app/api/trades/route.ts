import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Álbum do usuário
  const { data: myAlbum } = await admin
    .from("albums").select("id").eq("user_id", user.id).single();
  if (!myAlbum) return NextResponse.json({ error: "Álbum não encontrado" }, { status: 404 });

  // Perfil do usuário (cidade/estado para proximidade)
  const { data: myProfile } = await admin
    .from("profiles").select("city, state").eq("id", user.id).single();

  // Minhas figurinhas
  const { data: myStickers } = await admin
    .from("stickers").select("team_code, number, quantity").eq("album_id", myAlbum.id);
  if (!myStickers) return NextResponse.json({ matches: [] });

  // Figurinhas que EU não tenho (quantity = 0) → quero receber
  const myMissing = new Set(
    myStickers.filter(s => (s.quantity ?? 0) === 0).map(s => `${s.team_code}_${s.number}`)
  );
  // Figurinhas que eu tenho repetidas (quantity >= 2) → posso dar
  const myDupes = new Set(
    myStickers.filter(s => (s.quantity ?? 0) >= 2).map(s => `${s.team_code}_${s.number}`)
  );

  // Outros usuários com trade_consent
  const { data: otherProfiles } = await admin
    .from("profiles")
    .select("id, display_name, city, state, whatsapp")
    .eq("trade_consent", true)
    .neq("id", user.id);
  if (!otherProfiles?.length) return NextResponse.json({ matches: [] });

  // Álbuns dos outros usuários
  const { data: otherAlbums } = await admin
    .from("albums").select("id, user_id").in("user_id", otherProfiles.map(p => p.id));
  if (!otherAlbums?.length) return NextResponse.json({ matches: [] });

  const albumMap = new Map(otherAlbums.map(a => [a.user_id, a.id]));

  // Figurinhas de todos os outros de uma vez
  const { data: otherStickers } = await admin
    .from("stickers")
    .select("album_id, team_code, number, quantity")
    .in("album_id", otherAlbums.map(a => a.id))
    .gte("quantity", 1); // só buscar figurinhas que eles realmente têm

  const stickersByAlbum = new Map<string, typeof otherStickers>();
  for (const s of otherStickers || []) {
    if (!stickersByAlbum.has(s.album_id)) stickersByAlbum.set(s.album_id, []);
    stickersByAlbum.get(s.album_id)!.push(s);
  }

  const matches = [];

  for (const profile of otherProfiles) {
    const albumId = albumMap.get(profile.id);
    if (!albumId) continue;

    const stickers = stickersByAlbum.get(albumId) || [];

    // ── Prioridade 1: o que ELES podem me dar ─────────────────────────────
    // Figurinhas deles com qty >= 2 que EU não tenho → preenchem meu álbum
    const theyGiveByTeam: Record<string, number[]> = {};

    // ── Prioridade 2: o que EU posso dar a eles ───────────────────────────
    // Figurinhas deles com qty = 0 que EU tenho repetidas → troca mútua
    const theyMissingByTeam: Record<string, number[]> = {};

    // Mapa das figurinhas deles para acesso rápido
    const theirMap = new Map(stickers.map(s => [`${s.team_code}_${s.number}`, s.quantity ?? 0]));

    for (const s of stickers) {
      const key = `${s.team_code}_${s.number}`;
      // Eles têm repetida de algo que eu preciso → podem me DAR
      if (s.quantity >= 2 && myMissing.has(key)) {
        if (!theyGiveByTeam[s.team_code]) theyGiveByTeam[s.team_code] = [];
        theyGiveByTeam[s.team_code].push(s.number);
      }
    }

    // Eu tenho repetida de algo que eles não têm → posso DAR a eles
    for (const key of myDupes) {
      const [teamCode, numStr] = key.split("_");
      const theirQty = theirMap.get(key) ?? 0;
      if (theirQty === 0) {
        if (!theyMissingByTeam[teamCode]) theyMissingByTeam[teamCode] = [];
        theyMissingByTeam[teamCode].push(parseInt(numStr));
      }
    }

    // Ordenar números
    for (const nums of Object.values(theyGiveByTeam)) nums.sort((a, b) => a - b);
    for (const nums of Object.values(theyMissingByTeam)) nums.sort((a, b) => a - b);

    const theyGiveMe = Object.values(theyGiveByTeam).reduce((a, b) => a + b.length, 0);
    const iGiveThem = Object.values(theyMissingByTeam).reduce((a, b) => a + b.length, 0);

    // ── Só inclui se eles tiverem algo que EU preciso ─────────────────────
    if (theyGiveMe === 0) continue;

    // Score de proximidade
    const sameCity = myProfile?.city && profile.city &&
      myProfile.city.toLowerCase() === profile.city.toLowerCase();
    const sameState = myProfile?.state && profile.state &&
      myProfile.state.toUpperCase() === profile.state.toUpperCase();
    const proximityScore = sameCity ? 2 : sameState ? 1 : 0;

    // Quantas figurinhas distintas eles têm no total (indica colecionador ativo)
    const theirTotal = stickers.filter(s => s.quantity >= 1).length;

    matches.push({
      user_id: profile.id,
      display_name: profile.display_name,
      city: profile.city,
      state: profile.state,
      whatsapp: profile.whatsapp,
      they_give_me: theyGiveMe,       // figurinhas que eles têm e eu preciso ← métrica principal
      i_give_them: iGiveThem,          // figurinhas minhas repetidas que eles precisam
      total_score: theyGiveMe + iGiveThem,
      proximity_score: proximityScore,
      their_collection_size: theirTotal,
      they_give_by_team: theyGiveByTeam,
      i_give_by_team: theyMissingByTeam,
    });
  }

  // Ordenar: 1º quem tem MAIS do que eu preciso → 2º proximidade → 3º score total
  matches.sort((a, b) => {
    if (b.they_give_me !== a.they_give_me) return b.they_give_me - a.they_give_me;
    if (b.proximity_score !== a.proximity_score) return b.proximity_score - a.proximity_score;
    return b.total_score - a.total_score;
  });

  // Retornar top 5
  return NextResponse.json({ matches: matches.slice(0, 5) });
}
