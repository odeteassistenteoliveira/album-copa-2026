import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar álbum do usuário
  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!album) {
    // Álbum não criado ainda (edge case)
    redirect("/login");
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
