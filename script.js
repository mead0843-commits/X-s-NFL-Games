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
    local: 0
  }
};

const state = loadState();
const seasonPassThresholds = [500, 1100, 1800, 2900, 4300, 6200, 8700, 12000];
const teamWheel = ['Chiefs', 'Bills', '49ers', 'Eagles', 'Cowboys', 'Patriots', 'Ravens', 'Giants', 'Bengals', 'Dolphins'];
const eraWheel = ['1980s', '1990s', '2000s', '2010s', '2020s'];

const modeData = [
  {
    id: 'twenty',
    title: '20-0 Challenge',
    description: 'Spin the wheel for a team and era, then load the best players by position to complete a lineup.',
    tag: '20-0'
  },
  {
    id: 'trivia',
    title: 'NFL Trivia',
    description: 'Answer football questions with difficulty-based payouts and streak power-ups.',
    tag: 'IQ'
  },
  {
    id: 'guess',
    title: 'Guess the Player',
    description: 'Use clues like position, team, era, and stat range to guess the right player in few attempts.',
    tag: 'Clue'
  },
  {
    id: 'packs',
    title: 'Ultimate Team',
    description: 'Spend coins on packs, collect players, and build your dream roster.',
    tag: 'Cards'
  },
  {
    id: 'local',
    title: 'Local Duel',
    description: 'Head-to-head couch challenge: no internet needed, just bragging rights and coins.',
    tag: '2P'
  }
];

const triviaBank = [
  { question: 'Which QB won Super Bowl LVII?', choices: ['Tom Brady', 'Patrick Mahomes', 'Joe Burrow', 'Josh Allen'], correct: 1, difficulty: 'Pro' },
  { question: 'Who holds the single-season rushing record?', choices: ['Adrian Peterson', 'Eric Dickerson', 'Barry Sanders', 'Saquon Barkley'], correct: 1, difficulty: 'All-Pro' },
  { question: 'How many points is a touchdown worth?', choices: ['3', '6', '7', '8'], correct: 1, difficulty: 'Rookie' },
  { question: 'Which team won Super Bowl XLIX?', choices: ['Ravens', 'Patriots', 'Eagles', 'Seahawks'], correct: 1, difficulty: 'Pro' },
  { question: 'Which player is the all-time NFL leader in career receptions?', choices: ['Larry Fitzgerald', 'Jerry Rice', 'Julio Jones', 'Tony Gonzalez'], correct: 0, difficulty: 'All-Pro' },
  { question: 'Who won the 2023 NFL Defensive Player of the Year award?', choices: ['Myles Garrett', 'Nick Bosa', 'Micah Parsons', 'Aaron Donald'], correct: 2, difficulty: 'All-Pro' },
  { question: 'Which quarterback threw for 5,000 yards in 1984?', choices: ['Dan Marino', 'Joe Montana', 'John Elway', 'Warren Moon'], correct: 0, difficulty: 'Hall of Fame' },
  { question: 'Which receiver recorded 1,964 receiving yards in a single season?', choices: ['Calvin Johnson', 'Julio Jones', 'Andre Johnson', 'Stefon Diggs'], correct: 0, difficulty: 'Legend' },
  { question: 'Which franchise has the most Super Bowl titles in NFL history?', choices: ['Cowboys', 'Steelers', 'Patriots', '49ers'], correct: 2, difficulty: 'Legend' },
  { question: 'Who is the all-time leader in NFL rushing yards?', choices: ['Emmitt Smith', 'Walter Payton', 'Barry Sanders', 'Adrian Peterson'], correct: 0, difficulty: 'Hall of Fame' },
  { question: 'Which player was nicknamed “The Refrigerator”?', choices: ['William “The Refrigerator” Perry', 'Bubba Smith', 'Nose tackle Joe Greene', 'Richard Dent'], correct: 0, difficulty: 'Legend' },
  { question: 'Which team won Super Bowl XXXIV?', choices: ['Rams', 'Patriots', 'Saints', 'Bengals'], correct: 0, difficulty: 'Champion' },
  { question: 'Which quarterback owns the NFL record for most passing touchdowns in a single season?', choices: ['Tom Brady', 'Peyton Manning', 'Patrick Mahomes', 'Brett Favre'], correct: 0, difficulty: 'Hall of Fame' },
  { question: 'Who was the first overall pick in the 2024 NFL Draft?', choices: ['Caleb Williams', 'Drake Maye', 'Jayden Daniels', 'Marvin Harrison Jr.'], correct: 0, difficulty: 'Champion' },
  { question: 'Which player had the longest touchdown reception in NFL history?', choices: ['Randy Moss', 'Tyreek Hill', 'DeSean Jackson', 'J.J. Nelson'], correct: 1, difficulty: 'Legend' },
  { question: 'Who is the only player to win NFL MVP in both the AFC and NFC as a quarterback after 2010?', choices: ['Tom Brady', 'Patrick Mahomes', 'Aaron Rodgers', 'Joe Burrow'], correct: 1, difficulty: 'Champion' }
];

