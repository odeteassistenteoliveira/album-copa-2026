import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, city, state, whatsapp, trade_consent, trade_consent_at")
    .eq("id", user.id)
    .single();

  return <PerfilClient profile={profile} userId={user.id} email={user.email ?? ""} />;
}
