import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, generateSlug } from "@/lib/data";

async function ensureAlbum(userId: string, email: string) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: existing } = await admin
    .from("albums").select("*").eq("user_id", userId).single();
  if (existing) return existing;

  const name = `Álbum de ${email.split("@")[0]}`;
  const slug = generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);

  const { data: album } = await admin
    .from("albums").insert({ user_id: userId, name, slug }).select().single();
  if (!album) return null;

  const stickers: { album_id: string; team_code: string; number: number; quantity: number }[] = [];
  for (const group of GROUPS) {
    for (const team of group.teams) {
      for (let n = 1; n <= STICKERS_PER_TEAM; n++) {
        stickers.push({ album_id: album.id, team_code: team.code, number: n, quantity: 0 });
      }
    }
  }
  for (const special of SPECIAL) {
    for (const num of special.nums) {
      stickers.push({ album_id: album.id, team_code: special.code, number: num, quantity: 0 });
    }
  }
  for (let i = 0; i < stickers.length; i += 500) {
    await admin.from("stickers").insert(stickers.slice(i, i + 500));
  }
  return album;
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const album = await ensureAlbum(user.id, user.email || "usuario");
  if (!album) redirect("/login?error=album");

  // Buscar todas as figurinhas com quantity
  const { data: stickers } = await supabase
    .from("stickers")
    .select("team_code, number, quantity, collected")
    .eq("album_id", album.id);

  const quantityMap: Record<string, number> = {};
  for (const s of stickers || []) {
    // Compatibilidade: se quantity=0 mas collected=true, usar 1
    const qty = (s.quantity ?? 0) > 0 ? s.quantity : s.collected ? 1 : 0;
    quantityMap[`${s.team_code}_${s.number}`] = qty;
  }

  return (
    <DashboardClient
      album={album}
      initialQuantityMap={quantityMap}
      userId={user.id}
    />
  );
}
