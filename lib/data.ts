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
    nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
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

// Nomes oficiais das figurinhas Panini FIFA World Cup 2026
// Estrutura: PLAYER_NAMES[código_seleção][número_figurinha] = nome
export const PLAYER_NAMES: Record<string, Record<number, string>> = {
  FWC: {
    0: "Logo Panini",
    1: "Emblema Oficial 1/2",
    2: "Emblema Oficial 2/2",
    3: "Mascotes Oficiais",
    4: "Slogan Oficial",
    5: "Bola Oficial",
    6: "Canadá (País Anfitrião)",
    7: "México (País Anfitrião)",
    8: "EUA (País Anfitrião)",
    9: "Itália 1934",
    10: "Uruguai 1950",
    11: "Alemanha Ocidental 1954",
    12: "Brasil 1962",
    13: "Alemanha Ocidental 1974",
    14: "Argentina 1986",
    15: "Brasil 1994",
    16: "Brasil 2002",
    17: "Itália 2006",
    18: "Alemanha 2014",
    19: "Argentina 2022",
  },
  CC: {
    1: "Lamine Yamal (Espanha)",
    2: "Joshua Kimmich (Alemanha)",
    3: "Harry Kane (Inglaterra)",
    4: "Santiago Giménez (México)",
    5: "Josko Gvardiol (Croácia)",
    6: "Federico Valverde (Uruguai)",
    7: "Jefferson Lerma (Colômbia)",
    8: "Enner Valenci