import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CompararClient from "./CompararClient";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM } from "@/lib/data";

async function buildQuantityMap(albumId: string) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await admin.from("stickers").select("team_code,number,quantity,collected").eq("album_id", albumId);
  const map: Record<string, number> = {};
  for (const s of data || []) {
    map[`${s.team_code}_${s.number}`] = (s.quantity ?? 0) > 0 ? s.quantity : s.collected ? 1 : 0;
  }
  return map;
}

const ALL_TEAMS = [
  ...GROUPS.flatMap(g => g.teams),
  ...SPECIAL.map(s => ({ code: s.code, name: s.name, flag: s.flag })),
];

export default async function CompararPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Álbum do dono do QR code (slug da URL)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data: ownerAlbum } = await admin.from("albums").select("*").eq("slug", params.slug).single();
  if (!ownerAlbum) redirect("/");

  const ownerMap = await buildQuantityMap(ownerAlbum.id);

  // Álbum do usuário logado (quem escaneou)
  let myAlbum = null;
  let myMap: Record<string, number> = {};
  if (user) {
    const { data } = await admin.from("albums").select("*").eq("user_id", user.id).single();
    myAlbum = data;
    if (myAlbum) myMap = await buildQuantityMap(myAlbum.id);
  }

  // Calcular matches: o que eu tenho repetido e o dono precisa, e vice-versa
  const allKeys = new Set([
    ...GROUPS.flatMap(g => g.teams.flatMap(t =>
      Array.from({ length: STICKERS_PER_TEAM }, (_, i) => `${t.code}_${i + 1}`)
    )),
    ...SPECIAL.flatMap(s => s.nums.map(n => `${s.code}_${n}`)),
  ]);

  const iCanGive: string[] = []; // eu tenho repetida, dono precisa
  const ownerCanGive: string[] = []; // dono tem repetida, eu preciso

  for (const key of allKeys) {
    const myQty = myMap[key] ?? 0;
    const ownerQty = ownerMap[key] ?? 0;
    if (myQty >= 2 && ownerQty === 0) iCanGive.push(key);
    if (ownerQty >= 2 && myQty === 0) ownerCanGive.push(key);
  }

  return (
    <CompararClient
      ownerAlbum={ownerAlbum}
      myAlbum={myAlbum}
      iCanGive={iCanGive}
      ownerCanGive={ownerCanGive}
      isLoggedIn={!!user}
      allTeams={ALL_TEAMS}
    />
  );
}
