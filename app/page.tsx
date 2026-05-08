import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-border px-6 py-4 flex items-center justify-between">
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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Figurinhas decorativas */}
        <div className="flex gap-2 mb-8 opacity-60">
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

        <p className="font-nunito text-gray-400 text-lg max-w-md mb-10">
          Crie seu álbum, marque as figurinhas que você tem e compartilhe com
          amigos e família. 985 figurinhas para colecionar!
        </p>

        <Link
          href="/login"
          className="font-bebas text-2xl px-10 py-4 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all active:scale-95 shadow-gold hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]"
        >
          🎴 Criar meu álbum grátis
        </Link>

        <p className="text-gray-600 text-sm mt-4 font-nunito">
          Grátis, sem instalar nada. Funciona no celular!
        </p>
      </section>

      {/* Como funciona */}
      <section className="border-t border-dark-border px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="font-bebas text-3xl text-yellow-400 text-center mb-10 tracking-wide">
          Como funciona?
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "👤",
              title: "Crie sua conta",
              desc: "Cadastro rápido com email ou Google. Em menos de 1 minuto!",
            },
            {
              icon: "🎴",
              title: "Marque suas figurinhas",
              desc: "Clique nas figurinhas que você tem. Elas ficam douradas com a foto do jogador!",
            },
            {
              icon: "📤",
              title: "Compartilhe o link",
              desc: "Copie o link único do seu álbum e mande para a família ver seu progresso.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bebas text-xl text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm font-nunito">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-dark-border px-6 py-12 bg-dark-card">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "48", label: "Seleções" },
            { value: "985", label: "Figurinhas" },
            { value: "12", label: "Grupos" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-bebas text-5xl text-yellow-400">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-nunito">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border px-6 py-6 text-center text-gray-600 text-sm font-nunito">
        Álbum Copa 2026 · Feito com ❤️ para fãs de futebol
      </footer>
    </main>
  );
}
