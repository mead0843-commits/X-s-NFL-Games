const STORAGE_KEY = 'x-nfl-games-state';

const defaultState = {
  coins: 420,
  xp: 180,
  streak: 0,
  bestStreak: 0,
  localWins: 0,
  packCount: 3,
  collection: [
    { name: 'Patrick Mahomes', team: 'Chiefs', position: 'QB', rarity: 'legendary', rating: 98 },
    { name: 'Christian McCaffrey', team: '49ers', position: 'RB', rarity: 'elite', rating: 95 },
    { name: 'JaMarr Chase', team: 'Bengals', position: 'WR', rarity: 'rare', rating: 91 }
  ],
  profile: {
    name: 'X',
    title: 'Rookie',
    upgrades: [
      { id: 'frame', name: 'Default Frame', cost: 0 },
      { id: 'avatar', name: 'Neon Avatar', cost: 250 },
      { id: 'banner', name: 'Champ Banner', cost: 700 }
    ]
  },
  packsOpened: 0,
  modeWins: {
    twenty: 0,
    trivia: 0,
    guess: 0,
    local: 0,
    stat: 0,
    draft: 0,
    pickem: 0,
    survivor: 0,
    blitz: 0
  }
};

const state = loadState();
const seasonPassThresholds = [500, 1100, 1800, 2900, 4300, 6200, 8700, 12000];
const teamWheel = ['Chiefs', 'Bills', '49ers', 'Eagles', 'Cowboys', 'Patriots', 'Ravens', 'Giants', 'Bengals', 'Dolphins'];
const eraWheel = ['1980s', '1990s', '2000s', '2010s', '2020s'];
const wheelPalette = ['#5fa8ff', '#ef5d5d', '#2ad48c', '#f4c542', '#8b5cf6', '#4cc9f0', '#f39c12', '#00c2a8', '#ff7f7f', '#a78bfa'];

const rosterLayout = [
  { id: 'off-qb', section: 'OFFENSE', label: 'QB' },
  { id: 'off-rb', section: 'OFFENSE', label: 'RB' },
  { id: 'off-wr', section: 'OFFENSE', label: 'WR' },
  { id: 'off-te', section: 'OFFENSE', label: 'TE' },
  { id: 'off-flex-1', section: 'OFFENSE', label: 'FLEX' },
  { id: 'off-flex-2', section: 'OFFENSE', label: 'FLEX' },
  { id: 'def-edge', section: 'DEFENSE', label: 'EDGE' },
  { id: 'def-dt', section: 'DEFENSE', label: 'DT' },
  { id: 'def-lb', section: 'DEFENSE', label: 'LB' },
  { id: 'def-cb', section: 'DEFENSE', label: 'CB' },
  { id: 'def-s', section: 'DEFENSE', label: 'S' },
  { id: 'def-dflex', section: 'DEFENSE', label: 'D-FLEX' }
];