const playerPool = [
  { name: 'Patrick Mahomes', position: 'QB', team: 'Chiefs', era: '2020s', college: 'Texas Tech', statRange: '4000+ passing yards', rating: 98, number: 15 },
  { name: 'Joe Burrow', position: 'QB', team: 'Bengals', era: '2020s', college: 'LSU', statRange: '3500+ passing yards', rating: 92, number: 9 },
  { name: 'Tom Brady', position: 'QB', team: 'Patriots', era: '2000s', college: 'Michigan', statRange: '4000+ passing yards', rating: 96, number: 12 },
  { name: 'Lamar Jackson', position: 'QB', team: 'Ravens', era: '2020s', college: 'Louisville', statRange: '3500+ passing yards', rating: 94, number: 8 },
  { name: 'Josh Allen', position: 'QB', team: 'Bills', era: '2020s', college: 'Wyoming', statRange: '3500+ passing yards', rating: 93, number: 17 },
  { name: 'Christian McCaffrey', position: 'RB', team: '49ers', era: '2020s', college: 'Stanford', statRange: '1200+ rushing yards', rating: 96, number: 23 },
  { name: 'Barry Sanders', position: 'RB', team: 'Lions', era: '1990s', college: 'Oklahoma State', statRange: '1500+ rushing yards', rating: 94, number: 20 },
  { name: 'Eric Dickerson', position: 'RB', team: 'Rams', era: '1980s', college: 'SMU', statRange: '1500+ rushing yards', rating: 93, number: 33 },
  { name: 'Derrick Henry', position: 'RB', team: 'Ravens', era: '2020s', college: 'Alabama', statRange: '1300+ rushing yards', rating: 92, number: 22 },
  { name: 'Adrian Peterson', position: 'RB', team: 'Vikings', era: '2010s', college: 'Oklahoma', statRange: '1400+ rushing yards', rating: 91, number: 28 },
  { name: 'JaMarr Chase', position: 'WR', team: 'Bengals', era: '2020s', college: 'LSU', statRange: '1200+ receiving yards', rating: 92, number: 1 },
  { name: 'Tyreek Hill', position: 'WR', team: 'Dolphins', era: '2020s', college: 'West Alabama', statRange: '1200+ receiving yards', rating: 94, number: 10 },
  { name: 'Jerry Rice', position: 'WR', team: '49ers', era: '1980s', college: 'Mississippi Valley State', statRange: '1500+ receiving yards', rating: 99, number: 80 },
  { name: 'Randy Moss', position: 'WR', team: 'Patriots', era: '2000s', college: 'Marshall', statRange: '1300+ receiving yards', rating: 97, number: 81 },
  { name: 'Calvin Johnson', position: 'WR', team: 'Lions', era: '2010s', college: 'Georgia Tech', statRange: '1400+ receiving yards', rating: 96, number: 81 },
  { name: 'Travis Kelce', position: 'TE', team: 'Chiefs', era: '2020s', college: 'Cincinnati', statRange: '1000+ receiving yards', rating: 94, number: 87 },
  { name: 'Tony Gonzalez', position: 'TE', team: 'Chiefs', era: '2000s', college: 'California', statRange: '1000+ receiving yards', rating: 90, number: 88 },
  { name: 'George Kittle', position: 'TE', team: '49ers', era: '2020s', college: 'Iowa', statRange: '900+ receiving yards', rating: 91, number: 85 },
  { name: 'Rob Gronkowski', position: 'TE', team: 'Patriots', era: '2010s', college: 'Arizona', statRange: '900+ receiving yards', rating: 91, number: 87 },
  { name: 'Trent Williams', position: 'LT', team: 'Commanders', era: '2020s', college: 'Oklahoma', statRange: '90+ pass block grade', rating: 97, number: 71 },
  { name: 'Quenton Nelson', position: 'LG', team: 'Colts', era: '2020s', college: 'Notre Dame', statRange: '90+ pass block grade', rating: 95, number: 56 },
  { name: 'Jason Kelce', position: 'C', team: 'Eagles', era: '2020s', college: 'Cincinnati', statRange: '90+ PFF grade', rating: 95, number: 62 },
  { name: 'Zack Martin', position: 'RG', team: 'Cowboys', era: '2020s', college: 'Notre Dame', statRange: '90+ PFF grade', rating: 96, number: 75 },
  { name: 'Lane Johnson', position: 'RT', team: 'Eagles', era: '2020s', college: 'Oklahoma', statRange: '90+ pass block grade', rating: 96, number: 65 },
  { name: 'Myles Garrett', position: 'EDGE', team: 'Browns', era: '2020s', college: 'Texas A&M', statRange: '12+ sacks', rating: 96, number: 95 },
  { name: 'J.J. Watt', position: 'EDGE', team: 'Texans', era: '2010s', college: 'Wisconsin', statRange: '15+ sacks', rating: 96, number: 99 },
  { name: 'T.J. Watt', position: 'EDGE', team: 'Steelers', era: '2020s', college: 'Wisconsin', statRange: '14+ sacks', rating: 94, number: 90 },
  { name: 'Khalil Mack', position: 'EDGE', team: 'Bears', era: '2010s', college: 'Buffalo', statRange: '12+ sacks', rating: 93, number: 52 },
  { name: 'Aaron Donald', position: 'DT', team: 'Rams', era: '2020s', college: 'Pittsburgh', statRange: '12+ sacks', rating: 98, number: 99 },
  { name: 'Cameron Heyward', position: 'DT', team: 'Steelers', era: '2020s', college: 'Ohio State', statRange: '8+ sacks', rating: 92, number: 97 },
  { name: 'Reggie White', position: 'DT', team: 'Eagles', era: '1990s', college: 'Tennessee', statRange: '15+ sacks', rating: 95, number: 92 },
  { name: 'Lawrence Taylor', position: 'LB', team: 'Giants', era: '1980s', college: 'North Carolina', statRange: '15+ sacks', rating: 98, number: 58 },
  { name: 'Ray Lewis', position: 'LB', team: 'Ravens', era: '2000s', college: 'Miami', statRange: '150+ tackles', rating: 96, number: 52 },
  { name: 'Bobby Wagner', position: 'LB', team: 'Seahawks', era: '2010s', college: 'Utah State', statRange: '150+ tackles', rating: 92, number: 54 },
  { name: 'Luke Kuechly', position: 'LB', team: 'Panthers', era: '2010s', college: 'Boston College', statRange: '140+ tackles', rating: 93, number: 59 },
  { name: 'Patrick Surtain II', position: 'CB', team: 'Broncos', era: '2020s', college: 'Alabama', statRange: '5+ INTs', rating: 95, number: 2 },
  { name: 'Darrelle Revis', position: 'CB', team: 'Jets', era: '2010s', college: 'Pittsburgh', statRange: '5+ INTs', rating: 94, number: 24 },
  { name: 'Jalen Ramsey', position: 'CB', team: 'Dolphins', era: '2020s', college: 'Florida State', statRange: '4+ INTs', rating: 93, number: 5 },
  { name: 'Nnamdi Asomugha', position: 'CB', team: 'Raiders', era: '2000s', college: 'California', statRange: '6+ INTs', rating: 92, number: 21 },
  { name: 'Ed Reed', position: 'S', team: 'Ravens', era: '2000s', college: 'Miami', statRange: '8+ INTs', rating: 95, number: 20 },
  { name: 'Troy Polamalu', position: 'S', team: 'Steelers', era: '2010s', college: 'USC', statRange: '5+ INTs', rating: 92, number: 43 },
  { name: 'Earl Thomas', position: 'S', team: 'Seahawks', era: '2010s', college: 'Texas', statRange: '6+ INTs', rating: 92, number: 29 },
  { name: 'Justin Tucker', position: 'K', team: 'Ravens', era: '2020s', college: 'Texas', statRange: '90% FG', rating: 96, number: 9 },
  { name: 'David Akers', position: 'K', team: 'Eagles', era: '2010s', college: 'Louisville', statRange: '85% FG', rating: 90, number: 2 },
  { name: 'Matt Gay', position: 'K', team: 'Rams', era: '2020s', college: 'Rice', statRange: '88% FG', rating: 88, number: 9 },
  { name: 'Jake Bailey', position: 'P', team: 'Dolphins', era: '2020s', college: 'Stanford', statRange: '45+ yard avg', rating: 86, number: 7 },
  { name: 'A.J. Cole III', position: 'P', team: 'Raiders', era: '2020s', college: 'NC State', statRange: '46+ yard avg', rating: 84, number: 6 },
  { name: 'Braden Mann', position: 'P', team: 'Jets', era: '2020s', college: 'Texas A&M', statRange: '44+ yard avg', rating: 82, number: 2 },
  { name: 'Russell Wilson', position: 'QB', team: 'Bills', era: '2020s', college: 'Wisconsin', statRange: '3500+ passing yards', rating: 89, number: 3 },
  { name: 'Peyton Manning', position: 'QB', team: 'Colts', era: '2000s', college: 'Tennessee', statRange: '4000+ passing yards', rating: 97, number: 18 },
  { name: 'Joe Montana', position: 'QB', team: '49ers', era: '1980s', college: 'Notre Dame', statRange: '3500+ passing yards', rating: 95, number: 16 },
  { name: 'Saquon Barkley', position: 'RB', team: 'Giants', era: '2020s', college: 'Penn State', statRange: '1100+ rushing yards', rating: 90, number: 26 },
  { name: 'Marshawn Lynch', position: 'RB', team: 'Seahawks', era: '2010s', college: 'California', statRange: '1000+ rushing yards', rating: 90, number: 24 },
  { name: 'DeAndre Hopkins', position: 'WR', team: 'Texans', era: '2010s', college: 'Clemson', statRange: '1100+ receiving yards', rating: 92, number: 10 },
  { name: 'Stefon Diggs', position: 'WR', team: 'Bills', era: '2020s', college: 'Maryland', statRange: '1000+ receiving yards', rating: 91, number: 14 },
  { name: 'Mike Evans', position: 'WR', team: 'Buccaneers', era: '2020s', college: 'Texas A&M', statRange: '1100+ receiving yards', rating: 90, number: 13 }
];

