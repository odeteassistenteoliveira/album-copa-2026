export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  trade_consent: boolean;
  trade_consent_at: string | null;
  created_at: string;
}

export interface Album {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sticker {
  id: string;
  album_id: string;
  team_code: string;
  number: number;
  collected: boolean;
  quantity: number;
  collected_at: string | null;
}

export interface PlayerImage {
  id: string;
  team_code: string;
  number: number;
  image_url: string | null;
  player_name: string | null;
  fetched_at: string;
}

export type StickerKey = `${string}_${number}`;

export interface AlbumWithStickers extends Album {
  stickers: Sticker[];
}

export interface TradeMatch {
  user_id: string;
  display_name: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  they_give_me: number;
  i_give_them: number;
  total_score: number;
  they_give_by_team: Record<string, number>;
  i_give_by_team: Record<string, number>;
}