const rosterPlayers = [
  { id: 'tom-brady', name: 'Tom Brady', position: 'QB', team: 'NE', bestSeason: { year: 2007, stats: { PASS_YDS: 4806, PASS_TD: 50, PASS_INT: 8, RUSH_YDS: 131, RUSH_TD: 2 } } },
  { id: 'patrick-mahomes', name: 'Patrick Mahomes', position: 'QB', team: 'KC', bestSeason: { year: 2022, stats: { PASS_YDS: 5250, PASS_TD: 41, PASS_INT: 12, RUSH_YDS: 358, RUSH_TD: 4 } } },
  { id: 'aaron-rodgers', name: 'Aaron Rodgers', position: 'QB', team: 'GB', bestSeason: { year: 2011, stats: { PASS_YDS: 4643, PASS_TD: 45, PASS_INT: 6, RUSH_YDS: 257, RUSH_TD: 3 } } },
  { id: 'drew-brees', name: 'Drew Brees', position: 'QB', team: 'NO', bestSeason: { year: 2011, stats: { PASS_YDS: 5476, PASS_TD: 46, PASS_INT: 14, RUSH_YDS: 23, RUSH_TD: 1 } } },
  { id: 'josh-allen', name: 'Josh Allen', position: 'QB', team: 'BUF', bestSeason: { year: 2024, stats: { PASS_YDS: 5319, PASS_TD: 39, PASS_INT: 11, RUSH_YDS: 581, RUSH_TD: 9 } } },
  { id: 'dak-prescott', name: 'Dak Prescott', position: 'QB', team: 'DAL', bestSeason: { year: 2023, stats: { PASS_YDS: 5103, PASS_TD: 27, PASS_INT: 29, RUSH_YDS: 313, RUSH_TD: 2 } } },
  { id: 'lamar-jackson', name: 'Lamar Jackson', position: 'QB', team: 'BAL', bestSeason: { year: 2023, stats: { PASS_YDS: 3570, PASS_TD: 24, PASS_INT: 7, RUSH_YDS: 821, RUSH_TD: 13 } } },
  { id: 'joe-burrow', name: 'Joe Burrow', position: 'QB', team: 'CIN', bestSeason: { year: 2021, stats: { PASS_YDS: 4611, PASS_TD: 34, PASS_INT: 14, RUSH_YDS: 118, RUSH_TD: 2 } } },
  { id: 'jared-goff', name: 'Jared Goff', position: 'QB', team: 'DET', bestSeason: { year: 2023, stats: { PASS_YDS: 4574, PASS_TD: 30, PASS_INT: 12, RUSH_YDS: 75, RUSH_TD: 1 } } },

  { id: 'saquon-barkley', name: 'Saquon Barkley', position: 'RB', team: 'NYG', bestSeason: { year: 2024, stats: { RUSH_YDS: 1450, RUSH_TD: 10, RUSH_ATT: 287, RUSH_YPC: 5.1, REC: 51, REC_YDS: 338, REC_TD: 2 } } },
  { id: 'christian-mccaffrey', name: 'Christian McCaffrey', position: 'RB', team: 'SF', bestSeason: { year: 2023, stats: { RUSH_YDS: 1459, RUSH_TD: 14, RUSH_ATT: 272, RUSH_YPC: 5.4, REC: 96, REC_YDS: 564, REC_TD: 4 } } },
  { id: 'derrick-henry', name: 'Derrick Henry', position: 'RB', team: 'BAL', bestSeason: { year: 2020, stats: { RUSH_YDS: 2027, RUSH_TD: 17, RUSH_ATT: 378, RUSH_YPC: 5.4, REC: 18, REC_YDS: 154, REC_TD: 0 } } },
  { id: 'josh-jacobs', name: 'Josh Jacobs', position: 'RB', team: 'LV', bestSeason: { year: 2022, stats: { RUSH_YDS: 1653, RUSH_TD: 12, RUSH_ATT: 340, RUSH_YPC: 4.9, REC: 53, REC_YDS: 400, REC_TD: 2 } } },
  { id: 'alvin-kamara', name: 'Alvin Kamara', position: 'RB', team: 'NO', bestSeason: { year: 2020, stats: { RUSH_YDS: 932, RUSH_TD: 16, RUSH_ATT: 187, RUSH_YPC: 5.0, REC: 83, REC_YDS: 756, REC_TD: 5 } } },
  { id: 'nick-chubb', name: 'Nick Chubb', position: 'RB', team: 'CLE', bestSeason: { year: 2022, stats: { RUSH_YDS: 1525, RUSH_TD: 12, RUSH_ATT: 302, RUSH_YPC: 5.0, REC: 27, REC_YDS: 239, REC_TD: 1 } } },
  { id: 'breece-hall', name: 'Breece Hall', position: 'RB', team: 'NYJ', bestSeason: { year: 2023, stats: { RUSH_YDS: 994, RUSH_TD: 5, RUSH_ATT: 223, RUSH_YPC: 4.5, REC: 76, REC_YDS: 591, REC_TD: 3 } } },
  { id: 'austin-ekeler', name: 'Austin Ekeler', position: 'RB', team: 'LAC', bestSeason: { year: 2021, stats: { RUSH_YDS: 915, RUSH_TD: 13, RUSH_ATT: 206, RUSH_YPC: 4.4, REC: 107, REC_YDS: 722, REC_TD: 5 } } },
  { id: 'joe-mixon', name: 'Joe Mixon', position: 'RB', team: 'CIN', bestSeason: { year: 2023, stats: { RUSH_YDS: 1105, RUSH_TD: 12, RUSH_ATT: 259, RUSH_YPC: 4.3, REC: 61, REC_YDS: 421, REC_TD: 1 } } },

  { id: 'ja-marr-chase', name: "Ja'Marr Chase", position: 'WR', team: 'CIN', bestSeason: { year: 2024, stats: { REC: 127, REC_YDS: 1708, REC_TD: 17, REC_YPC: 13.4 } } },
  { id: 'mike-evans', name: 'Mike Evans', position: 'WR', team: 'TB', bestSeason: { year: 2016, stats: { REC: 96, REC_YDS: 1521, REC_TD: 12, REC_YPC: 15.8 } } },
  { id: 'stefon-diggs', name: 'Stefon Diggs', position: 'WR', team: 'BUF', bestSeason: { year: 2020, stats: { REC: 127, REC_YDS: 1535, REC_TD: 8, REC_YPC: 12.1 } } },
  { id: 'tyreek-hill', name: 'Tyreek Hill', position: 'WR', team: 'MIA', bestSeason: { year: 2023, stats: { REC: 119, REC_YDS: 1725, REC_TD: 13, REC_YPC: 14.5 } } },
  { id: 'cooper-kupp', name: 'Cooper Kupp', position: 'WR', team: 'LAR', bestSeason: { year: 2021, stats: { REC: 145, REC_YDS: 1947, REC_TD: 16, REC_YPC: 13.4 } } },
  { id: 'aj-brown', name: 'A.J. Brown', position: 'WR', team: 'PHI', bestSeason: { year: 2022, stats: { REC: 88, REC_YDS: 1496, REC_TD: 11, REC_YPC: 17.0 } } },
  { id: 'calvin-ridley', name: 'Calvin Ridley', position: 'WR', team: 'JAX', bestSeason: { year: 2020, stats: { REC: 90, REC_YDS: 1374, REC_TD: 9, REC_YPC: 15.3 } } },
  { id: 'garrett-wilson', name: 'Garrett Wilson', position: 'WR', team: 'NYJ', bestSeason: { year: 2023, stats: { REC: 95, REC_YDS: 1107, REC_TD: 7, REC_YPC: 11.7 } } },
  { id: 'davante-adams', name: 'Davante Adams', position: 'WR', team: 'LV', bestSeason: { year: 2022, stats: { REC: 100, REC_YDS: 1516, REC_TD: 14, REC_YPC: 15.2 } } },
  { id: 'dk-metcalf', name: 'DK Metcalf', position: 'WR', team: 'SEA', bestSeason: { year: 2020, stats: { REC: 83, REC_YDS: 1303, REC_TD: 10, REC_YPC: 15.7 } } },

  { id: 'travis-kelce', name: 'Travis Kelce', position: 'TE', team: 'KC', bestSeason: { year: 2020, stats: { REC: 105, REC_YDS: 1416, REC_TD: 11, REC_YPC: 13.5 } } },
  { id: 'george-kittle', name: 'George Kittle', position: 'TE', team: 'SF', bestSeason: { year: 2018, stats: { REC: 88, REC_YDS: 1337, REC_TD: 5, REC_YPC: 15.2 } } },
  { id: 'mark-andrews', name: 'Mark Andrews', position: 'TE', team: 'BAL', bestSeason: { year: 2021, stats: { REC: 107, REC_YDS: 1363, REC_TD: 9, REC_YPC: 12.7 } } },
  { id: 'darren-waller', name: 'Darren Waller', position: 'TE', team: 'LV', bestSeason: { year: 2020, stats: { REC: 107, REC_YDS: 1196, REC_TD: 9, REC_YPC: 11.2 } } },
  { id: 't-j-hockenson', name: 'T.J. Hockenson', position: 'TE', team: 'MIN', bestSeason: { year: 2023, stats: { REC: 95, REC_YDS: 960, REC_TD: 5, REC_YPC: 10.1 } } },

  { id: 'julio-jones', name: 'Julio Jones', position: 'FLEX', team: 'ATL', bestSeason: { year: 2015, stats: { REC: 136, REC_YDS: 1877, REC_TD: 12, REC_YPC: 13.8, RUSH_YDS: 21, RUSH_TD: 0 } } },
  { id: 'bijan-robinson', name: 'Bijan Robinson', position: 'FLEX', team: 'ATL', bestSeason: { year: 2024, stats: { RUSH_YDS: 1230, RUSH_TD: 10, RUSH_ATT: 268, RUSH_YPC: 4.6, REC: 52, REC_YDS: 380, REC_TD: 2 } } },
  { id: 'devonta-smith', name: 'DeVonta Smith', position: 'FLEX', team: 'PHI', bestSeason: { year: 2022, stats: { REC: 95, REC_YDS: 1305, REC_TD: 7, REC_YPC: 13.7, RUSH_YDS: 17, RUSH_TD: 0 } } },
  { id: 'kenneth-walker', name: 'Kenneth Walker III', position: 'FLEX', team: 'SEA', bestSeason: { year: 2023, stats: { RUSH_YDS: 1059, RUSH_TD: 8, RUSH_ATT: 228, RUSH_YPC: 4.6, REC: 46, REC_YDS: 273, REC_TD: 1 } } },

  { id: 'myles-garrett', name: 'Myles Garrett', position: 'EDGE', team: 'CLE', bestSeason: { year: 2021, stats: { SACK: 16, TFL: 22, QBH: 33, TKL: 64 } } },
  { id: 'tj-watt', name: 'T.J. Watt', position: 'EDGE', team: 'PIT', bestSeason: { year: 2021, stats: { SACK: 22.5, TFL: 28, QBH: 39, TKL: 93 } } },
  { id: 'maxx-crosby', name: 'Maxx Crosby', position: 'EDGE', team: 'LV', bestSeason: { year: 2022, stats: { SACK: 12.5, TFL: 22, QBH: 28, TKL: 101 } } },
  { id: 'micah-parsons', name: 'Micah Parsons', position: 'EDGE', team: 'DAL', bestSeason: { year: 2023, stats: { SACK: 14, TFL: 20, QBH: 34, TKL: 80 } } },
  { id: 'nick-bosa', name: 'Nick Bosa', position: 'EDGE', team: 'SF', bestSeason: { year: 2022, stats: { SACK: 18.5, TFL: 24, QBH: 28, TKL: 72 } } },

  { id: 'aaron-donald', name: 'Aaron Donald', position: 'DT', team: 'LAR', bestSeason: { year: 2018, stats: { SACK: 20.5, TFL: 31, QBH: 44, TKL: 81 } } },
  { id: 'quinnen-williams', name: 'Quinnen Williams', position: 'DT', team: 'NYJ', bestSeason: { year: 2023, stats: { SACK: 12, TFL: 18, QBH: 25, TKL: 55 } } },
  { id: 'christian-wilkins', name: 'Christian Wilkins', position: 'DT', team: 'MIA', bestSeason: { year: 2023, stats: { SACK: 9, TFL: 16, QBH: 19, TKL: 88 } } },
  { id: 'jalen-carter', name: 'Jalen Carter', position: 'DT', team: 'PHI', bestSeason: { year: 2024, stats: { SACK: 9.5, TFL: 15, QBH: 25, TKL: 63 } } },

  { id: 'fred-warner', name: 'Fred Warner', position: 'LB', team: 'SF', bestSeason: { year: 2023, stats: { TKL: 130, SACK: 2.5, INT: 2, PD: 11 } } },
  { id: 'roquan-smith', name: 'Roquan Smith', position: 'LB', team: 'BAL', bestSeason: { year: 2022, stats: { TKL: 140, SACK: 4, INT: 1, PD: 8 } } },
  { id: 'demario-davis', name: 'Demario Davis', position: 'LB', team: 'NO', bestSeason: { year: 2022, stats: { TKL: 100, SACK: 5.5, INT: 1, PD: 7 } } },
  { id: 'eric-brooks', name: 'Eric Brooks', position: 'LB', team: 'TB', bestSeason: { year: 2024, stats: { TKL: 118, SACK: 3.5, INT: 2, PD: 10 } } },

  { id: 'pat-surtain', name: 'Pat Surtain II', position: 'CB', team: 'DEN', bestSeason: { year: 2023, stats: { INT: 3, PD: 18, TKL: 71, SACK: 0 } } },
  { id: 'marshon-lattimore', name: 'Marshon Lattimore', position: 'CB', team: 'NO', bestSeason: { year: 2021, stats: { INT: 5, PD: 13, TKL: 65, SACK: 0 } } },
  { id: 'darius-slay', name: 'Darius Slay', position: 'CB', team: 'PHI', bestSeason: { year: 2020, stats: { INT: 6, PD: 16, TKL: 59, SACK: 0 } } },
  { id: 'jaire-alexander', name: 'Jaire Alexander', position: 'CB', team: 'GB', bestSeason: { year: 2022, stats: { INT: 4, PD: 14, TKL: 63, SACK: 0 } } },

  { id: 'harrison-smith', name: 'Harrison Smith', position: 'S', team: 'MIN', bestSeason: { year: 2017, stats: { TKL: 104, INT: 5, PD: 15, QBH: 2 } } },
  { id: 'minkah-fitzpatrick', name: 'Minkah Fitzpatrick', position: 'S', team: 'PIT', bestSeason: { year: 2022, stats: { TKL: 96, INT: 6, PD: 10, QBH: 1 } } },
  { id: 'derwin-james', name: 'Derwin James', position: 'S', team: 'LAC', bestSeason: { year: 2022, stats: { TKL: 87, INT: 3, PD: 13, QBH: 1 } } },
  { id: 'jamal-adams', name: 'Jamal Adams', position: 'S', team: 'SEA', bestSeason: { year: 2020, stats: { TKL: 84, INT: 2, PD: 11, QBH: 1 } } },

  { id: 'jordan-pope', name: 'Jordan Pope', position: 'D-FLEX', team: 'DAL', bestSeason: { year: 2023, stats: { TKL: 97, SACK: 4, INT: 3, PD: 10 } } },
  { id: 'franklin-foy', name: 'Franklin Foy', position: 'D-FLEX', team: 'NYG', bestSeason: { year: 2022, stats: { TKL: 88, SACK: 3.5, INT: 2, PD: 9 } } },
  { id: 'malik-harrison', name: 'Malik Harrison', position: 'D-FLEX', team: 'BAL', bestSeason: { year: 2023, stats: { TKL: 71, SACK: 1.5, INT: 1, PD: 8 } } },
  { id: 'cory-robertson', name: 'Cory Robertson', position: 'D-FLEX', team: 'SEA', bestSeason: { year: 2024, stats: { TKL: 77, SACK: 2, INT: 2, PD: 10 } } }
];