const packCatalog = [
  {
    id: 'starter',
    name: 'Starter Pack',
    cost: 120,
    odds: { common: 0.54, rare: 0.3, elite: 0.12, legendary: 0.04 },
    description: 'Balanced pack with a small shot at premium names.'
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    cost: 220,
    odds: { common: 0.62, rare: 0.24, elite: 0.1, legendary: 0.04 },
    description: 'More expensive, but the higher-tier hits are intentionally rare.'
  },
  {
    id: 'allpro',
    name: 'All-Pro Pack',
    cost: 420,
    odds: { common: 0.68, rare: 0.2, elite: 0.09, legendary: 0.03 },
    description: 'Tougher pull odds, built for players chasing elite cards.'
  },
  {
    id: 'legend',
    name: 'Legend Pack',
    cost: 850,
    odds: { common: 0.74, rare: 0.16, elite: 0.08, legendary: 0.02 },
    description: 'The hardest pack to crack; legends are deliberate and scarce.'
  }
];

let selectedPackId = 'starter';

const shopItems = [
  { id: 'avatar', name: 'Neon Avatar', cost: 250, type: 'avatar' },
  { id: 'banner', name: 'Champ Banner', cost: 700, type: 'banner' },
  { id: 'frame', name: 'Gold Frame', cost: 400, type: 'frame' }
];

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
  collectionGrid: document.getElementById('collectionGrid'),
  shopGrid: document.getElementById('shopGrid'),
  localDuelContent: document.getElementById('localDuelContent'),
  gameModeContent: document.getElementById('gameModeContent'),
  packInventory: document.getElementById('packInventory'),
  titleValue: document.getElementById('titleValue'),
  profileCoins: document.getElementById('profileCoins'),
  bestStreakValue: document.getElementById('bestStreakValue')
};

