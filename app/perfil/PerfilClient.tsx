"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO"
];

interface Props {
  profile: {
    display_name: string | null;
    city: string | null;
    state: string | null;
    whatsapp: string | null;
    trade_consent: boolean;
    trade_consent_at: string | null;
  } | null;
  userId: string;
  email: string;
}

export default function PerfilClient({ profile, userId, email }: Props) {
  const supabase = createBrowserClient();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [state, setState] = useState(profile?.state ?? "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? "");
  const [consent, setConsent] = useState(profile?.trade_consent ?? false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!displayName.trim()) { setError("Nome é obrigatório."); return; }
    if (consent && (!city.trim() || !state || !whatsapp.trim())) {
      setError("Para participar das trocas, preencha cidade, estado e WhatsApp.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("profiles").update({
      display_name: displayName.trim(),
      city: city.trim() || null,
      state: state || null,
      whatsapp: whatsapp.trim() || null,
      trade_consent: consent,
      trade_consent_at: consent && !profile?.trade_consent ? new Date().toISOString() : profile?.trade_consent_at,
    }).eq("id", userId);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-dark px-4 py-8">
      <div className="max-w-lg mx-auto">
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm font-nunito mb-6 inline-block">
          ← Voltar ao álbum
        </a>

        <h1 className="font-bebas text-3xl text-yellow-400 mb-1">Meu Perfil</h1>
        <p className="text-gray-400 text-sm font-nunito mb-8">{email}</p>

        {/* Dados básicos */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
          <h2 className="font-bebas text-xl text-white mb-4">Dados Básicos</h2>
          <label className="block text-gray-300 text-sm font-nunito mb-1">Nome de exibição</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Como quer ser chamado"
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white font-nunito text-sm focus:outline-none focus:border-yellow-400 mb-4"
          />
        </div>

        {/* Cadastro para trocas */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
          <h2 className="font-bebas text-xl text-white mb-1">Sistema de Trocas</h2>
          <p className="text-gray-400 text-sm font-nunito mb-5">
            Preencha seus dados e aceite o termo para aparecer nos resultados de busca de outros colecionadores.
          </p>

          <label className="block text-gray-300 text-sm font-nunito mb-1">Cidade</label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Ex: São Paulo"
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white font-nunito text-sm focus:outline-none focus:border-yellow-400 mb-4"
          />

          <label className="block text-gray-300 text-sm font-nunito mb-1">Estado</label>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white font-nunito text-sm focus:outline-none focus:border-yellow-400 mb-4"
          >
            <option value="">Selecione o estado</option>
            {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>

          <label className="block text-gray-300 text-sm font-nunito mb-1">WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white font-nunito text-sm focus:outline-none focus:border-yellow-400 mb-6"
          />

          {/* Termo de consentimento */}
          <div className="bg-dark rounded-lg border border-dark-border p-4 mb-4">
            <h3 className="text-yellow-400 font-bebas text-lg mb-2">Termo de Uso e Privacidade</h3>
            <div className="text-gray-400 text-xs font-nunito space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
              <p>Ao ativar o sistema de trocas, você concorda com o seguinte:</p>
              <p><strong className="text-gray-300">1. Dados compartilhados:</strong> Seu nome de exibição, cidade, estado e número de WhatsApp ficarão visíveis para outros usuários cadastrados no sistema de trocas do Álbum Copa 2026.</p>
              <p><strong className="text-gray-300">2. Finalidade:</strong> Esses dados serão usados exclusivamente para facilitar a troca de figurinhas entre colecionadores.</p>
              <p><strong className="text-gray-300">3. Sem compartilhamento externo:</strong> Suas informações não serão vendidas, repassadas ou utilizadas para outros fins além do descrito acima.</p>
              <p><strong className="text-gray-300">4. Revogação:</strong> Você pode desativar sua participação a qualquer momento desmarcando esta opção, e seus dados deixarão de ser visíveis para outros usuários imediatamente.</p>
              <p><strong className="text-gray-300">5. Responsabilidade:</strong> Os contatos realizados via WhatsApp são de inteira responsabilidade dos usuários envolvidos. O app apenas facilita o encontro entre colecionadores.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-1 accent-yellow-400 w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-300 text-sm font-nunito">
                Li e concordo com o Termo de Uso e autorizo o compartilhamento dos meus dados (nome, cidade, estado e WhatsApp) com outros usuários do sistema de trocas.
              </span>
            </label>
          </div>

          {!consent && profile?.trade_consent && (
            <p className="text-orange-400 text-xs font-nunito mb-4">
              ⚠️ Ao desmarcar, você será removido dos resultados de busca de trocas.
            </p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm font-nunito mb-4">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bebas text-xl py-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : saved ? "✅ Salvo!" : "Salvar Perfil"}
        </button>
      </div>
    </div>
  );
}