const rosterStatConfig = {
  QB: [
    { key: 'PASS_YDS', label: 'YDS' },
    { key: 'PASS_TD', label: 'TD' },
    { key: 'PASS_INT', label: 'INT' },
    { key: 'RUSH_YDS', label: 'RUSH' }
  ],
  RB: [
    { key: 'RUSH_YDS', label: 'YDS' },
    { key: 'RUSH_TD', label: 'TD' },
    { key: 'RUSH_YPC', label: 'YPC' },
    { key: 'REC', label: 'REC' }
  ],
  WR: [
    { key: 'REC_YDS', label: 'YDS' },
    { key: 'REC_TD', label: 'TD' },
    { key: 'REC_YPC', label: 'YPC' },
    { key: 'REC', label: 'REC' }
  ],
  TE: [
    { key: 'REC_YDS', label: 'YDS' },
    { key: 'REC_TD', label: 'TD' },
    { key: 'REC', label: 'REC' },
    { key: 'REC_YPC', label: 'YPC' }
  ],
  FLEX: [
    { key: 'RUSH_YDS', label: 'RUSH' },
    { key: 'REC_YDS', label: 'REC YDS' },
    { key: 'REC_TD', label: 'TD' },
    { key: 'RUSH_TD', label: 'RUSH TD' }
  ],
  EDGE: [
    { key: 'SACK', label: 'SACK' },
    { key: 'TFL', label: 'TFL' },
    { key: 'QBH', label: 'QBH' },
    { key: 'TKL', label: 'TKL' }
  ],
  DT: [
    { key: 'SACK', label: 'SACK' },
    { key: 'TFL', label: 'TFL' },
    { key: 'QBH', label: 'QBH' },
    { key: 'TKL', label: 'TKL' }
  ],
  LB: [
    { key: 'TKL', label: 'TKL' },
    { key: 'SACK', label: 'SACK' },
    { key: 'INT', label: 'INT' },
    { key: 'PD', label: 'PD' }
  ],
  CB: [
    { key: 'INT', label: 'INT' },
    { key: 'PD', label: 'PD' },
    { key: 'TKL', label: 'TKL' },
    { key: 'SACK', label: 'SACK' }
  ],
  S: [
    { key: 'TKL', label: 'TKL' },
    { key: 'INT', label: 'INT' },
    { key: 'PD', label: 'PD' },
    { key: 'QBH', label: 'QBH' }
  ],
  'D-FLEX': [
    { key: 'TKL', label: 'TKL' },
    { key: 'SACK', label: 'SACK' },
    { key: 'INT', label: 'INT' },
    { key: 'PD', label: 'PD' }
  ]
};