let twentyState = null;

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

function addCoins(amount) {
  state.coins += amount;
}

function addXp(amount) {
  state.xp += amount;
}

function updateStats() {
  ui.coinCount.textContent = state.coins;
  ui.streakCount.textContent = state.streak;
  ui.localWinsCount.textContent = state.localWins;
  ui.cardCount.textContent = state.collection.length;
  ui.packCount.textContent = state.packCount;
  ui.packInventory.textContent = state.packCount;
  ui.titleValue.textContent = state.profile.title;
  ui.profileCoins.textContent = state.coins;
  ui.bestStreakValue.textContent = state.bestStreak;

  const { tier, progress, nextGoal, xp } = getTierAndProgress();
  ui.passFill.style.width = `${Math.min(progress, 100)}%`;
  ui.xpValue.textContent = `${xp} / ${nextGoal} XP`;
  ui.tierValue.textContent = tier;
}

function renderModeList() {
  ui.modeList.innerHTML = modeData
    .map((mode) => `
      <article class="mode-tile" data-mode="${mode.id}">
        <div class="mode-topline"><span class="dot ${mode.id === 'twenty' ? 'danger' : mode.id === 'trivia' ? 'info' : mode.id === 'guess' ? 'success' : mode.id === 'packs' ? 'gold' : 'blue'}"></span> ${mode.tag}</div>
        <h4>${mode.title}</h4>
        <p>${mode.description}</p>
      </article>
    `)
    .join('');

  ui.modeList.querySelectorAll('.mode-tile').forEach((tile) => {
    tile.addEventListener('click', () => openMode(tile.dataset.mode));
  });
}

