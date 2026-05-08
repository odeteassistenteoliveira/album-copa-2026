import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Link from "next/link";
import { GROUPS, SPECIAL } from "@/lib/data";

interface Props { params: { slug: string } }

function buildAllKeys() {
  const keys: string[] = [];
  for (const g of GROUPS) for (const t of g.teams) for (let n = 1; n <= 20; n++) keys.push(`${t.code}_${n}`);
  for (const s of SPECIAL) for (const n of s.nums) keys.push(`${s.code}_${n}`);
  return keys;
}

function keyLabel(key: string) {
  const [code, num] = key.split("_");
  return `${code} #${num}`;
}

export default async function TrocarPage({ params }: Props) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Álbum do dono do QR
  const { data: ownerAlbum } = await admin
    .from("albums").select("*").eq("slug", params.slug).single();

  if (!ownerAlbum) {
    return (
      <main className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-bebas text-2xl">Álbum não encontrado</p>
          <Link href="/" className="text-yellow-400 font-nunito text-sm mt-4 block">← Voltar</Link>
        </div>
      </main>
    );
  }

  // Figurinhas do dono
  const { data: ownerStickers } = await admin
    .from("stickers").select("team_code, number, collected").eq("album_id", ownerAlbum.id);
  const ownerCollected = new Set(
    (ownerStickers || []).filter(s => s.collected).map(s => `${s.team_code}_${s.number}`)
  );
  const ownerNeeds = new Set(
    (ownerStickers || []).filter(s => !s.collected).map(s => `${s.team_code}_${s.number}`)
  );

  // Viewer (quem está lendo o QR)
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  let viewerCollected = new Set<string>();
  let viewerNeeds = new Set<string>();
  let viewerAlbum = null;

  if (user) {
    const { data: va } = await admin.from("albums").select("*").eq("user_id", user.id).single();
    viewerAlbum = va;
    if (va) {
      const { data: vs } = await admin.from("stickers").select("team_code, number, collected").eq("album_id", va.id);
      viewerCollected = new Set((vs || []).filter(s => s.collected).map(s => `${s.team_code}_${s.number}`));
      viewerNeeds = new Set((vs || []).filter(s => !s.collected).map(s => `${s.team_code}_${s.number}`));
    }
  }

  // Cruzamento: o que o dono tem que o viewer precisa
  const ownerCanGive = [...ownerCollected].filter(k => viewerNeeds.has(k));
  // O que o viewer tem que o dono precisa
  const viewerCanGive = [...viewerCollected].filter(k => ownerNeeds.has(k));

  const totalOwner = ownerCollected.size;
  const totalAll = buildAllKeys().length;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://album-copa-2026-xi.vercel.app"}/trocar/${params.slug}`
  )}&bgcolor=0d0d1a&color=facc15&margin=10`;

  return (
    <main className="min-h-screen bg-dark p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-yellow-400 font-nunito text-sm">← Início</Link>
          <span className="font-bebas text-yellow-400 text-xl">🏆 Copa 2026</span>
        </div>

        {/* Dono do álbum */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 text-center">
          <p className="text-gray-400 font-nunito text-sm mb-1">Álbum de</p>
          <h1 className="font-bebas text-3xl text-white">{ownerAlbum.name}</h1>
          <p className="text-yellow-400 font-nunito text-sm mt-2">
            {totalOwner}/{totalAll} figurinhas coletadas
          </p>
          <div className="w-full bg-dark rounded-full h-2 mt-3">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${(totalOwner / totalAll) * 100}%` }}
            />
          </div>
        </div>

        {/* Se o viewer não está logado */}
        {!user && (
          <div className="bg-dark-card border border-yellow-400/30 rounded-2xl p-6 text-center mb-6">
            <p className="text-3xl mb-3">🔄</p>
            <p className="text-white font-bebas text-xl mb-2">Quer ver o que pode trocar?</p>
            <p className="text-gray-400 font-nunito text-sm mb-4">
              Faça login com seu álbum para cruzar suas figurinhas com as de {ownerAlbum.name.split(" ").slice(-1)[0]}
            </p>
            <Link
              href="/login"
              className="inline-block bg-yellow-400 text-black font-bebas text-lg px-8 py-3 rounded-xl hover:bg-yellow-300 transition-all"
            >
              Entrar no meu álbum
            </Link>
          </div>
        )}

        {/* Se o viewer é o próprio dono */}
        {user && viewerAlbum?.id === ownerAlbum.id && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center mb-6">
            <p className="text-3xl mb-2">📱</p>
            <p className="font-bebas text-xl text-white mb-1">Este é o seu QR Code</p>
            <p className="text-gray-400 font-nunito text-sm mb-4">
              Mostre este QR Code para seus amigos escanearem e verem o que podem trocar com você!
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR Code" className="w-40 h-40 mx-auto rounded-xl" />
            <p className="text-gray-500 font-nunito text-xs mt-3">
              Ou compartilhe o link do seu álbum
            </p>
            <Link href="/dashboard" className="block mt-3 text-yellow-400 font-nunito text-sm hover:underline">
              ← Voltar ao meu álbum
            </Link>
          </div>
        )}

        {/* Cruzamento — viewer logado e é outro usuário */}
        {user && viewerAlbum && viewerAlbum.id !== ownerAlbum.id && (
          <div className="space-y-4">
            {/* O dono pode me dar */}
            <div className="bg-dark-card border border-green-700/50 rounded-2xl p-5">
              <h2 className="font-bebas text-xl text-green-400 mb-3 flex items-center gap-2">
                <span>🎁</span>
                {ownerAlbum.name.split(" ").slice(-1)[0]} tem e você precisa
                <span className="ml-auto bg-green-900/50 text-green-400 text-sm px-2 py-0.5 rounded-full">
                  {ownerCanGive.length}
                </span>
              </h2>
              {ownerCanGive.length === 0 ? (
                <p className="text-gray-500 font-nunito text-sm">Nenhuma figurinha em comum 🤷</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ownerCanGive.slice(0, 60).map(k => (
                    <span key={k} className="bg-green-900/30 border border-green-700/50 text-green-300 text-xs font-nunito px-2 py-1 rounded-lg">
                      {keyLabel(k)}
                    </span>
                  ))}
                  {ownerCanGive.length > 60 && (
                    <span className="text-gray-500 text-xs font-nunito px-2 py-1">+{ownerCanGive.length - 60} mais</span>
                  )}
                </div>
              )}
            </div>

            {/* Eu posso dar para o dono */}
            <div className="bg-dark-card border border-blue-700/50 rounded-2xl p-5">
              <h2 className="font-bebas text-xl text-blue-400 mb-3 flex items-center gap-2">
                <span>📤</span>
                Você tem e {ownerAlbum.name.split(" ").slice(-1)[0]} precisa
                <span className="ml-auto bg-blue-900/50 text-blue-400 text-sm px-2 py-0.5 rounded-full">
                  {viewerCanGive.length}
                </span>
              </h2>
              {viewerCanGive.length === 0 ? (
                <p className="text-gray-500 font-nunito text-sm">Nenhuma figurinha em comum 🤷</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {viewerCanGive.slice(0, 60).map(k => (
                    <span key={k} className="bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs font-nunito px-2 py-1 rounded-lg">
                      {keyLabel(k)}
                    </span>
                  ))}
                  {viewerCanGive.length > 60 && (
                    <span className="text-gray-500 text-xs font-nunito px-2 py-1">+{viewerCanGive.length - 60} mais</span>
                  )}
                </div>
              )}
            </div>

            <div className="text-center">
              <Link href="/dashboard" className="text-yellow-400 font-nunito text-sm hover:underline">
                ← Voltar ao meu álbum
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
