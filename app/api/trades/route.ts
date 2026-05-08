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

  // Buscar álbum do usuário
  const { data: myAlbum } = await admin
    .from("albums").select("id").eq("user_id", user.id).single();
  if (!myAlbum) return NextResponse.json({ error: "Álbum não encontrado" }, { status: 404 });

  // Buscar perfil do usuário (para saber cidade/estado)
  const { data: myProfile } = await admin
    .from("profiles").select("city, state").eq("id", user.id).single();

  // Buscar minhas figurinhas
  const { data: myStickers } = await admin
    .from("stickers").select("team_code, number, quantity").eq("album_id", myAlbum.id);

  if (!myStickers) return NextResponse.json({ matches: [] });

  const myMissing = new Set(myStickers.filter(s => s.quantity === 0).map(s => `${s.team_code}_${s.number}`));
  const myDupes = new Set(myStickers.filter(s => s.quantity >= 2).map(s => `${s.team_code}_${s.number}`));

  // Buscar outros usuários com trade_consent=true
  const { data: otherProfiles } = await admin
    .from("profiles")
    .select("id, display_name, city, state, whatsapp")
    .eq("trade_consent", true)
    .neq("id", user.id);

  if (!otherProfiles || otherProfiles.length === 0) return NextResponse.json({ matches: [] });

  // Buscar álbuns dos outros usuários
  const otherUserIds = otherProfiles.map(p => p.id);
  const { data: otherAlbums } = await admin
    .from("albums").select("id, user_id").in("user_id", otherUserIds);

  if (!otherAlbums) return NextResponse.json({ matches: [] });

  const albumMap = new Map(otherAlbums.map(a => [a.user_id, a.id]));

  // Buscar figurinhas de todos os outros usuários de uma vez
  const otherAlbumIds = otherAlbums.map(a => a.id);
  const { data: otherStickers } = await admin
    .from("stickers")
    .select("album_id, team_code, number, quantity")
    .in("album_id", otherAlbumIds);

  if (!otherStickers) return NextResponse.json({ matches: [] });

  // Agrupar por album_id
  const stickersByAlbum = new Map<string, typeof otherStickers>();
  for (const s of otherStickers) {
    if (!stickersByAlbum.has(s.album_id)) stickersByAlbum.set(s.album_id, []);
    stickersByAlbum.get(s.album_id)!.push(s);
  }

  // Calcular match para cada usuário
  const matches = [];
  for (const profile of otherProfiles) {
    const albumId = albumMap.get(profile.id);
    if (!albumId) continue;
    const stickers = stickersByAlbum.get(albumId) || [];

    // Figurinhas que eles podem me dar (dupes deles que eu preciso)
    const theyGiveByTeam: Record<string, number> = {};
    // Figurinhas que eu posso dar a eles (meus dupes que eles precisam)
    const iGiveByTeam: Record<string, number> = {};

    for (const s of stickers) {
      const key = `${s.team_code}_${s.number}`;
      if (s.quantity >= 2 && myMissing.has(key)) {
        theyGiveByTeam[s.team_code] = (theyGiveByTeam[s.team_code] || 0) + 1;
      }
      if (s.quantity === 0 && myDupes.has(key)) {
        iGiveByTeam[s.team_code] = (iGiveByTeam[s.team_code] || 0) + 1;
      }
    }

    const theyGiveMe = Object.values(theyGiveByTeam).reduce((a, b) => a + b, 0);
    const iGiveThem = Object.values(iGiveByTeam).reduce((a, b) => a + b, 0);
    const totalScore = theyGiveMe + iGiveThem;

    if (totalScore === 0) continue;

    // Score de proximidade
    const sameCity = myProfile?.city && profile.city && myProfile.city.toLowerCase() === profile.city.toLowerCase();
    const sameState = myProfile?.state && profile.state && myProfile.state.toUpperCase() === profile.state.toUpperCase();
    const proximityScore = sameCity ? 2 : sameState ? 1 : 0;

    matches.push({
      user_id: profile.id,
      display_name: profile.display_name,
      city: profile.city,
      state: profile.state,
      whatsapp: profile.whatsapp,
      they_give_me: theyGiveMe,
      i_give_them: iGiveThem,
      total_score: totalScore,
      proximity_score: proximityScore,
      they_give_by_team: theyGiveByTeam,
      i_give_by_team: iGiveByTeam,
    });
  }

  // Ordenar: primeiro mesma cidade, depois mesmo estado, depois por score
  matches.sort((a, b) => {
    if (b.proximity_score !== a.proximity_score) return b.proximity_score - a.proximity_score;
    return b.total_score - a.total_score;
  });

  return NextResponse.json({ matches: matches.slice(0, 20) });
}