function renderCollection() {
  ui.collectionGrid.innerHTML = state.collection
    .map((card) => `
      <div class="card-tile ${card.rarity}">
        <div class="card-rarity">${card.rarity}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-stats">
          <span>Team: ${card.team}</span>
          <span>Pos: ${card.position}</span>
          <span>Rating: ${card.rating}</span>
        </div>
      </div>
    `)
    .join('');
}

function renderShop() {
  ui.shopGrid.innerHTML = shopItems
    .map((item) => `
      <div class="shop-item">
        <h4>${item.name}</h4>
        <p>Unlock a profile upgrade for your game hub.</p>
        <button class="shop-btn" data-shop="${item.id}" data-cost="${item.cost}">Buy for ${item.cost}</button>
      </div>
    `)
    .join('');

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
  addXp(80);
  persistState();
  updateStats();
  renderShop();
  renderProfile();
}

function renderProfile() {
  ui.titleValue.textContent = state.profile.title;
  ui.profileCoins.textContent = state.coins;
}

function openMode(modeId) {
  const noGameMap = {
    twenty: renderTwentyMode,
    trivia: renderTriviaMode,
    guess: renderGuessMode,
    packs: renderPackMode,
    local: renderLocalMode
  };

  if (modeId === 'packs') {
    document.querySelector('[data-view="team"]').click();
    return;
  }

  document.getElementById('screenTitle').textContent = modeId === 'twenty' ? '20-0 Challenge' : modeId === 'trivia' ? 'NFL Trivia' : modeId === 'guess' ? 'Guess the Player' : 'Local Duel';
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));
  document.getElementById('gameModeView').classList.add('active');

  if (noGameMap[modeId]) {
    noGameMap[modeId]();
  }
}

