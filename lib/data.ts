export interface Team {
  code: string;
  name: string;
  flag: string;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface SpecialSection {
  code: string;
  name: string;
  flag: string;
  nums: number[];
}

export const GROUPS: Group[] = [
  {
    name: "Grupo A",
    teams: [
      { code: "MEX", name: "México", flag: "🇲🇽" },
      { code: "RSA", name: "África do Sul", flag: "🇿🇦" },
      { code: "KOR", name: "Coreia do Sul", flag: "🇰🇷" },
      { code: "CZE", name: "Rep. Tcheca", flag: "🇨🇿" },
    ],
  },
  {
    name: "Grupo B",
    teams: [
      { code: "CAN", name: "Canadá", flag: "🇨🇦" },
      { code: "BIH", name: "Bósnia", flag: "🇧🇦" },
      { code: "QAT", name: "Catar", flag: "🇶🇦" },
      { code: "SUI", name: "Suíça", flag: "🇨🇭" },
    ],
  },
  {
    name: "Grupo C",
    teams: [
      { code: "BRA", name: "Brasil", flag: "🇧🇷" },
      { code: "MAR", name: "Marrocos", flag: "🇲🇦" },
      { code: "HAI", name: "Haiti", flag: "🇭🇹" },
      { code: "SCO", name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    ],
  },
  {
    name: "Grupo D",
    teams: [
      { code: "USA", name: "Estados Unidos", flag: "🇺🇸" },
      { code: "PAR", name: "Paraguai", flag: "🇵🇾" },
      { code: "AUS", name: "Austrália", flag: "🇦🇺" },
      { code: "TUR", name: "Turquia", flag: "🇹🇷" },
    ],
  },
  {
    name: "Grupo E",
    teams: [
      { code: "GER", name: "Alemanha", flag: "🇩🇪" },
      { code: "CUW", name: "Curaçao", flag: "🇨🇼" },
      { code: "CIV", name: "Costa do Marfim", flag: "🇨🇮" },
      { code: "ECU", name: "Equador", flag: "🇪🇨" },
    ],
  },
  {
    name: "Grupo F",
    teams: [
      { code: "NED", name: "Holanda", flag: "🇳🇱" },
      { code: "JPN", name: "Japão", flag: "🇯🇵" },
      { code: "SWE", name: "Suécia", flag: "🇸🇪" },
      { code: "TUN", name: "Tunísia", flag: "🇹🇳" },
    ],
  },
  {
    name: "Grupo G",
    teams: [
      { code: "BEL", name: "Bélgica", flag: "🇧🇪" },
      { code: "EGY", name: "Egito", flag: "🇪🇬" },
      { code: "IRN", name: "Irã", flag: "🇮🇷" },
      { code: "NZL", name: "Nova Zelândia", flag: "🇳🇿" },
    ],
  },
  {
    name: "Grupo H",
    teams: [
      { code: "ESP", name: "Espanha", flag: "🇪🇸" },
      { code: "CPV", name: "Cabo Verde", flag: "🇨🇻" },
      { code: "KSA", name: "Arábia Saudita", flag: "🇸🇦" },
      { code: "URU", name: "Uruguai", flag: "🇺🇾" },
    ],
  },
  {
    name: "Grupo I",
    teams: [
      { code: "FRA", name: "França", flag: "🇫🇷" },
      { code: "SEN", name: "Senegal", flag: "🇸🇳" },
      { code: "IRQ", name: "Iraque", flag: "🇮🇶" },
      { code: "NOR", name: "Noruega", flag: "🇳🇴" },
    ],
  },
  {
    name: "Grupo J",
    teams: [
      { code: "ARG", name: "Argentina", flag: "🇦🇷" },
      { code: "ALG", name: "Argélia", flag: "🇩🇿" },
      { code: "AUT", name: "Áustria", flag: "🇦🇹" },
      { code: "JOR", name: "Jordânia", flag: "🇯🇴" },
    ],
  },
  {
    name: "Grupo K",
    teams: [
      { code: "POR", name: "Portugal", flag: "🇵🇹" },
      { code: "COD", name: "Congo", flag: "🇨🇩" },
      { code: "UZB", name: "Uzbequistão", flag: "🇺🇿" },
      { code: "COL", name: "Colômbia", flag: "🇨🇴" },
    ],
  },
  {
    name: "Grupo L",
    teams: [
      { code: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { code: "CRO", name: "Croácia", flag: "🇭🇷" },
      { code: "GHA", name: "Gana", flag: "🇬🇭" },
      { code: "PAN", name: "Panamá", flag: "🇵🇦" },
    ],
  },
];

export const SPECIAL: SpecialSection[] = [
  {
    code: "FWC",
    name: "FIFA World Cup History",
    flag: "🏆",
    nums: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  {
    code: "CC",
    name: "Figurinhas Coca-Cola",
    flag: "🥤",
    nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  },
];

// Jogadores estrela por seleção (para busca de imagem na Wikipedia)
export const STAR_PLAYERS: Record<string, string> = {
  BRA: "Vinícius Júnior",
  ARG: "Lionel Messi",
  FRA: "Kylian Mbappé",
  ENG: "Jude Bellingham",
  POR: "Cristiano Ronaldo",
  ESP: "Pedri",
  GER: "Florian Wirtz",
  NED: "Virgil van Dijk",
  NOR: "Erling Haaland",
  BEL: "Kevin De Bruyne",
  CRO: "Luka Modrić",
  KOR: "Son Heung-min",
  EGY: "Mohamed Salah",
  SEN: "Sadio Mané",
  MAR: "Achraf Hakimi",
  URU: "Darwin Núñez",
  COL: "Luis Díaz",
  USA: "Christian Pulisic",
  MEX: "Hirving Lozano",
  JPN: "Takumi Minamino",
  SUI: "Granit Xhaka",
  CAN: "Alphonso Davies",
  SCO: "Andrew Robertson",
  GHA: "Mohammed Kudus",
  AUT: "David Alaba",
  ALG: "Riyad Mahrez",
  IRN: "Mehdi Taremi",
  KSA: "Salem Al-Dawsari",
  AUS: "Mathew Ryan",
  NZL: "Chris Wood",
  TUR: "Hakan Çalhanoğlu",
  RSA: "Percy Tau",
  CPV: "Garry Rodrigues",
  CIV: "Sébastien Haller",
  ECU: "Enner Valencia",
  PAR: "Miguel Almirón",
  QAT: "Akram Afif",
  SWE: "Alexander Isak",
  TUN: "Wahbi Khazri",
  UZB: "Eldor Shomurodov",
  IRQ: "Amjad Attwan",
  CUW: "Leandro Bacuna",
  COD: "Chancel Mbemba",
  JOR: "Ahmad Salam",
  HAI: "Duckens Nazon",
  BIH: "Edin Džeko",
  CZE: "Patrik Schick",
  PAN: "Rolando Blackburn",
  FWC: "FIFA World Cup",
  CC: "Coca-Cola",
};

// Total de figurinhas: 48 seleções × 20 + 11 FWC + 14 CC = 985
export const STICKERS_PER_TEAM = 20;

export function getTotalStickers(): number {
  const teamTotal = GROUPS.reduce(
    (acc, g) => acc + g.teams.length * STICKERS_PER_TEAM,
    0
  );
  const specialTotal = SPECIAL.reduce((acc, s) => acc + s.nums.length, 0);
  return teamTotal + specialTotal;
}

export async function getWikipediaImage(
  playerName: string
): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(playerName);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.thumbnail?.source || data?.originalimage?.source || null;
  } catch {
    return null;
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