let twentyState = null;

const ui = {
  coinCount: document.getElementById('coinCount'),
  streakCount: document.getElementById('streakCount'),
  localWinsCount: document.getElementById('localWinsCount'),
  cardCount: document.getElementById('cardCount'),
  packCount: document.getElementById('packCount'),
  passFill: document.getElementById('passFill'),
  xpValue: document.getElementById('xpValue'),
  tierValue: document.getElementById('tierValue'),
  screenTitle: document.getElementById('screenTitle'),
  modeList: document.getElementById('modeList'),
  shopGrid: document.getElementById('shopGrid'),
  localDuelContent: document.getElementById('localDuelContent'),
  gameModeContent: document.getElementById('gameModeContent'),
  titleValue: document.getElementById('titleValue'),
  profileCoins: document.getElementById('profileCoins'),
  bestStreakValue: document.getElementById('bestStreakValue')
};

const modeData = [
  { id: 'twenty', title: '20-0 Challenge', description: 'Spin the wheel, then fill a full 12-slot NFL roster built around your chosen era and team.', tag: '20-0' },
  { id: 'trivia', title: 'NFL Trivia', description: 'Answer football questions with streak-based rewards.', tag: 'IQ' },
  { id: 'guess', title: 'Guess the Player', description: 'Use clues and stat ranges to identify the right player.', tag: 'Clue' },
  { id: 'stat', title: 'Stat Attack', description: 'Answer quick stat prompts for coin rewards.', tag: 'Stats' }
];