function getTwentyChallenge() {
  const team = teamWheel[Math.floor(Math.random() * teamWheel.length)];
  const era = eraWheel[Math.floor(Math.random() * eraWheel.length)];

  const positions = ['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'EDGE', 'DT', 'LB', 'CB', 'S', 'K', 'P'];
  const slots = positions.map((position) => {
    const candidates = playerPool
      .filter((player) => player.position === position)
      .filter((player) => player.team === team || player.era === era)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    const filler = playerPool
      .filter((player) => player.position === position)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    const options = candidates.length >= 4 ? candidates : filler;

    return { position, options: options.slice(0, 4) };
  });

  return { team, era, slots, target: 390 };
}

function renderTwentyMode() {
  twentyState = {
    challenge: getTwentyChallenge(),
    selections: {},
    total: 0
  };

  renderTwentyBoard();
}

function renderTwentyBoard() {
  const challenge = twentyState.challenge;
  const selectedCount = Object.keys(twentyState.selections).length;
  const isComplete = selectedCount === challenge.slots.length;

  const slotCards = challenge.slots.map((slot) => {
    const selected = twentyState.selections[slot.position];
    const buttons = slot.options.map((player) => {
      const isSelected = selected && selected.name === player.name;
      return `
        <button class="slot-choice ${isSelected ? 'selected' : ''}" data-position="${slot.position}" data-player="${player.name}">
          ${player.name} (${player.rating})
        </button>
      `;
    }).join('');

    return `
      <div class="slot-card">
        <div class="slot-head">
          <span class="slot-label">${slot.position}</span>
          ${selected ? `<span class="slot-picked">${selected.name}</span>` : '<span class="slot-picked muted">Open</span>'}
        </div>
        <div class="slot-options">${buttons}</div>
      </div>
    `;
  }).join('');

  if (isComplete) {
    const reward = Math.max(90, twentyState.total * 2);
    state.coins += reward;
    state.modeWins.twenty += 1;
    state.streak = Math.max(state.streak + 1, 1);
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    addXp(180 + twentyState.total);
    persistState();
    updateStats();

    ui.gameModeContent.innerHTML = `
      <div class="mode-shell">
        <div class="mode-header">
          <h3>20-0 Challenge</h3>
          <span class="score-tag">${challenge.team} / ${challenge.era}</span>
        </div>
        <div class="result-banner win">
          <h4>Lineup complete</h4>
          <p>You built a ${challenge.team} ${challenge.era} lineup with ${twentyState.total} total points and earned ${reward} coins.</p>
          <button class="primary-btn small" onclick="renderTwentyMode()">Spin again</button>
        </div>
      </div>
    `;
    return;
  }

  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>20-0 Challenge</h3>
        <span class="score-tag">${challenge.team} / ${challenge.era}</span>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>Wheel landed on ${challenge.team} in the ${challenge.era}</h4>
          <p>Choose the best player for each position to build the lineup and hit the target.</p>
        </div>
        <div class="wheel-result">
          <div class="wheel-badge">${challenge.team}</div>
          <div class="wheel-badge secondary">${challenge.era}</div>
        </div>
        <div class="slot-grid">${slotCards}</div>
      </div>
    </div>
  `;

  ui.gameModeContent.querySelectorAll('.slot-choice').forEach((button) => {
    button.addEventListener('click', () => {
      const playerName = button.dataset.player;
      const position = button.dataset.position;
      const player = challenge.slots
        .find((slot) => slot.position === position)
        .options.find((candidate) => candidate.name === playerName);

      if (!player) return;

      twentyState.selections[position] = player;
      twentyState.total = Object.values(twentyState.selections).reduce((sum, item) => sum + item.rating, 0);

      renderTwentyBoard();
    });
  });
}

function drawTriviaQuestion() {
  const weighted = [...triviaBank];
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function renderTriviaMode() {
  const trivia = drawTriviaQuestion();

  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>NFL Trivia</h3>
        <span class="score-tag">${trivia.difficulty}</span>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>${trivia.question}</h4>
        </div>
        <div class="answer-grid">
          ${trivia.choices.map((choice, index) => `
            <button class="choice-btn" data-correct="${index === trivia.correct}">${choice}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  ui.gameModeContent.querySelectorAll('.choice-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const isCorrect = button.dataset.correct === 'true';
      const payout = trivia.difficulty === 'Rookie' ? 50 : trivia.difficulty === 'Pro' ? 80 : trivia.difficulty === 'All-Pro' ? 120 : trivia.difficulty === 'Hall of Fame' ? 160 : trivia.difficulty === 'Legend' ? 220 : 200;
      if (isCorrect) {
        state.coins += payout;
        state.streak += 1;
        state.modeWins.trivia += 1;
        addXp(100 + payout / 2);
        button.classList.add('correct');
      } else {
        state.streak = 0;
        button.classList.add('wrong');
        addXp(25);
        const correctBtn = [...ui.gameModeContent.querySelectorAll('.choice-btn')].find((el) => el.dataset.correct === 'true');
        if (correctBtn) correctBtn.classList.add('correct');
      }
      persistState();
      updateStats();
      setTimeout(() => {
        ui.gameModeContent.innerHTML = `
          <div class="mode-shell">
            <div class="mode-header">
              <h3>NFL Trivia</h3>
            </div>
            <div class="result-banner ${isCorrect ? 'win' : 'loss'}">
              <h4>${isCorrect ? 'Correct!' : 'Close one.'}</h4>
              <p>${isCorrect ? `You earned ${payout} coins.` : 'The answer was revealed above.'}</p>
              <button class="primary-btn small" onclick="renderTriviaMode()">Try another</button>
            </div>
          </div>
        `;
      }, 450);
    });
  });
}

