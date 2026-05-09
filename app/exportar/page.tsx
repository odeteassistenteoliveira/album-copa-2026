import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ExportarClient from "./ExportarClient";

export default async function ExportarPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: album } = await supabase.from("albums").select("*").eq("user_id", user.id).single();
  if (!album) redirect("/dashboard");

  const { data: stickers } = await supabase
    .from("stickers")
    .select("team_code, number, quantity, collected")
    .eq("album_id", album.id);

  const quantityMap: Record<string, number> = {};
  for (const s of stickers || []) {
    const qty = (s.quantity ?? 0) > 0 ? s.quantity : s.collected ? 1 : 0;
    quantityMap[`${s.team_code}_${s.number}`] = qty;
  }

  return <ExportarClient albumName={album.name} quantityMap={quantityMap} />;
}