const shopItems = [
  { id: 'avatar', name: 'Neon Avatar', cost: 250, type: 'avatar' },
  { id: 'banner', name: 'Champ Banner', cost: 700, type: 'banner' },
  { id: 'frame', name: 'Gold Frame', cost: 400, type: 'frame' }
];

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getTierAndProgress() {
  const xp = state.xp;
  let tier = 1;
  let currentFloor = 0;
  let nextGoal = 500;

  for (let i = 0; i < seasonPassThresholds.length; i += 1) {
    const threshold = seasonPassThresholds[i];
    if (xp >= threshold) {
      tier = i + 2;
      currentFloor = threshold;
      nextGoal = i + 1 < seasonPassThresholds.length ? seasonPassThresholds[i + 1] : threshold + 1000;
    }
  }

  const range = nextGoal - currentFloor;
  const progress = range > 0 ? ((xp - currentFloor) / range) * 100 : 100;
  return { tier, progress, currentFloor, nextGoal, xp };
}

function updateStats() {
  if (ui.coinCount) ui.coinCount.textContent = state.coins;
  if (ui.streakCount) ui.streakCount.textContent = state.streak;
  if (ui.localWinsCount) ui.localWinsCount.textContent = state.localWins;
  if (ui.cardCount) ui.cardCount.textContent = state.collection.length;
  if (ui.packCount) ui.packCount.textContent = state.packCount;
  if (ui.titleValue) ui.titleValue.textContent = state.profile.title;
  if (ui.profileCoins) ui.profileCoins.textContent = state.coins;
  if (ui.bestStreakValue) ui.bestStreakValue.textContent = state.bestStreak;

  const { tier, progress, nextGoal, xp } = getTierAndProgress();
  if (ui.passFill) ui.passFill.style.width = `${Math.min(progress, 100)}%`;
  if (ui.xpValue) ui.xpValue.textContent = `${xp} / ${nextGoal} XP`;
  if (ui.tierValue) ui.tierValue.textContent = tier;
}

function renderModeList() {
  if (!ui.modeList) return;
  ui.modeList.innerHTML = modeData.map((mode) => `
    <article class="mode-tile" data-mode="${mode.id}">
      <div class="mode-topline"><span class="dot ${mode.id === 'twenty' ? 'danger' : mode.id === 'trivia' ? 'info' : mode.id === 'guess' ? 'success' : 'gold'}"></span> ${mode.tag}</div>
      <h4>${mode.title}</h4>
      <p>${mode.description}</p>
    </article>
  `).join('');

  ui.modeList.querySelectorAll('.mode-tile').forEach((tile) => {
    tile.addEventListener('click', () => openMode(tile.dataset.mode));
  });
}

function renderShop() {
  if (!ui.shopGrid) return;
  ui.shopGrid.innerHTML = shopItems.map((item) => `
    <div class="shop-item">
      <h4>${item.name}</h4>
      <p>Unlock a profile upgrade for your game hub.</p>
      <button class="shop-btn" data-shop="${item.id}" data-cost="${item.cost}">Buy for ${item.cost}</button>
    </div>
  `).join('');

  ui.shopGrid.querySelectorAll('.shop-btn').forEach((btn) => {
    btn.addEventListener('click', () => buyUpgrade(btn.dataset.shop, Number(btn.dataset.cost)));
  });
}

function buyUpgrade(id, cost) {
  if (state.coins < cost) {
    alert('Not enough coins for that upgrade.');
    return;
  }

  state.coins -= cost;
  state.profile.title = id === 'avatar' ? 'Pro' : id === 'banner' ? 'All-Pro' : 'Elite';
  state.xp += 80;
  persistState();
  updateStats();
  renderShop();
  renderProfile();
}