function renderGuessMode() {
  const target = playerPool[Math.floor(Math.random() * playerPool.length)];
  let guesses = 0;
  const maxGuesses = 5;

  const renderBoard = (guessesMade) => {
    const rows = guessesMade.map((guess) => {
      const isTeam = guess.team === target.team;
      const isPosition = guess.position === target.position;
      const isEra = guess.era === target.era;
      const isCollege = guess.college === target.college;
      const isStatRange = guess.statRange === target.statRange;

      const cells = [
        { label: guess.name, hit: guess.name === target.name },
        { label: isTeam ? 'Team ✓' : guess.team, hit: isTeam },
        { label: isPosition ? 'Pos ✓' : guess.position, hit: isPosition },
        { label: isEra ? 'Era ✓' : guess.era, hit: isEra }
      ];

      return `
        <div class="guess-row">
          ${cells.map((cell) => `<div class="guess-cell ${cell.hit ? 'hit' : ''}">${cell.label}</div>`).join('')}
        </div>
      `;
    }).join('');

    ui.gameModeContent.innerHTML = `
      <div class="mode-shell">
        <div class="mode-header">
          <h3>Guess the Player</h3>
          <span class="score-tag">${maxGuesses - guesses} left</span>
        </div>
        <div class="game-panel">
          <div class="prompt-box">
            <h4>Clues</h4>
            <p>Team: ${target.team} • Position: ${target.position} • Era: ${target.era} • Stat Range: ${target.statRange}</p>
          </div>
          <div class="guess-board">
            ${rows}
          </div>
          <div class="answer-grid">
            ${playerPool.map((player) => `<button class="guess-btn" data-name="${player.name}">${player.name}</button>`).join('')}
          </div>
        </div>
      </div>
    `;

    ui.gameModeContent.querySelectorAll('.guess-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.name;
        guesses += 1;
        const guessedPlayer = playerPool.find((p) => p.name === chosen);

        if (chosen === target.name) {
          const scoreBonus = Math.max(100, 260 - (guesses * 30));
          state.coins += scoreBonus;
          state.modeWins.guess += 1;
          addXp(120 + scoreBonus / 3);
          state.streak += 1;
          persistState();
          updateStats();
          ui.gameModeContent.innerHTML = `
            <div class="mode-shell">
              <div class="mode-header">
                <h3>Guess the Player</h3>
              </div>
              <div class="result-banner win">
                <h4>You got it!</h4>
                <p>${target.name} was the player. You earned ${scoreBonus} coins.</p>
                <button class="primary-btn small" onclick="renderGuessMode()">Play again</button>
              </div>
            </div>
          `;
          return;
        }

        const list = (guessesMade || []).concat(guessedPlayer);
        if (guesses >= maxGuesses) {
          state.streak = 0;
          persistState();
          updateStats();
          ui.gameModeContent.innerHTML = `
            <div class="mode-shell">
              <div class="mode-header">
                <h3>Guess the Player</h3>
              </div>
              <div class="result-banner loss">
                <h4>Out of guesses</h4>
                <p>The player was ${target.name}. Better luck next round.</p>
                <button class="primary-btn small" onclick="renderGuessMode()">Try again</button>
              </div>
            </div>
          `;
          return;
        }

        renderBoard(list);
      });
    });
  };

  renderBoard([]);
}

function getPackById(packId) {
  return packCatalog.find((pack) => pack.id === packId) || packCatalog[0];
}

function drawPackRarity(pack) {
  const roll = Math.random();
  let cursor = 0;
  const entries = Object.entries(pack.odds);

  for (const [rarity, chance] of entries) {
    cursor += chance;
    if (roll <= cursor) {
      return rarity;
    }
  }

  return 'common';
}

