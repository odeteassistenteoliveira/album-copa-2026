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
    nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
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

// Mapeamento de jogadores por figurinha (team_code → número → nome)
export const PLAYER_NAMES: Record<string, Record<number, string>> = {
  BRA: {
    1: "Escudo", 2: "Alisson", 3: "Weverton", 4: "Éderson",
    5: "Danilo", 6: "Éder Militão", 7: "Marquinhos", 8: "Gabriel Magalhães", 9: "Wendell",
    10: "Casemiro", 11: "Lucas Paquetá", 12: "Bruno Guimarães", 13: "Gerson", 14: "Rodrygo",
    15: "Vinícius Júnior", 16: "Raphinha", 17: "Gabriel Martinelli", 18: "Endrick",
    19: "Gabriel Barbosa", 20: "Seleção",
  },
  ARG: {
    1: "Escudo", 2: "Emiliano Martínez", 3: "Geronimo Rulli", 4: "Franco Armani",
    5: "Nahuel Molina", 6: "Cristian Romero", 7: "Lisandro Martínez", 8: "Nicolás Otamendi", 9: "Nicolás Tagliafico",
    10: "Rodrigo De Paul", 11: "Enzo Fernández", 12: "Alexis Mac Allister", 13: "Leandro Paredes", 14: "Giovani Lo Celso",
    15: "Lionel Messi", 16: "Lautaro Martínez", 17: "Julián Álvarez", 18: "Ángel Di María",
    19: "Paulo Dybala", 20: "Seleção",
  },
  FRA: {
    1: "Escudo", 2: "Mike Maignan", 3: "Alphonse Areola", 4: "Guillaume Restes",
    5: "Benjamin Pavard", 6: "Raphaël Varane", 7: "William Saliba", 8: "Ibrahima Konaté", 9: "Theo Hernández",
    10: "Aurélien Tchouaméni", 11: "Adrien Rabiot", 12: "Youssouf Fofana", 13: "Eduardo Camavinga", 14: "Antoine Griezmann",
    15: "Kylian Mbappé", 16: "Ousmane Dembélé", 17: "Marcus Thuram", 18: "Randal Kolo Muani",
    19: "Kingsley Coman", 20: "Seleção",
  },
  ENG: {
    1: "Escudo", 2: "Jordan Pickford", 3: "Aaron Ramsdale", 4: "Dean Henderson",
    5: "Trent Alexander-Arnold", 6: "John Stones", 7: "Harry Maguire", 8: "Marc Guéhi", 9: "Luke Shaw",
    10: "Declan Rice", 11: "Jude Bellingham", 12: "Kobbie Mainoo", 13: "Conor Gallagher", 14: "Phil Foden",
    15: "Harry Kane", 16: "Bukayo Saka", 17: "Marcus Rashford", 18: "Raheem Sterling",
    19: "Ollie Watkins", 20: "Seleção",
  },
  POR: {
    1: "Escudo", 2: "Rui Patrício", 3: "Diogo Costa", 4: "José Sá",
    5: "João Cancelo", 6: "Pepe", 7: "Rúben Dias", 8: "António Silva", 9: "Nuno Mendes",
    10: "Bernardo Silva", 11: "Bruno Fernandes", 12: "Vitinha", 13: "João Palhinha", 14: "Otávio",
    15: "Cristiano Ronaldo", 16: "Rafael Leão", 17: "Gonçalo Ramos", 18: "João Félix",
    19: "Diogo Jota", 20: "Seleção",
  },
  ESP: {
    1: "Escudo", 2: "Unai Simón", 3: "David Raya", 4: "Álex Remiro",
    5: "Dani Carvajal", 6: "Aymeric Laporte", 7: "Robin Le Normand", 8: "Pau Cubarsí", 9: "Alejandro Grimaldo",
    10: "Rodri", 11: "Pedri", 12: "Fabián Ruiz", 13: "Marcos Llorente", 14: "Dani Olmo",
    15: "Álvaro Morata", 16: "Lamine Yamal", 17: "Nico Williams", 18: "Mikel Oyarzabal",
    19: "Ferran Torres", 20: "Seleção",
  },
  GER: {
    1: "Escudo", 2: "Manuel Neuer", 3: "Marc-André ter Stegen", 4: "Oliver Baumann",
    5: "Joshua Kimmich", 6: "Antonio Rüdiger", 7: "Jonathan Tah", 8: "Nico Schlotterbeck", 9: "Maximilian Mittelstädt",
    10: "Toni Kroos", 11: "Florian Wirtz", 12: "Jamal Musiala", 13: "Leroy Sané", 14: "İlkay Gündoğan",
    15: "Kai Havertz", 16: "Thomas Müller", 17: "Serge Gnabry", 18: "Deniz Undav",
    19: "Niclas Füllkrug", 20: "Seleção",
  },
  NED: {
    1: "Escudo", 2: "Bart Verbruggen", 3: "Mark Flekken", 4: "Remko Pasveer",
    5: "Denzel Dumfries", 6: "Virgil van Dijk", 7: "Stefan de Vrij", 8: "Matthijs de Ligt", 9: "Nathan Aké",
    10: "Frenkie de Jong", 11: "Teun Koopmeiners", 12: "Tijjani Reijnders", 13: "Davy Klaassen", 14: "Georginio Wijnaldum",
    15: "Memphis Depay", 16: "Cody Gakpo", 17: "Donyell Malen", 18: "Xavi Simons",
    19: "Wout Weghorst", 20: "Seleção",
  },
  URU: {
    1: "Escudo", 2: "Sergio Rochet", 3: "Sebastián Sosa", 4: "Guillermo de Amores",
    5: "Nahitan Nández", 6: "José María Giménez", 7: "Diego Godín", 8: "Ronald Araújo", 9: "Martín Cáceres",
    10: "Federico Valverde", 11: "Rodrigo Bentancur", 12: "Lucas Torreira", 13: "Giorgian de Arrascaeta", 14: "Matías Vecino",
    15: "Luis Suárez", 16: "Darwin Núñez", 17: "Edinson Cavani", 18: "Facundo Torres",
    19: "Maxi Gómez", 20: "Seleção",
  },
  COL: {
    1: "Escudo", 2: "David Ospina", 3: "Camilo Vargas", 4: "Álvaro Montero",
    5: "Santiago Arias", 6: "Dávinson Sánchez", 7: "Yerry Mina", 8: "Carlos Cuesta", 9: "Johan Mojica",
    10: "Wilmar Barrios", 11: "Matheus Uribe", 12: "Juan Cuadrado", 13: "James Rodríguez", 14: "Sebastián Villa",
    15: "Radamel Falcao", 16: "Luis Díaz", 17: "Rafael Santos Borré", 18: "Miguel Borja",
    19: "Jhon Córdoba", 20: "Seleção",
  },
  USA: {
    1: "Escudo", 2: "Matt Turner", 3: "Zack Steffen", 4: "Sean Johnson",
    5: "Sergiño Dest", 6: "Walker Zimmerman", 7: "Miles Robinson", 8: "Tim Ream", 9: "Antonee Robinson",
    10: "Tyler Adams", 11: "Weston McKennie", 12: "Yunus Musah", 13: "Brenden Aaronson", 14: "Luca de la Torre",
    15: "Christian Pulisic", 16: "Timothy Weah", 17: "Josh Sargent", 18: "Ricardo Pepi",
    19: "Folarin Balogun", 20: "Seleção",
  },
  MEX: {
    1: "Escudo", 2: "Guillermo Ochoa", 3: "Alfredo Talavera", 4: "Rodolfo Cota",
    5: "Jorge Sánchez", 6: "Héctor Moreno", 7: "Johan Vásquez", 8: "César Montes", 9: "Gerardo Arteaga",
    10: "Édson Álvarez", 11: "Héctor Herrera", 12: "Orbelin Pineda", 13: "Andrés Guardado", 14: "Carlos Rodríguez",
    15: "Hirving Lozano", 16: "Alexis Vega", 17: "Henry Martín", 18: "Raúl Jiménez",
    19: "Roberto Alvarado", 20: "Seleção",
  },
  CAN: {
    1: "Escudo", 2: "Milan Borjan", 3: "Dayne St. Clair", 4: "James Pantemis",
    5: "Richie Laryea", 6: "Steven Vitória", 7: "Kamal Miller", 8: "Alistair Johnston", 9: "Sam Adekugbe",
    10: "Jonathan Osorio", 11: "Mark-Anthony Kaye", 12: "Atiba Hutchinson", 13: "Liam Fraser", 14: "Stephen Eustáquio",
    15: "Alphonso Davies", 16: "Tajon Buchanan", 17: "Jonathan David", 18: "Lucas Cavallini",
    19: "Cyle Larin", 20: "Seleção",
  },
  JPN: {
    1: "Escudo", 2: "Shuichi Gonda", 3: "Eiji Kawashima", 4: "Daniel Schmidt",
    5: "Hiroki Sakai", 6: "Maya Yoshida", 7: "Ko Itakura", 8: "Yuta Nakayama", 9: "Yuto Nagatomo",
    10: "Wataru Endo", 11: "Hidemasa Morita", 12: "Gaku Shibasaki", 13: "Takumi Minamino", 14: "Junya Ito",
    15: "Ritsu Doan", 16: "Kaoru Mitoma", 17: "Daichi Kamada", 18: "Ao Tanaka",
    19: "Ayase Ueda", 20: "Seleção",
  },
  MAR: {
    1: "Escudo", 2: "Yassine Bounou", 3: "Ahmed Tagnaouti", 4: "Munir Mohamedi",
    5: "Achraf Hakimi", 6: "Romain Saïss", 7: "Nayef Aguerd", 8: "Jawad El Yamiq", 9: "Noussair Mazraoui",
    10: "Sofyan Amrabat", 11: "Azzedine Ounahi", 12: "Selim Amallah", 13: "Ilias Chair", 14: "Hakim Ziyech",
    15: "Youssef En-Nesyri", 16: "Abde Ezzalzouli", 17: "Sofiane Boufal", 18: "Walid Cheddira",
    19: "Zakaria Aboukhlal", 20: "Seleção",
  },
  KOR: {
    1: "Escudo", 2: "Kim Seung-gyu", 3: "Jo Hyeon-woo", 4: "Song Bum-keun",
    5: "Kim Moon-hwan", 6: "Kim Min-jae", 7: "Jung Seung-hyun", 8: "Lee Yong", 9: "Hong Chul",
    10: "Jung Woo-young", 11: "Son Heung-min", 12: "Lee Kang-in", 13: "Kwon Chang-hoon", 14: "Na Sang-ho",
    15: "Hwang Hee-chan", 16: "Cho Gue-sung", 17: "Hwang Ui-jo", 18: "Oh Se-hun",
    19: "Bae Jun-ho", 20: "Seleção",
  },
  EGY: {
    1: "Escudo", 2: "Mohamed El Shenawy", 3: "Ahmed El Shenawy", 4: "Gabaski",
    5: "Ahmed Hegazi", 6: "Mahmoud Hamdy", 7: "Omar Kamal", 8: "Ahmed Fatouh", 9: "Mohamed Abdel-Shafy",
    10: "Tarek Hamed", 11: "Amr El Sulaya", 12: "Emam Ashour", 13: "Mostafa Mohamed", 14: "Trezeguet",
    15: "Mohamed Salah", 16: "Ramadan Sobhi", 17: "Omar Marmoush", 18: "Zizo",
    19: "Amr El Solia", 20: "Seleção",
  },
  SEN: {
    1: "Escudo", 2: "Édouard Mendy", 3: "Alfred Gomis", 4: "Sény Dieng",
    5: "Bouna Sarr", 6: "Kalidou Koulibaly", 7: "Abdou Diallo", 8: "Fodé Ballo-Touré", 9: "Youssouf Sabaly",
    10: "Idrissa Gueye", 11: "Nampalys Mendy", 12: "Cheikhou Kouyaté", 13: "Pape Matar Sarr", 14: "Moussa Niakhaté",
    15: "Sadio Mané", 16: "Ismaïla Sarr", 17: "Bamba Dieng", 18: "Habib Diallo",
    19: "Nicolas Jackson", 20: "Seleção",
  },
  // Demais seleções com estrutura genérica baseada em jogadores conhecidos
  NOR: { 1: "Escudo", 2: "Ørjan Nyland", 3: "Rune Jarstein", 4: "Jørgen Strand Larsen",
    5: "Omar Elabdellaoui", 6: "Stefan Strandberg", 7: "Andreas Hanche-Olsen", 8: "Leo Østigård", 9: "Birger Meling",
    10: "Martin Ødegaard", 11: "Sander Berge", 12: "Mathias Normann", 13: "Fredrik Aursnes", 14: "Kristian Thorstvedt",
    15: "Erling Haaland", 16: "Mohamed Elyounoussi", 17: "Alexander Sørloth", 18: "Ola Solbakken", 19: "Jørgen Strand Larsen", 20: "Seleção" },
  BEL: { 1: "Escudo", 2: "Thibaut Courtois", 3: "Simon Mignolet", 4: "Koen Casteels",
    5: "Thomas Meunier", 6: "Toby Alderweireld", 7: "Jan Vertonghen", 8: "Wout Faes", 9: "Leander Dendoncker",
    10: "Axel Witsel", 11: "Kevin De Bruyne", 12: "Youri Tielemans", 13: "Hans Vanaken", 14: "Thorgan Hazard",
    15: "Romelu Lukaku", 16: "Eden Hazard", 17: "Dries Mertens", 18: "Charles De Ketelaere", 19: "Lois Openda", 20: "Seleção" },
  CRO: { 1: "Escudo", 2: "Dominik Livaković", 3: "Ivica Ivušić", 4: "Ivo Grbić",
    5: "Josip Juranović", 6: "Dejan Lovren", 7: "Domagoj Vida", 8: "Joško Gvardiol", 9: "Borna Sosa",
    10: "Luka Modrić", 11: "Mateo Kovačić", 12: "Marcelo Brozović", 13: "Nikola Vlašić", 14: "Mario Pašalić",
    15: "Ivan Perišić", 16: "Ante Budimir", 17: "Bruno Petković", 18: "Andrej Kramarić", 19: "Marko Livaja", 20: "Seleção" },
  SUI: { 1: "Escudo", 2: "Yann Sommer", 3: "Jonas Omlin", 4: "Gregor Kobel",
    5: "Silvan Widmer", 6: "Manuel Akanji", 7: "Fabian Schär", 8: "Nico Elvedi", 9: "Ricardo Rodríguez",
    10: "Granit Xhaka", 11: "Remo Freuler", 12: "Denis Zakaria", 13: "Xherdan Shaqiri", 14: "Ruben Vargas",
    15: "Breel Embolo", 16: "Haris Seferović", 17: "Noah Okafor", 18: "Fabian Frei", 19: "Zeki Amdouni", 20: "Seleção" },
  SCO: { 1: "Escudo", 2: "Craig Gordon", 3: "David Marshall", 4: "Jon McLaughlin",
    5: "Stephen O'Donnell", 6: "Grant Hanley", 7: "Scott McKenna", 8: "Liam Cooper", 9: "Andrew Robertson",
    10: "John McGinn", 11: "Callum McGregor", 12: "Billy Gilmour", 13: "Ryan Jack", 14: "Stuart Armstrong",
    15: "Lyndon Dykes", 16: "Kevin Nisbet", 17: "Ryan Christie", 18: "Lawrence Shankland", 19: "Scott McTominay", 20: "Seleção" },
  AUT: { 1: "Escudo", 2: "Patrick Pentz", 3: "Alexander Schlager", 4: "Heinz Lindner",
    5: "Stefan Lainer", 6: "Philipp Lienhart", 7: "Maximilian Wöber", 8: "Kevin Danso", 9: "Philipp Mwene",
    10: "Florian Grillitsch", 11: "Konrad Laimer", 12: "Nicolas Seiwald", 13: "Marcel Sabitzer", 14: "Christoph Baumgartner",
    15: "David Alaba", 16: "Michael Gregoritsch", 17: "Marko Arnautović", 18: "Sasa Kalajdzic", 19: "Patrick Wimmer", 20: "Seleção" },
  TUR: { 1: "Escudo", 2: "Uğurcan Çakır", 3: "Mert Günok", 4: "Altay Bayındır",
    5: "Zeki Çelik", 6: "Merih Demiral", 7: "Çağlar Söyüncü", 8: "Kaan Ayhan", 9: "Ferdi Kadıoğlu",
    10: "Hakan Çalhanoğlu", 11: "Salih Özcan", 12: "Okay Yokuşlu", 13: "Kerem Aktürkoğlu", 14: "Arda Güler",
    15: "Cenk Tosun", 16: "Burak Yılmaz", 17: "Halil Dervişoğlu", 18: "Yusuf Yazıcı", 19: "İrfan Can Kahveci", 20: "Seleção" },
  GHA: { 1: "Escudo", 2: "Lawrence Ati-Zigi", 3: "Jojo Wollacott", 4: "Abdul Manaf Nurudeen",
    5: "Tariq Lamptey", 6: "Alexander Djiku", 7: "Daniel Amartey", 8: "Abdul Rahman Baba", 9: "Gideon Mensah",
    10: "Thomas Partey", 11: "Mohammed Kudus", 12: "Iddrisu Baba", 13: "Daniel-Kofi Kyereh", 14: "André Ayew",
    15: "Jordan Ayew", 16: "Osman Bukari", 17: "Inaki Williams", 18: "Antoine Semenyo", 19: "Ransford-Yeboah Königsdörffer", 20: "Seleção" },
  ALG: { 1: "Escudo", 2: "Raïs M'Bolhi", 3: "Alexandre Oukidja", 4: "Yassine Bounou",
    5: "Aïssa Mandi", 6: "Djamel Benlamri", 7: "Ramy Bensebaini", 8: "Youcef Atal", 9: "Mehdi Zeffane",
    10: "Ismael Bennacer", 11: "Sofiane Feghouli", 12: "Nabil Bentaleb", 13: "Riyad Mahrez", 14: "Youcef Belaïli",
    15: "Islam Slimani", 16: "Baghdad Bounedjah", 17: "Amine Gouiri", 18: "Dzyeko Benrahma", 19: "Adam Zorgane", 20: "Seleção" },
  IRN: { 1: "Escudo", 2: "Alireza Beiranvand", 3: "Hossein Hosseini", 4: "Payam Niazmand",
    5: "Sadegh Moharrami", 6: "Morteza Pouraliganji", 7: "Majid Hosseini", 8: "Shoja Khalilzadeh", 9: "Milad Mohammadi",
    10: "Saeid Ezatolahi", 11: "Ahmad Nourollahi", 12: "Mehdi Torabi", 13: "Mehdi Taremi", 14: "Ali Gholizadeh",
    15: "Sardar Azmoun", 16: "Karim Ansarifard", 17: "Allahyar Sayyadmanesh", 18: "Roozbeh Cheshmi", 19: "Saman Ghoddos", 20: "Seleção" },
  KSA: { 1: "Escudo", 2: "Mohammed Al-Owais", 3: "Fawaz Al-Qarni", 4: "Nawaf Al-Aqidi",
    5: "Saud Abdulhamid", 6: "Ali Al-Bulaihi", 7: "Abdulelah Al-Amri", 8: "Hassan Al-Tambakti", 9: "Yasser Al-Shahrani",
    10: "Mohammed Al-Qasem", 11: "Abdulrahman Al-Aboud", 12: "Sami Al-Najei", 13: "Salem Al-Dawsari", 14: "Saleh Al-Shehri",
    15: "Firas Al-Buraikan", 16: "Ali Al-Hassan", 17: "Fahad Al-Muwallad", 18: "Mohammed Al-Burayk", 19: "Haitham Asiri", 20: "Seleção" },
  AUS: { 1: "Escudo", 2: "Mathew Ryan", 3: "Danny Vukovic", 4: "Andrew Redmayne",
    5: "Nathaniel Atkinson", 6: "Harry Souttar", 7: "Kye Rowles", 8: "Bailey Wright", 9: "Aziz Behich",
    10: "Aaron Mooy", 11: "Jackson Irvine", 12: "Riley McGree", 13: "Ajdin Hrustic", 14: "Martin Boyle",
    15: "Mitch Duke", 16: "Jamie Maclaren", 17: "Craig Goodwin", 18: "Awer Mabil", 19: "Garang Kuol", 20: "Seleção" },
  ECU: { 1: "Escudo", 2: "Hernán Galíndez", 3: "Alexander Domínguez", 4: "Moisés Ramírez",
    5: "Angelo Preciado", 6: "Piero Hincapié", 7: "Robert Arboleda", 8: "Xavier Arreaga", 9: "Pervis Estupiñán",
    10: "José Cifuentes", 11: "Moisés Caicedo", 12: "Carlos Gruezo", 13: "Romario Ibarra", 14: "Gonzalo Plata",
    15: "Enner Valencia", 16: "Michael Estrada", 17: "Jeremy Sarmiento", 18: "Djorkaeff Reasco", 19: "Félix Torres", 20: "Seleção" },
  QAT: { 1: "Escudo", 2: "Meshaal Barsham", 3: "Yousef Hassan", 4: "Saad Al Sheeb",
    5: "Pedro Miguel", 6: "Bassam Al-Rawi", 7: "Tarek Salman", 8: "Abdulkarim Hassan", 9: "Homam Al-Amine",
    10: "Karim Boudiaf", 11: "Abdulaziz Hatem", 12: "Ali Asad", 13: "Hassan Al-Haydos", 14: "Akram Afif",
    15: "Almoez Ali", 16: "Ismaeel Mohammad", 17: "Ahmed Alaaeldin", 18: "Naif Al-Hadhrami", 19: "Mohammed Muntari", 20: "Seleção" },
  PAR: { 1: "Escudo", 2: "Antony Silva", 3: "Alfredo Aguilar", 4: "Roberto Fernández",
    5: "Santiago Arzamendia", 6: "Fabián Balbuena", 7: "Omar Alderete", 8: "Gustavo Gómez", 9: "Iván Piris",
    10: "Mathías Villasanti", 11: "Rodrigo Rojas", 12: "Richard Sánchez", 13: "Andrés Cubas", 14: "Ángel Cardozo Lucena",
    15: "Miguel Almirón", 16: "Antonio Sanabria", 17: "Carlos González", 18: "Ramón Sosa", 19: "Julio Enciso", 20: "Seleção" },
  SWE: { 1: "Escudo", 2: "Robin Olsen", 3: "Karl-Johan Johnsson", 4: "Kristoffer Nordfeldt",
    5: "Mikael Lustig", 6: "Victor Lindelöf", 7: "Marcus Danielson", 8: "Pontus Jansson", 9: "Ludwig Augustinsson",
    10: "Emil Forsberg", 11: "Albin Ekdal", 12: "Kristoffer Olsson", 13: "Mattias Svanberg", 14: "Dejan Kulusevski",
    15: "Alexander Isak", 16: "Zlatan Ibrahimović", 17: "Robin Quaison", 18: "Jordan Larsson", 19: "Viktor Gyökeres", 20: "Seleção" },
  TUN: { 1: "Escudo", 2: "Aymen Dahmen", 3: "Farouk Ben Mustapha", 4: "Mouez Hassen",
    5: "Montassar Talbi", 6: "Dylan Bronn", 7: "Yassine Meriah", 8: "Nader Ghandri", 9: "Ali Maâloul",
    10: "Anis Ben Slimane", 11: "Ellyes Skhiri", 12: "Ferjani Sassi", 13: "Hannibal Mejbri", 14: "Naïm Sliti",
    15: "Wahbi Khazri", 16: "Issam Jebali", 17: "Mohamed Drager", 18: "Youssef Msakni", 19: "Saîf-Eddine Khaoui", 20: "Seleção" },
  CIV: { 1: "Escudo", 2: "Badra Ali Sangaré", 3: "Sylvain Gbohouo", 4: "Yahia Fofana",
    5: "Simon Deli", 6: "Eric Bailly", 7: "Wilfried Kanon", 8: "Serge Aurier", 9: "Ghislain Konan",
    10: "Jean Michaël Seri", 11: "Franck Kessié", 12: "Ibrahim Sangaré", 13: "Soualiho Meité", 14: "Maxwel Cornet",
    15: "Sébastien Haller", 16: "Nicolas Pépé", 17: "Wilfried Zaha", 18: "Félix Afena-Gyan", 19: "Jérémie Boga", 20: "Seleção" },
  RSA: { 1: "Escudo", 2: "Ronwen Williams", 3: "Veli Mothwa", 4: "Bruce Bvuma",
    5: "Siyanda Xulu", 6: "Rushine De Reuck", 7: "Njabulo Ngcobo", 8: "Sifiso Hlanti", 9: "Reeve Frosler",
    10: "Bongani Zungu", 11: "Ethan Ntseki", 12: "Sphelele Mkhulise", 13: "Teboho Mokoena", 14: "Themba Zwane",
    15: "Percy Tau", 16: "Lyle Foster", 17: "Fagrie Lakay", 18: "Kermit Erasmus", 19: "Lebo Mothiba", 20: "Seleção" },
  CPV: { 1: "Escudo", 2: "Vozinha", 3: "Marco Soares", 4: "Josimar Dias",
    5: "Stopira", 6: "Filipe Moreira", 7: "Roberto Lopes", 8: "Sandro", 9: "Diney",
    10: "Jamiro Monteiro", 11: "Ryan Mendes", 12: "Bebé", 13: "Garry Rodrigues", 14: "Steven Fortes",
    15: "Gilson Tavares", 16: "Julio Tavares", 17: "Willy Semedo", 18: "Kenny Rocha Santos", 19: "João Filipe", 20: "Seleção" },
  NZL: { 1: "Escudo", 2: "Michael Woud", 3: "Stefan Marinovic", 4: "Oli Sail",
    5: "Tim Payne", 6: "Winston Reid", 7: "Michael Boxall", 8: "Nando de Wijs", 9: "Liberato Cacace",
    10: "Ryan Thomas", 11: "Joe Bell", 12: "Marko Stamenic", 13: "Louis Fenton", 14: "Ben Old",
    15: "Chris Wood", 16: "Callan Elliot", 17: "Kosta Barbarouses", 18: "Sarpreet Singh", 19: "Matthew Garbett", 20: "Seleção" },
  UZB: { 1: "Escudo", 2: "Ulfat Tursunov", 3: "Sanzhar Tursunov", 4: "Botir Yusupov",
    5: "Utkirbek Yusupov", 6: "Muzaffar Mirzayev", 7: "Rustam Ashurmatov", 8: "Jasur Yakhshiboev", 9: "Khojimat Erkinov",
    10: "Otabek Shukurov", 11: "Jaloliddin Masharipov", 12: "Sardor Rashidov", 13: "Eldor Shomurodov", 14: "Bobur Abdixoliqov",
    15: "Dostonbek Khamdamov", 16: "Sherzod Nasrullayev", 17: "Ilhom Shodiev", 18: "Nodir Tursunov", 19: "Jamshid Iskanderov", 20: "Seleção" },
  IRQ: { 1: "Escudo", 2: "Jalal Hassan", 3: "Mohammed Hamid", 4: "Dhurgham Ismail",
    5: "Ali Adnan", 6: "Ahmed Ibrahim", 7: "Salar Shahin", 8: "Rebin Sulaka", 9: "Hussein Ali",
    10: "Amjad Attwan", 11: "Ali Faez", 12: "Saad Natiq", 13: "Ayman Hussein", 14: "Alaa Abbas",
    15: "Mohanad Ali", 16: "Bashar Resan", 17: "Ahmed Yasin", 18: "Sherko Karimi", 19: "Aymen Hussain", 20: "Seleção" },
  CUW: { 1: "Escudo", 2: "Eloy Room", 3: "Cuco Martina", 4: "Jurien Gaari",
    5: "Rangelo Janga", 6: "Gilson Tavares", 7: "Jurien Gaari", 8: "Leandro Bacuna", 9: "Wavell Hinkel",
    10: "Cuco Martina", 11: "Sheraldo Becker", 12: "Juninho Bacuna", 13: "Elson Hooi", 14: "Quentin Westbroek",
    15: "Genero Zeefuik", 16: "Charles-Andreas Brym", 17: "Ryan Donk", 18: "Jamiro Monteiro", 19: "Jarchinio Antonia", 20: "Seleção" },
  COD: { 1: "Escudo", 2: "Joël Kiassumbua", 3: "Ley Matampi", 4: "Dimitri Bertaud",
    5: "Christian Luyindama", 6: "Chancel Mbemba", 7: "Wilfried Moke", 8: "Yoane Wissa", 9: "Marcel Tisserand",
    10: "Edo Kayembe", 11: "Silas Mbungu", 12: "Cédric Bakambu", 13: "Donatien Ibara", 14: "Arthur Masuaku",
    15: "Jordan Ikoko", 16: "Théo Bongonda", 17: "Dieumerci Mbokani", 18: "Samuel Moutoussamy", 19: "Herita Ilunga", 20: "Seleção" },
  JOR: { 1: "Escudo", 2: "Amer Shafi", 3: "Moath Abu Taher", 4: "Mohammad Al-Shboul",
    5: "Bahloul Eldin Musa", 6: "Yazeed Abo Laila", 7: "Baha Faisal", 8: "Mohammad Haddadin", 9: "Ahmad Salam",
    10: "Yazan Al-Arab", 11: "Musa Al-Taamari", 12: "Sanad Akour", 13: "Obada Al-Rashdan", 14: "Mohammad Matalgah",
    15: "Hamzeh Al-Dardour", 16: "Anas Bani Yaseen", 17: "Anas Rashdan", 18: "Ehsan Haddad", 19: "Samer Amer", 20: "Seleção" },
  HAI: { 1: "Escudo", 2: "Josué Duverger", 3: "Carlens Arcus", 4: "Johnny Placide",
    5: "Mechack Jérôme", 6: "Andrew Jean-Baptiste", 7: "Steeven Saba", 8: "Wilde-Donald Guerrier", 9: "Andry Roux",
    10: "Duckens Nazon", 11: "Herve Bazile", 12: "Réginald Goreux", 13: "Jeff Louis", 14: "James Léacock",
    15: "Frantzdy Pierrot", 16: "Kervens Belfort", 17: "Yvensley Augustin", 18: "Zachary Herivaux", 19: "Boucheron Bazile", 20: "Seleção" },
  BIH: { 1: "Escudo", 2: "Ibrahim Šehić", 3: "Nikola Vasilj", 4: "Jasmin Handanović",
    5: "Sead Kolašinac", 6: "Ermin Bičakčić", 7: "Ognjen Vranješ", 8: "Muhamed Bešić", 9: "Elvir Koljić",
    10: "Miralem Pjanić", 11: "Anel Ahmedhodžić", 12: "Sandro Kulenović", 13: "Edin Džeko", 14: "Ermedin Demirović",
    15: "Dušan Šarenac", 16: "Armin Hodžić", 17: "Gojko Cimirot", 18: "Benjamin Šeško", 19: "Amar Dedić", 20: "Seleção" },
  CZE: { 1: "Escudo", 2: "Jiří Pavlenka", 3: "Aleš Mandous", 4: "Tomáš Vaclík",
    5: "Vladimír Coufal", 6: "Tomáš Kalas", 7: "Ondřej Čelůstka", 8: "David Zima", 9: "Jan Bořil",
    10: "Tomáš Souček", 11: "Vladimír Darida", 12: "Lukáš Provod", 13: "Marek Havlík", 14: "Jakub Jankto",
    15: "Patrik Schick", 16: "Adam Hložek", 17: "Tomáš Černý", 18: "Michael Krmenčík", 19: "Jan Kuchta", 20: "Seleção" },
  PAN: { 1: "Escudo", 2: "Luis Mejía", 3: "Jaime Penedo", 4: "Orlando Mosquera",
    5: "Éric Davis", 6: "Fidel Escobar", 7: "Harold Cummings", 8: "Andrés Andrade", 9: "Giovani Torres",
    10: "Adalberto Carrasquilla", 11: "Anibal Godoy", 12: "Abdiel Arroyo", 13: "Edgar Bárcenas", 14: "Cristian Martínez",
    15: "Rolando Blackburn", 16: "Gabriel Torres", 17: "Cecilio Waterman", 18: "Ismael Díaz", 19: "César Yanis", 20: "Seleção" },
  FWC: {
    1: "Copa do Mundo 1930", 2: "Copa do Mundo 1950", 3: "Copa do Mundo 1958",
    4: "Copa do Mundo 1966", 5: "Copa do Mundo 1970", 6: "Copa do Mundo 1982",
    7: "Copa do Mundo 1994", 8: "Copa do Mundo 2002",
    9: "Copa do Mundo 2006", 10: "Copa do Mundo 2010", 11: "Copa do Mundo 2014",
    12: "Copa do Mundo 2018", 13: "Copa do Mundo 2022",
    14: "Pelé", 15: "Diego Maradona", 16: "Ronaldo R9", 17: "Zinedine Zidane",
    18: "Ronaldinho", 19: "Mascote 2026",
  },
  CC: {
    1: "Coca-Cola 1", 2: "Coca-Cola 2", 3: "Coca-Cola 3", 4: "Coca-Cola 4",
    5: "Coca-Cola 5", 6: "Coca-Cola 6", 7: "Coca-Cola 7", 8: "Coca-Cola 8",
    9: "Coca-Cola 9", 10: "Coca-Cola 10", 11: "Coca-Cola 11", 12: "Coca-Cola 12",
    13: "Coca-Cola 13", 14: "Coca-Cola 14",
  },
};