function renderProfile() {
  if (ui.titleValue) ui.titleValue.textContent = state.profile.title;
  if (ui.profileCoins) ui.profileCoins.textContent = state.coins;
}

function getRandomWheelSelection() {
  const options = twentyWheelOptions();
  const chosen = options[Math.floor(Math.random() * options.length)];
  return chosen;
}

function twentyWheelOptions() {
  const options = [];
  teamWheel.forEach((team) => {
    eraWheel.forEach((era) => {
      options.push({ team, era, label: `${team} / ${era}` });
    });
  });
  return options;
}

function getWheelBackground() {
  const options = twentyWheelOptions();
  const slice = 360 / options.length;
  return `conic-gradient(${options.map((_, index) => `${wheelPalette[index % wheelPalette.length]} ${index * slice}deg ${(index + 1) * slice}deg`).join(', ')})`;
}

function getRosterPlayerById(playerId) {
  return rosterPlayers.find((player) => player.id === playerId) || null;
}

function getAllowedPlayers(slotLabel) {
  if (slotLabel === 'FLEX') {
    return rosterPlayers.filter((player) => ['RB', 'WR', 'TE'].includes(player.position));
  }
  if (slotLabel === 'D-FLEX') {
    return rosterPlayers.filter((player) => ['EDGE', 'DT', 'LB', 'CB', 'S'].includes(player.position));
  }
  return rosterPlayers.filter((player) => player.position === slotLabel);
}

function getStatValue(player, key) {
  if (!player || !player.bestSeason || !player.bestSeason.stats) return 0;
  return Number(player.bestSeason.stats[key] ?? 0);
}

function renderTwentyMode() {
  twentyState = {
    draft: Object.fromEntries(rosterLayout.map((slot) => [slot.id, slot.label === 'QB' ? 'tom-brady' : ''])),
    challenge: null,
    spinning: false
  };

  if (!ui.gameModeContent) return;

  ui.gameModeContent.innerHTML = `
    <div class="mode-shell twenty-shell">
      <div class="mode-header">
        <h3>20-0 Challenge</h3>
        <span class="score-tag">S+ Immortal</span>
      </div>

      <div class="grade-banner">
        <div class="grade-label">20-0 S+ IMMORTAL</div>
        <div class="grade-metrics">
          <div class="grade-stat">
            <span>OVERALL</span>
            <strong>1176 pts</strong>
          </div>
          <div class="grade-stat">
            <span>OFF</span>
            <strong>102</strong>
          </div>
          <div class="grade-stat">
            <span>DEF</span>
            <strong>100</strong>
          </div>
        </div>
      </div>

      <div class="twenty-grid">
        <div class="wheel-panel">
          <div class="wheel-wrap">
            <div class="wheel-pointer"></div>
            <div id="twentyWheel" class="twenty-wheel" style="background: ${getWheelBackground()};"></div>
            <div class="wheel-center">SPIN</div>
          </div>
          <button type="button" id="twentySpinBtn" class="primary-btn">Spin Wheel</button>
        </div>

        <div class="roster-panel">
          <div class="roster-panel-header">
            <div>2026 roster draft</div>
            <div class="roster-progress">${Object.values(twentyState.draft).filter(Boolean).length}/12</div>
          </div>
          <div id="rosterBoard" class="roster-board"></div>
        </div>
      </div>
    </div>
  `;

  const spinButton = document.getElementById('twentySpinBtn');
  const wheel = document.getElementById('twentyWheel');

  if (spinButton && wheel) {
    spinButton.addEventListener('click', () => {
      const options = twentyWheelOptions();
      const chosenIndex = Math.floor(Math.random() * options.length);
      const chosen = options[chosenIndex];
      const slice = 360 / options.length;
      const totalTurns = 7 + Math.floor(Math.random() * 5);
      const rotationBase = totalTurns * 360;
      const pointerOffset = 360 - (chosenIndex * slice + slice / 2);
      const finalRotation = rotationBase + pointerOffset;

      wheel.style.transition = 'transform 3s cubic-bezier(0.15, 0.8, 0.2, 1)';
      wheel.style.transform = `rotate(${finalRotation}deg)`;

      setTimeout(() => {
        twentyState.challenge = { team: chosen.team, era: chosen.era };
        renderTwentyBoard();
      }, 2700);
    });
  }

  renderTwentyBoard();
}

