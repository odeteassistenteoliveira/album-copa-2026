-- =============================================
-- ÁLBUM COPA 2026 — Migrations SQL para Supabase
-- Execute este arquivo no SQL Editor do Supabase
-- =============================================

-- 1. Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de álbuns
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Meu Álbum',
  slug TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de figurinhas
CREATE TABLE IF NOT EXISTS stickers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  team_code TEXT NOT NULL,
  number INTEGER NOT NULL,
  collected BOOLEAN DEFAULT FALSE,
  collected_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(album_id, team_code, number)
);

-- 4. Cache de imagens de jogadores
CREATE TABLE IF NOT EXISTS player_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_code TEXT NOT NULL,
  number INTEGER NOT NULL,
  image_url TEXT,
  player_name TEXT,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_code, number)
);

-- =============================================
-- TRIGGER: criar perfil automaticamente ao registrar
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER: atualizar updated_at nos álbuns
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS albums_updated_at ON albums;
CREATE TRIGGER albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfil visível pelo dono" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Perfil editável pelo dono" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Albums
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Álbuns públicos visíveis por todos" ON albums
  FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Usuário gerencia seu próprio álbum" ON albums
  FOR ALL USING (auth.uid() = user_id);

-- Stickers
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Figurinhas visíveis via álbum público" ON stickers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = stickers.album_id
        AND (albums.is_public = TRUE OR albums.user_id = auth.uid())
    )
  );
CREATE POLICY "Usuário gerencia suas figurinhas" ON stickers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = stickers.album_id
        AND albums.user_id = auth.uid()
    )
  );

-- Player images (público para leitura)
ALTER TABLE player_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Imagens visíveis por todos" ON player_images
  FOR SELECT USING (TRUE);
CREATE POLICY "Apenas service role insere imagens" ON player_images
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Apenas service role atualiza imagens" ON player_images
  FOR UPDATE USING (TRUE);

-- =============================================
-- ÍNDICES para performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums(user_id);
CREATE INDEX IF NOT EXISTS idx_albums_slug ON albums(slug);
CREATE INDEX IF NOT EXISTS idx_stickers_album_id ON stickers(album_id);
CREATE INDEX IF NOT EXISTS idx_stickers_collected ON stickers(album_id, collected);
CREATE INDEX IF NOT EXISTS idx_player_images_team ON player_images(team_code, number);
