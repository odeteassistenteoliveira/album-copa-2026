export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
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
