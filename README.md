# 🏆 Álbum Copa 2026

App web para acompanhar sua coleção de figurinhas da Copa do Mundo 2026.

**Stack:** Next.js 14 · Supabase · Tailwind CSS · TypeScript · Vercel

---

## 🚀 Deploy em 5 passos

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project** e anote:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (em Settings > API) → `SUPABASE_SERVICE_ROLE_KEY`
3. Vá em **SQL Editor** e cole todo o conteúdo de `supabase/migrations.sql` e execute
4. Em **Authentication > Providers**, habilite **Google** se quiser login social

### 2. Subir o código no GitHub

```bash
cd album-copa-2026
git init
git add .
git commit -m "feat: álbum copa 2026 inicial"
git remote add origin https://github.com/SEU-USUARIO/album-copa-2026.git
git push -u origin main
```

### 3. Criar projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New > Project**
3. Importe o repositório do GitHub

### 4. Configurar variáveis de ambiente no Vercel

Em **Settings > Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (secreta!) |
| `NEXT_PUBLIC_BASE_URL` | URL do seu app (ex: `https://album-copa.vercel.app`) |

### 5. Deploy!

Clique em **Deploy**. O Vercel fará o build automaticamente.

A cada `git push`, o Vercel faz redeploy automático.

---

## 💻 Rodar localmente

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Preencha .env.local com suas chaves do Supabase

# Rodar em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do projeto

```
album-copa-2026/
├── app/
│   ├── page.tsx              — Landing page
│   ├── login/page.tsx        — Login / cadastro
│   ├── dashboard/            — Álbum do usuário (edição)
│   ├── album/[slug]/         — Álbum público (somente leitura)
│   ├── api/
│   │   ├── album/route.ts    — Criar álbum + figurinhas
│   │   ├── sticker/route.ts  — Marcar/desmarcar figurinha
│   │   ├── image/[code]/     — Cache de imagens Wikipedia
│   │   └── auth/signout/     — Logout
│   └── auth/callback/        — OAuth callback
├── components/
│   ├── StickerCard.tsx       — Figurinha individual
│   ├── StickerModal.tsx      — Modal com foto do jogador
│   ├── GroupSection.tsx      — Seção por grupo
│   ├── AlbumStats.tsx        — Progresso e estatísticas
│   └── ShareButton.tsx       — Botão de compartilhamento
├── lib/
│   ├── data.ts               — Grupos, times, jogadores (985 figurinhas)
│   ├── supabase.ts           — Clientes Supabase
│   └── types.ts              — Tipos TypeScript
└── supabase/
    └── migrations.sql        — Schema completo do banco de dados
```

---

## 🎴 Sobre o álbum

- **985 figurinhas** no total
- **48 seleções** × 20 figurinhas cada
- **11** figurinhas FIFA World Cup History (FWC 9–19)
- **14** figurinhas Coca-Cola (CC 1–14)
- **12 grupos** (A a L)
- Fotos dos jogadores via **Wikipedia API** (gratuita, sem necessidade de chave)

---

## ✨ Funcionalidades

- ✅ Login com email/senha ou Google
- ✅ Álbum pessoal criado automaticamente no cadastro
- ✅ Marcar/desmarcar figurinhas com clique
- ✅ Foto real do jogador estrela de cada seleção
- ✅ Barra de progresso e estatísticas em tempo real
- ✅ Link público único para compartilhar
- ✅ Álbum público sem necessidade de login
- ✅ Mobile-first e responsivo
- ✅ Rate limiting para evitar spam
- ✅ Cache de imagens no banco de dados