function renderPackMode() {
  const selectedPack = getPackById(selectedPackId);

  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Ultimate Team</h3>
        <button class="primary-btn small" id="packOpenBtn">Open ${selectedPack.name}</button>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>Pack Room</h4>
          <p>Spend your hard-earned coins on packs and build a legendary roster. Higher-tier packs are intentionally harder to crack.</p>
        </div>
        <div class="pack-picker">
          ${packCatalog.map((pack) => `
            <button class="pack-choice ${selectedPack.id === pack.id ? 'selected' : ''}" data-pack="${pack.id}">
              <strong>${pack.name}</strong>
              <span>${pack.cost} coins</span>
              <small>${pack.description}</small>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  ui.gameModeContent.querySelectorAll('.pack-choice').forEach((button) => {
    button.addEventListener('click', () => {
      selectedPackId = button.dataset.pack;
      renderPackMode();
    });
  });

  const openButton = document.getElementById('packOpenBtn');
  if (openButton) {
    openButton.addEventListener('click', () => openPack(selectedPackId));
  }
}

function openPack(packId = selectedPackId) {
  const pack = getPackById(packId);

  if (state.coins < pack.cost) {
    alert(`You need ${pack.cost} coins to open a ${pack.name}.`);
    return;
  }

  state.coins -= pack.cost;
  state.packCount += 1;
  const rarity = drawPackRarity(pack);

  const candidate = playerPool[Math.floor(Math.random() * playerPool.length)];
  const rarityBoost = {
    common: 0,
    rare: 10,
    elite: 18,
    legendary: 28
  };

  const card = {
    name: candidate.name,
    team: candidate.team,
    position: candidate.position,
    rarity,
    rating: Math.min(99, candidate.rating + (rarityBoost[rarity] || 0) + Math.floor(Math.random() * 9))
  };

  state.collection.push(card);
  state.packsOpened += 1;
  addXp(60 + (rarity === 'legendary' ? 120 : rarity === 'elite' ? 80 : rarity === 'rare' ? 40 : 20));
  persistState();
  updateStats();
  renderCollection();
  renderPackMode();

  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Ultimate Team</h3>
      </div>
      <div class="result-banner win">
        <h4>${card.name} unlocked</h4>
        <p>${card.team} • ${card.position} • ${card.rarity} • ${card.rating} OVR</p>
        <button class="primary-btn small" onclick="renderPackMode()">Open another</button>
      </div>
    </div>
  `;
}

function renderLocalMode() {
  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Local Duel</h3>
        <button class="primary-btn small" onclick="startLocalDuel()">Start Match</button>
      </div>
      <div class="game-panel">
        <div class="prompt-box">
          <h4>Two-player couch mode</h4>
          <p>Each player answers the same prompt on the same device. Highest score wins.</p>
        </div>
      </div>
    </div>
  `;
}

function startLocalDuel() {
  const duelQuestion = {
    prompt: 'Who had more receiving yards in the 2023 season?',
    choices: ['JaMarr Chase', 'Tyreek Hill', 'Stefon Diggs', 'A.J. Brown'],
    answer: 1
  };

  ui.gameModeContent.innerHTML = `
    <div class="mode-shell">
      <div class="mode-header">
        <h3>Local Duel</h3>
      </div>
      <div class="duel-grid">
        <div class="duel-box">
          <h4>Player One</h4>
          <div class="score-tag">Score: 0</div>
          <div class="prompt-box">
            <h4>${duelQuestion.prompt}</h4>
          </div>
          <div class="answer-grid">
            ${duelQuestion.choices.map((choice, index) => `<button class="choice-btn" data-player="1" data-choice="${index}">${choice}</button>`).join('')}
          </div>
        </div>
        <div class="duel-box">
          <h4>Player Two</h4>
          <div class="score-tag">Score: 0</div>
          <div class="prompt-box">
            <h4>${duelQuestion.prompt}</h4>
          </div>
          <div class="answer-grid">
            ${duelQuestion.choices.map((choice, index) => `<button class="choice-btn" data-player="2" data-choice="${index}">${choice}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  let scores = { 1: 0, 2: 0 };
  const duoBoxes = [...ui.gameModeContent.querySelectorAll('.duel-box')];
  const choiceButtons = ui.gameModeContent.querySelectorAll('.choice-btn');

  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const player = Number(button.dataset.player);
      const choice = Number(button.dataset.choice);
      const isCorrect = choice === duelQuestion.answer;
      if (isCorrect) {
        scores[player] += 1;
      }

      const scoreTag = duoBoxes[player - 1].querySelector('.score-tag');
      scoreTag.textContent = `Score: ${scores[player]}`;

      button.classList.add(isCorrect ? 'correct' : 'wrong');

      const done = choiceButtons.length > 0 && [...choiceButtons].every((el) => el.classList.contains('correct') || el.classList.contains('wrong'));
      if (done) {
        const winner = scores[1] === scores[2] ? 'Tie' : scores[1] > scores[2] ? 'Player One' : 'Player Two';
        const reward = winner === 'Tie' ? 75 : 150;

        if (winner !== 'Tie') {
          state.coins += reward;
          state.localWins += 1;
          state.modeWins.local += 1;
          state.streak += 1;
          addXp(120);
        }

        persistState();
        updateStats();

        ui.gameModeContent.innerHTML = `
          <div class="mode-shell">
            <div class="mode-header">
              <h3>Local Duel</h3>
            </div>
            <div class="result-banner ${winner === 'Tie' ? 'loss' : 'win'}">
              <h4>${winner === 'Tie' ? 'Draw Game' : `${winner} wins!`}</h4>
              <p>${winner === 'Tie' ? 'No coins were awarded this time.' : `Reward: ${reward} coins.`}</p>
              <button class="primary-btn small" onclick="renderLocalMode()">Rematch</button>
            </div>
          </div>
        `;
      }
    });
  });
}

function renderHome() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === 'home');
  });

  document.getElementById('screenTitle').textContent = 'Home';
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.remove('active');
  });
  document.getElementById('homeView').classList.add('active');
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
        team: 'teamView',
        profile: 'profileView',
        local: 'localView'
      };

      const targetId = viewMap[view];
      if (!targetId) return;
      document.getElementById(targetId).classList.add('active');
      document.getElementById('screenTitle').textContent = button.textContent;

      if (targetId === 'modesView') {
        renderModeList();
      }
      if (targetId === 'teamView') {
        renderCollection();
      }
      if (targetId === 'profileView') {
        renderProfile();
      }
      if (targetId === 'localView') {
        renderLocalMode();
      }
    });
  });

  document.querySelectorAll('[data-mode]').forEach((el) => {
    if (!el.classList.contains('nav-btn')) {
      el.addEventListener('click', () => openMode(el.dataset.mode));
    }
  });

  document.getElementById('openPackBtn').addEventListener('click', () => openPack(selectedPackId));
}

function bootstrap() {
  renderModeList();
  renderCollection();
  renderShop();
  renderLocalMode();
  bindNavigation();
  updateStats();
  renderHome();
}

bootstrap();