function renderTwentyBoard() {
  if (!ui.gameModeContent || !twentyState) return;

  const board = document.getElementById('rosterBoard');
  if (!board) return;

  const offenseRows = rosterLayout.filter((slot) => slot.section === 'OFFENSE');
  const defenseRows = rosterLayout.filter((slot) => slot.section === 'DEFENSE');

  const renderRows = (rows) => rows.map((slot) => {
    const selectedPlayerId = twentyState.draft[slot.id] || '';
    const selectedPlayer = getRosterPlayerById(selectedPlayerId);
    const statList = selectedPlayer ? (rosterStatConfig[selectedPlayer.position] || rosterStatConfig.FLEX) : (rosterStatConfig[slot.label] || rosterStatConfig.FLEX);

    const playerName = selectedPlayer ? `${selectedPlayer.name} / ${selectedPlayer.position}` : `${slot.label}`;
    const teamMeta = selectedPlayer ? `${selectedPlayer.team} · ${selectedPlayer.bestSeason.year}` : 'Empty slot';

    const options = getAllowedPlayers(slot.label).map((player) => `
      <option value="${player.id}" ${player.id === selectedPlayerId ? 'selected' : ''}>${player.name} · ${player.position} · ${player.team}</option>
    `).join('');

    const statCells = statList.slice(0, 4).map((stat) => `
      <div class="mini-stat">
        <span>${stat.label}</span>
        <strong>${selectedPlayer ? getStatValue(selectedPlayer, stat.key) : 0}</strong>
      </div>
    `).join('');

    return `
      <div class="roster-row">
        <div class="slot-pill">${slot.label}</div>
        <div class="roster-player-meta">
          <div class="player-name">${playerName}</div>
          <div class="player-subtitle">${teamMeta}</div>
        </div>
        <div class="roster-stats">${statCells}</div>
        <select class="player-select" data-slot="${slot.id}">
          <option value="">Select player</option>
          ${options}
        </select>
      </div>
    `;
  }).join('');

  const challengeBadge = twentyState.challenge ? `<div class="challenge-badge">${twentyState.challenge.team} · ${twentyState.challenge.era}</div>` : `<div class="challenge-badge muted">Spin the wheel</div>`;

  board.innerHTML = `
    <div class="challenge-banner">
      ${challengeBadge}
    </div>

    <div class="roster-section">
      <div class="section-header-row">OFFENSE</div>
      ${renderRows(offenseRows)}
    </div>

    <div class="roster-section">
      <div class="section-header-row">DEFENSE</div>
      ${renderRows(defenseRows)}
    </div>
  `;

  board.querySelectorAll('.player-select').forEach((select) => {
    select.addEventListener('change', (event) => {
      const slotId = event.target.dataset.slot;
      const nextValue = event.target.value;
      twentyState.draft[slotId] = nextValue;
      renderTwentyBoard();
    });
  });
}

function renderHome() {
  const homeButtons = document.querySelectorAll('.nav-btn');
  homeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === 'home');
  });

  if (ui.screenTitle) ui.screenTitle.textContent = 'Home';
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.remove('active');
  });
  const homeView = document.getElementById('homeView');
  if (homeView) homeView.classList.add('active');
}

