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

  // Verificar se já existe
  const { data: existing } = await admin
    .from("albums")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) return existing;

  // Criar álbum automaticamente (para logins via Google ou fluxos incompletos)
  const name = `Álbum de ${email.split("@")[0]}`;
  const slug = generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);

  const { data: album } = await admin
    .from("albums")
    .insert({ user_id: userId, name, slug })
    .select()
    .single();

  if (!album) return null;

  // Criar figurinhas
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

  return album;
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Garantir que o álbum existe (cria automaticamente se necessário)
  const album = await ensureAlbum(user.id, user.email || "usuario");

  if (!album) {
    redirect("/login?error=album");
  }

  // Buscar figurinhas coletadas
  const { data: stickers } = await supabase
    .from("stickers")
    .select("team_code, number, collected")
    .eq("album_id", album.id)
    .eq("collected", true);

  const collectedMap: Record<string, boolean> = {};
  for (const s of stickers || []) {
    collectedMap[`${s.team_code}_${s.number}`] = true;
  }

  return (
    <DashboardClient
      album={album}
      initialCollected={collectedMap}
      userId={user.id}
    />
  );
}
