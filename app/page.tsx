import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-dark-border px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-dark/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="font-bebas text-2xl text-yellow-400 tracking-wide">
            Álbum Copa 2026
          </span>
        </div>
        <Link
          href="/login"
          className="font-bebas text-lg px-5 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all active:scale-95"
        >
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <div className="flex gap-2 mb-8 opacity-50">
          {["🇧🇷", "🇦🇷", "🇫🇷", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇵🇹", "🇩🇪"].map((flag) => (
            <div
              key={flag}
              className="w-12 h-16 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-2xl"
            >
              {flag}
            </div>
          ))}
        </div>

        <h1 className="font-bebas text-5xl sm:text-7xl text-white leading-none mb-4">
          SEU ÁLBUM DIGITAL
          <br />
          <span className="text-yellow-400">COPA 2026</span>
        </h1>

        <p className="font-nunito text-gray-400 text-lg max-w-lg mb-10">
          Marque suas figurinhas, encontre colecionadores perto de você para trocar as repetidas e complete o álbum mais rápido.
        </p>

        <Link
          href="/login"
          className="font-bebas text-2xl px-10 py-4 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all active:scale-95 shadow-gold hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]"
        >
          🎴 Criar meu álbum grátis
        </Link>

        <p className="text-gray-600 text-sm mt-4 font-nunito">
          Grátis e sem instalar nada. Funciona no celular!
        </p>
      </section>

      {/* DESTAQUE — Funcionalidade de Trocas */}
      <section className="px-6 py-10 max-w-4xl mx-auto w-full">
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ea580c 0%, #f97316 60%, #fb923c 100%)" }}
        >
          <div className="px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
            {/* Texto */}
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block bg-white/20 text-white font-bebas text-sm px-3 py-1 rounded-full mb-4 tracking-wider">
                ✨ NOVIDADE
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl text-white leading-tight mb-3">
                Encontre quem tem <br />o que você precisa!
              </h2>
              <p className="text-orange-100 font-nunito text-base max-w-md">
                Marque suas figurinhas repetidas e o sistema cruza sua coleção com outros colecionadores da sua cidade ou estado — e indica quantas vocês podem trocar.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 mt-6 bg-white text-orange-600 font-bebas text-xl px-8 py-3 rounded-2xl hover:bg-orange-50 transition-all active:scale-95"
              >
                🔄 Quero trocar figurinhas
              </Link>
            </div>

            {/* Card ilustrativo de match */}
            <div className="shrink-0 w-full sm:w-72">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-orange-100 text-xs font-nunito mb-3 uppercase tracking-widest">Combinação encontrada</p>
                {/* Usuário fictício */}
                <div className="bg-white/10 rounded-xl p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-bebas text-base">Carlos · São Paulo, SP</p>
                      <p className="text-orange-200 text-xs font-nunito">A 3 km de você</p>
                    </div>
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div className="flex gap-2 text-xs font-nunito">
                    <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded-lg">
                      ✅ Ele tem 8 que você quer
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs font-nunito mt-1">
                    <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-lg">
                      📦 Você tem 6 que ele quer
                    </span>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-bebas text-base">Ana · Santo André, SP</p>
                      <p className="text-orange-200 text-xs font-nunito">A 12 km de você</p>
                    </div>
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div className="flex gap-2 text-xs font-nunito">
                    <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded-lg">
                      ✅ Ela tem 5 que você quer
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs font-nunito mt-1">
                    <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-lg">
                      📦 Você tem 11 que ela quer
                    </span>
                  </div>
                </div>
                <p className="text-orange-200 text-xs font-nunito text-center mt-3">
                  Contato via WhatsApp 🟢
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-t border-dark-border px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="font-bebas text-3xl text-yellow-400 text-center mb-10 tracking-wide">
          Como funciona?
        </h2>

        <div className="grid sm:grid-cols-4 gap-5">
          {[
            {
              icon: "👤",
              step: "1",
              title: "Crie sua conta",
              desc: "Cadastro em menos de 1 minuto com email e senha.",
            },
            {
              icon: "🎴",
              step: "2",
              title: "Marque suas figurinhas",
              desc: "Clique nas que você tem. Use o botão + para marcar as repetidas.",
            },
            {
              icon: "🔄",
              step: "3",
              title: "Encontre trocas",
              desc: "O sistema cruza sua coleção com outros usuários da sua região.",
            },
            {
              icon: "💬",
              step: "4",
              title: "Combine pelo WhatsApp",
              desc: "Contate o colecionador e acerte a troca direto no chat.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center relative"
            >
              <span className="absolute top-3 right-3 font-bebas text-xs text-gray-700 bg-dark rounded-full w-5 h-5 flex items-center justify-center">
                {item.step}
              </span>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bebas text-xl text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm font-nunito">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-dark-border px-6 py-12 bg-dark-card">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "48", label: "Seleções" },
            { value: "985", label: "Figurinhas" },
            { value: "12", label: "Grupos" },
            { value: "100%", label: "Grátis" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-bebas text-5xl text-yellow-400">{stat.value}</div>
              <div className="text-gray-400 text-sm font-nunito">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-dark-border px-6 py-16 text-center">
        <h2 className="font-bebas text-4xl text-white mb-3">
          Pronto para completar o álbum?
        </h2>
        <p className="text-gray-400 font-nunito mb-8 max-w-sm mx-auto">
          Junte-se a outros colecionadores e nunca mais fique parado em uma figurinha repetida.
        </p>
        <Link
          href="/login"
          className="inline-block font-bebas text-2xl px-10 py-4 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all active:scale-95 shadow-gold"
        >
          🎴 Começar agora — é grátis!
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border px-6 py-6 text-center text-gray-600 text-sm font-nunito">
        Álbum Copa 2026 · Feito com ❤️ para fãs de futebol
      </footer>
    </main>
  );
}