function renderTriviaMode() {
  const prompts = [
    { question: 'Which QB won Super Bowl LVII?', choices: ['Tom Brady', 'Patrick Mahomes', 'Joe Burrow', 'Josh Allen'], answer: 1, reward: 80 },
    { question: 'Who led the NFL in rushing yards in 2023?', choices: ['Christian McCaffrey', 'Derrick Henry', 'Bijan Robinson', 'Saquon Barkley'], answer: 0, reward: 120 },
    { question: 'Which player won Defensive Player of the Year in 2023?', choices: ['Myles Garrett', 'Nick Bosa', 'Micah Parsons', 'Aaron Donald'], answer: 2, reward: 140 },
    { question: 'Who holds the single-season receiving record?', choices: ['Jerry Rice', 'JaMarr Chase', 'Tyreek Hill', 'Cooper Kupp'], answer: 0, reward: 150 }
  ];

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  if (!ui.gameModeContent) return;
  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>NFL Trivia</h3>
        <span class="score-tag">Quick</span>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>${prompt.question}</h4>
        </div>
        <div class="answer-grid">
          ${prompt.choices.map((choice, index) => `
            <button class="choice-btn" data-answer="${index}">${choice}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  ui.gameModeContent.querySelectorAll('.choice-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.answer);
      const isCorrect = selected === prompt.answer;
      if (isCorrect) {
        state.coins += prompt.reward;
        state.modeWins.trivia += 1;
        state.streak += 1;
        addXp(80);
      } else {
        state.streak = 0;
        addXp(20);
      }
      persistState();
      updateStats();
      ui.gameModeContent.innerHTML = `
        <div class="mode-shell">
          <div class="mode-header">
            <h3>NFL Trivia</h3>
          </div>
          <div class="result-banner ${isCorrect ? 'win' : 'loss'}">
            <h4>${isCorrect ? 'Correct!' : 'Close one.'}</h4>
            <p>${isCorrect ? `You earned ${prompt.reward} coins.` : `Correct answer: ${prompt.choices[prompt.answer]}`}</p>
            <button class="primary-btn small" onclick="renderTriviaMode()">Play again</button>
          </div>
        </div>
      `;
    });
  });
}

function renderGuessMode() {
  const target = { name: 'Patrick Mahomes', team: 'Chiefs', position: 'QB', era: '2020s', statRange: '4000+ passing yards', college: 'Texas Tech' };
  const guessInput = document.getElementById('guess-player-input');
  const guessButton = document.getElementById('guess-submit-btn');

  if (!ui.gameModeContent) return;
  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Guess the Player</h3>
        <span class="score-tag">3 clues</span>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>Clues</h4>
          <p>Team: Chiefs</p>
          <p>Position: QB</p>
          <p>Era: 2020s</p>
        </div>
        <div class="guess-input-row">
          <input id="guess-player-input" type="text" placeholder="Type a player name" autocomplete="off" />
          <button id="guess-submit-btn" class="primary-btn small">Guess</button>
        </div>
      </div>
    </div>
  `;

  if (guessButton) {
    guessButton.addEventListener('click', () => {
      const value = guessInput ? guessInput.value.trim() : '';
      if (!value) return;
      if (value.toLowerCase() === target.name.toLowerCase()) {
        state.coins += 250;
        state.modeWins.guess += 1;
        state.streak += 1;
        persistState();
        updateStats();
        ui.gameModeContent.innerHTML = `
          <div class="mode-shell">
            <div class="mode-header"><h3>Guess the Player</h3></div>
            <div class="result-banner win">
              <h4>You got it!</h4>
              <p>${target.name} was the correct answer. You earned 250 coins.</p>
              <button class="primary-btn small" onclick="renderGuessMode()">Play again</button>
            </div>
          </div>
        `;
      } else {
        ui.gameModeContent.innerHTML = `
          <div class="mode-shell">
            <div class="mode-header"><h3>Guess the Player</h3></div>
            <div class="result-banner loss">
              <h4>Not quite.</h4>
              <p>The correct answer was ${target.name}.</p>
              <button class="primary-btn small" onclick="renderGuessMode()">Try again</button>
            </div>
          </div>
        `;
      }
    });
  }
}

function renderStatAttackMode() {
  const prompts = [
    { prompt: 'Who led the NFL in rushing yards in 2023?', choices: ['Christian McCaffrey', 'Derrick Henry', 'Bijan Robinson', 'Saquon Barkley'], answer: 0, reward: 120 },
    { prompt: 'Which QB threw the most touchdowns in 2022?', choices: ['Patrick Mahomes', 'Joe Burrow', 'Josh Allen', 'Jalen Hurts'], answer: 0, reward: 140 },
    { prompt: 'Who led the NFL in sacks in 2023?', choices: ['Myles Garrett', 'Nick Bosa', 'T.J. Watt', 'Micah Parsons'], answer: 0, reward: 160 }
  ];

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  if (!ui.gameModeContent) return;
  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Stat Attack</h3>
        <span class="score-tag">Quick stats</span>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>${prompt.prompt}</h4>
        </div>
        <div class="answer-grid">
          ${prompt.choices.map((choice, index) => `
            <button class="choice-btn" data-answer="${index}">${choice}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  ui.gameModeContent.querySelectorAll('.choice-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.answer);
      const isCorrect = selected === prompt.answer;
      if (isCorrect) {
        state.coins += prompt.reward;
        state.modeWins.stat += 1;
        state.streak += 1;
        addXp(100);
      } else {
        state.streak = 0;
        addXp(25);
      }
      persistState();
      updateStats();
      ui.gameModeContent.innerHTML = `
        <div class="mode-shell">
          <div class="mode-header"><h3>Stat Attack</h3></div>
          <div class="result-banner ${isCorrect ? 'win' : 'loss'}">
            <h4>${isCorrect ? 'Correct!' : 'Nice try.'}</h4>
            <p>${isCorrect ? `You earned ${prompt.reward} coins.` : `Correct answer: ${prompt.choices[prompt.answer]}`}</p>
            <button class="primary-btn small" onclick="renderStatAttackMode()">Play again</button>
          </div>
        </div>
      `;
    });
  });
}

function openMode(modeId) {
  const modeMap = {
    twenty: renderTwentyMode,
    trivia: renderTriviaMode,
    guess: renderGuessMode,
    stat: renderStatAttackMode
  };

  const modeNames = {
    twenty: '20-0 Challenge',
    trivia: 'NFL Trivia',
    guess: 'Guess the Player',
    stat: 'Stat Attack'
  };

  if (ui.screenTitle) ui.screenTitle.textContent = modeNames[modeId] || 'Home';
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));
  const gameModeView = document.getElementById('gameModeView');
  if (gameModeView) gameModeView.classList.add('active');

  if (modeMap[modeId]) modeMap[modeId]();
}

function renderLocalMode() {
  if (!ui.localDuelContent) return;
  ui.localDuelContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Local Duel</h3>
        <span class="score-tag">1v1</span>
      </div>
      <div class="duel-grid">
        <div class="duel-box">
          <h4>Player 1</h4>
          <div class="score-tag">0</div>
          <textarea class="roster-text" placeholder="Enter a roster here..."></textarea>
        </div>
        <div class="duel-box">
          <h4>Player 2</h4>
          <div class="score-tag">0</div>
          <textarea class="roster-text" placeholder="Enter a roster here..."></textarea>
        </div>
      </div>
      <div class="battle-actions">
        <button type="button" class="primary-btn small" onclick="alert('Local duel scoring goes here in the next pass.')">Compare rosters</button>
      </div>
    </div>
  `;
}

function bindNavigation() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
      document.querySelectorAll('.view').forEach((el) => el.classList.remove('active'));

      const viewMap = {
        home: 'homeView',
        modes: 'modesView',
        profile: 'profileView',
        local: 'localView'
      };

      const targetId = viewMap[view];
      if (!targetId) return;
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');
      if (ui.screenTitle) ui.screenTitle.textContent = button.textContent;

      if (targetId === 'modesView') renderModeList();
      if (targetId === 'profileView') renderProfile();
      if (targetId === 'localView') renderLocalMode();
    });
  });

  document.querySelectorAll('[data-mode]').forEach((el) => {
    if (!el.classList.contains('nav-btn')) {
      el.addEventListener('click', () => openMode(el.dataset.mode));
    }
  });
}

function addXp(amount) {
  state.xp += amount;
}

function bootstrap() {
  renderModeList();
  renderShop();
  renderProfile();
  bindNavigation();
  updateStats();
  renderHome();
}

bootstrap();
