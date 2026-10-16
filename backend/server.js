const express = require('express');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const CRICKET_FILE = path.join(DATA_DIR, 'cricket.json');
const FOOTBALL_FILE = path.join(DATA_DIR, 'football.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rand(0, arr.length - 1)];

const cricketTeams = ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand', 'Sri Lanka', 'West Indies', 'Bangladesh', 'Afghanistan'];
const iplTeams = ['Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Delhi Capitals', 'Rajasthan Royals', 'Sunrisers Hyderabad', 'Punjab Kings', 'Gujarat Titans', 'Lucknow Super Giants'];
const footballTeams = ['Brazil', 'Argentina', 'France', 'Germany', 'Spain', 'England', 'Italy', 'Netherlands', 'Portugal', 'Uruguay', 'Belgium', 'Croatia', 'Mexico', 'USA', 'Japan', 'South Korea', 'Morocco', 'Senegal', 'Nigeria', 'Egypt'];
const footballClubs = ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Manchester City', 'Chelsea', 'Arsenal', 'Bayern Munich', 'Borussia Dortmund', 'PSG', 'Juventus', 'Inter Milan', 'AC Milan', 'Ajax', 'Porto', 'Benfica'];
const venuesCricket = ['Melbourne Cricket Ground', "Lord's, London", 'Eden Gardens, Kolkata', 'Wankhede Stadium, Mumbai', 'Sydney Cricket Ground', 'Newlands, Cape Town', 'Narendra Modi Stadium, Ahmedabad', 'Gaddafi Stadium, Lahore'];
const venuesFootball = ['Estadio Azteca', 'Wembley Stadium', 'Santiago Bernabéu', 'Camp Nou', 'Maracanã', 'Allianz Arena', 'Parc des Princes', 'San Siro', 'Old Trafford', 'Anfield'];
const firstNames = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'K.', 'M.', 'R.', 'S.', 'T.', 'V.', 'L.', 'J.', 'P.', 'N.'];
const lastNames = ['Khan', 'Smith', 'Sharma', 'Warner', 'Kohli', 'Root', 'Williamson', 'Taylor', 'Ali', 'Buttler', 'Rashid', 'Stokes', 'Rohit', 'Bumrah', 'Cummins', 'Starc', 'Babar', 'Rizwan', 'Shaheen', 'Southee', 'Silva', 'Fernandes', 'Garcia', 'Martinez', 'Lopez'];

const CAPTAINS = {
  cricket: {
    'India': { '2010': 'MS Dhoni', '2015': 'MS Dhoni', '2019': 'Virat Kohli', '2023': 'Rohit Sharma', '2026': 'Rohit Sharma' },
    'Australia': { '2010': 'Ricky Ponting', '2015': 'Michael Clarke', '2019': 'Aaron Finch', '2023': 'Pat Cummins', '2026': 'Pat Cummins' },
    'England': { '2010': 'Andrew Strauss', '2015': 'Eoin Morgan', '2019': 'Eoin Morgan', '2023': 'Jos Buttler', '2026': 'Jos Buttler' },
    'Pakistan': { '2010': 'Shahid Afridi', '2015': 'Misbah-ul-Haq', '2019': 'Sarfaraz Ahmed', '2023': 'Babar Azam', '2026': 'Babar Azam' },
    'South Africa': { '2010': 'Graeme Smith', '2015': 'AB de Villiers', '2019': 'Faf du Plessis', '2023': 'Temba Bavuma', '2026': 'Temba Bavuma' },
    'New Zealand': { '2010': 'Daniel Vettori', '2015': 'Brendon McCullum', '2019': 'Kane Williamson', '2023': 'Kane Williamson', '2026': 'Kane Williamson' },
    'Sri Lanka': { '2010': 'Kumar Sangakkara', '2015': 'Angelo Mathews', '2019': 'Dimuth Karunaratne', '2023': 'Dasun Shanaka', '2026': 'Dasun Shanaka' },
    'West Indies': { '2010': 'Chris Gayle', '2015': 'Jason Holder', '2019': 'Jason Holder', '2023': 'Shai Hope', '2026': 'Shai Hope' },
    'Bangladesh': { '2010': 'Shakib Al Hasan', '2015': 'Mashrafe Mortaza', '2019': 'Mashrafe Mortaza', '2023': 'Shakib Al Hasan', '2026': 'Najmul Hossain Shanto' },
    'Afghanistan': { '2010': 'Mohammad Nabi', '2015': 'Mohammad Nabi', '2019': 'Gulbadin Naib', '2023': 'Hashmatullah Shahidi', '2026': 'Hashmatullah Shahidi' }
  },
  football: {
    'Brazil': { '2010': 'Dunga', '2014': 'Luiz Felipe Scolari', '2018': 'Tite', '2022': 'Tite', '2026': 'Dorival Júnior' },
    'Argentina': { '2010': 'Diego Maradona', '2014': 'Alejandro Sabella', '2018': 'Jorge Sampaoli', '2022': 'Lionel Scaloni', '2026': 'Lionel Scaloni' },
    'France': { '2010': 'Raymond Domenech', '2014': 'Didier Deschamps', '2018': 'Didier Deschamps', '2022': 'Didier Deschamps', '2026': 'Didier Deschamps' },
    'Germany': { '2010': 'Joachim Löw', '2014': 'Joachim Löw', '2018': 'Joachim Löw', '2022': 'Hansi Flick', '2026': 'Julian Nagelsmann' },
    'Spain': { '2010': 'Vicente del Bosque', '2014': 'Vicente del Bosque', '2018': 'Fernando Hierro', '2022': 'Luis Enrique', '2026': 'Luis de la Fuente' },
    'England': { '2010': 'Fabio Capello', '2014': 'Roy Hodgson', '2018': 'Gareth Southgate', '2022': 'Gareth Southgate', '2026': 'Thomas Tuchel' },
    'Italy': { '2010': 'Marcello Lippi', '2014': 'Cesare Prandelli', '2018': '—', '2022': '—', '2026': 'Luciano Spalletti' },
    'Netherlands': { '2010': 'Bert van Marwijk', '2014': 'Louis van Gaal', '2018': '—', '2022': 'Louis van Gaal', '2026': 'Ronald Koeman' },
    'Portugal': { '2010': 'Carlos Queiroz', '2014': 'Paulo Bento', '2018': 'Fernando Santos', '2022': 'Fernando Santos', '2026': 'Roberto Martínez' },
    'Uruguay': { '2010': 'Óscar Tabárez', '2014': 'Óscar Tabárez', '2018': 'Óscar Tabárez', '2022': 'Diego Alonso', '2026': 'Marcelo Bielsa' },
    'Belgium': { '2010': 'Dick Advocaat', '2014': 'Marc Wilmots', '2018': 'Roberto Martínez', '2022': 'Roberto Martínez', '2026': 'Domenico Tedesco' },
    'Croatia': { '2010': 'Slaven Bilić', '2014': 'Niko Kovač', '2018': 'Zlatko Dalić', '2022': 'Zlatko Dalić', '2026': 'Zlatko Dalić' },
    'Mexico': { '2010': 'Javier Aguirre', '2014': 'Miguel Herrera', '2018': 'Juan Carlos Osorio', '2022': 'Gerardo Martino', '2026': 'Javier Aguirre' },
    'USA': { '2010': 'Bob Bradley', '2014': 'Jürgen Klinsmann', '2018': '—', '2022': 'Gregg Berhalter', '2026': 'Mauricio Pochettino' },
    'Japan': { '2010': 'Takeshi Okada', '2014': 'Alberto Zaccheroni', '2018': 'Akira Nishino', '2022': 'Hajime Moriyasu', '2026': 'Hajime Moriyasu' },
    'South Korea': { '2010': 'Huh Jung-moo', '2014': 'Hong Myung-bo', '2018': 'Shin Tae-yong', '2022': 'Paulo Bento', '2026': 'Hong Myung-bo' },
    'Morocco': { '2010': 'Eric Gerets', '2014': 'Badou Zaki', '2018': 'Hervé Renard', '2022': 'Walid Regragui', '2026': 'Walid Regragui' },
    'Senegal': { '2010': 'Amara Traoré', '2014': 'Alain Giresse', '2018': 'Aliou Cissé', '2022': 'Aliou Cissé', '2026': 'Aliou Cissé' },
    'Nigeria': { '2010': 'Lars Lagerbäck', '2014': 'Stephen Keshi', '2018': 'Gernot Rohr', '2022': 'Augustine Eguavoen', '2026': 'Eric Chelle' },
    'Egypt': { '2010': 'Hassan Shehata', '2014': 'Shawky Gharib', '2018': 'Héctor Cúper', '2022': 'Carlos Queiroz', '2026': 'Hossam Hassan' }
  }
};

function getCaptain(sport, team, year) {
  const map = CAPTAINS[sport]?.[team];
  if (!map) return '—';
  const years = Object.keys(map).map(Number).sort((a, b) => a - b);
  let best = null;
  for (const y of years) {
    if (y <= year) best = y;
    else if (!best) { best = y; break; }
  }
  return best ? map[String(best)] : '—';
}

function getCategories(sport, gender, year) {
  if (sport === 'cricket') {
    if (gender === 'male' && year >= 2001 && year <= 2030) {
      const c = [{ name: 'ODI', count: rand(80, 140) }, { name: 'Test', count: rand(30, 55) }, { name: 'T20I', count: rand(40, 80) }];
      if (year >= 2008) c.push({ name: 'IPL', count: rand(50, 74) });
      return c;
    }
    if (gender === 'female' && year >= 2003 && year <= 2030) {
      return [{ name: 'WODI', count: rand(30, 60) }, { name: 'WT20I', count: rand(25, 50) }];
    }
  } else {
    if (gender === 'male' && year >= 1930 && year <= 2030) {
      const c = [];
      if ((year - 1930) % 4 === 0) c.push({ name: 'World Cup', count: 64 });
      if ((year - 1960) % 4 === 0 && year >= 1960) c.push({ name: 'Euro Cup', count: 51 });
      if ((year - 1916) % 4 === 0 && year >= 1916) c.push({ name: 'Copa América', count: 32 });
      if ((year - 1956) % 4 === 0 && year >= 1956) c.push({ name: 'AFC Asian Cup', count: 32 });
      c.push({ name: 'International Friendly', count: rand(60, 150) });
      c.push({ name: 'Club League', count: rand(100, 250) });
      if (year >= 1992) c.push({ name: 'UEFA Champions League', count: rand(80, 125) });
      return c;
    }
    if (gender === 'female' && year >= 1991 && year <= 2030) {
      const c = [];
      if ((year - 1991) % 4 === 0) c.push({ name: "Women's World Cup", count: 52 });
      c.push({ name: "Women's International Friendly", count: rand(30, 80) });
      c.push({ name: "Women's Club League", count: rand(40, 100) });
      return c;
    }
  }
  return [];
}

function genMatch(category, year, sport) {
  const day = String(rand(1, 28)).padStart(2, '0');
  const month = String(rand(1, 12)).padStart(2, '0');
  const m = { date: `${day}-${month}-${year}`, category, year };

  if (sport === 'cricket') {
    m.venue = pick(venuesCricket);
    if (category === 'IPL') {
      m.team1 = pick(iplTeams);
      do { m.team2 = pick(iplTeams); } while (m.team2 === m.team1);
      m.result = `${m.team1} won by ${rand(1, 60)} runs`;
      m.topBat = pick(firstNames) + ' ' + pick(lastNames); m.runs = rand(45, 120); m.balls = rand(30, 60);
      m.topBowl = pick(firstNames) + ' ' + pick(lastNames); m.wickets = rand(2, 5); m.overs = rand(3, 4) + '.' + rand(0, 5);
    } else {
      m.team1 = pick(cricketTeams);
      do { m.team2 = pick(cricketTeams); } while (m.team2 === m.team1);
      m.result = `${m.team1} won by ${rand(2, 8)} wickets`;
      m.topBat = pick(firstNames) + ' ' + pick(lastNames); m.runs = rand(60, 180); m.balls = rand(50, 150);
      m.topBowl = pick(firstNames) + ' ' + pick(lastNames); m.wickets = rand(3, 6); m.overs = rand(8, 10) + '.' + rand(0, 5);
    }
    m.captain1 = getCaptain('cricket', m.team1, year);
    m.captain2 = getCaptain('cricket', m.team2, year);
  } else {
    m.venue = pick(venuesFootball);
    if (category.includes('Club') || category.includes('Champions')) {
      m.team1 = pick(footballClubs);
      do { m.team2 = pick(footballClubs); } while (m.team2 === m.team1);
    } else {
      m.team1 = pick(footballTeams);
      do { m.team2 = pick(footballTeams); } while (m.team2 === m.team1);
    }
    const s1 = rand(0, 4), s2 = rand(0, 4);
    m.result = s1 > s2 ? `${m.team1} won ${s1}-${s2}` : (s2 > s1 ? `${m.team2} won ${s2}-${s1}` : `Draw ${s1}-${s2}`);
    m.goals = [];
    for (let g = 0, n = s1 + s2; g < n && g < 6; g++) {
      m.goals.push({ player: pick(firstNames) + ' ' + pick(lastNames), minute: rand(5, 90) });
    }
    if (m.goals.length === 0) m.goals.push({ player: '—', minute: '—' });
    m.captain1 = getCaptain('football', m.team1, year);
    m.captain2 = getCaptain('football', m.team2, year);
  }
  return m;
}

function rebuildSportData(sport, file) {
  const all = { version: 2, lastUpdated: null, matches: [] };
  const currentYear = new Date().getFullYear();
  const startYear = sport === 'cricket' ? 2001 : 1930;

  for (let year = startYear; year <= currentYear; year++) {
    for (const gender of ['male', 'female']) {
      const cats = getCategories(sport, gender, year);
      for (const cat of cats) {
        const count = Math.min(cat.count, 40);
        for (let i = 0; i < count; i++) {
          const m = genMatch(cat.name, year, sport);
          m.gender = gender;
          all.matches.push(m);
        }
      }
    }
  }
  all.lastUpdated = new Date().toLocaleDateString('en-GB');
  fs.writeFileSync(file, JSON.stringify(all, null, 2));
  console.log(`✅ ${sport} ডেটা: ${all.matches.length} ম্যাচ, তারিখ ${all.lastUpdated}`);
  return all;
}

cron.schedule('0 3 * * *', () => {
  console.log('🔄 অটো আপডেট শুরু...');
  rebuildSportData('cricket', CRICKET_FILE);
  rebuildSportData('football', FOOTBALL_FILE);
});

function ensureData() {
  try {
    const c = JSON.parse(fs.readFileSync(CRICKET_FILE, 'utf8'));
    if (!c.matches || c.matches.length === 0 || c.version !== 2) rebuildSportData('cricket', CRICKET_FILE);
  } catch (e) { rebuildSportData('cricket', CRICKET_FILE); }
  try {
    const f = JSON.parse(fs.readFileSync(FOOTBALL_FILE, 'utf8'));
    if (!f.matches || f.matches.length === 0 || f.version !== 2) rebuildSportData('football', FOOTBALL_FILE);
  } catch (e) { rebuildSportData('football', FOOTBALL_FILE); }
}
ensureData();

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/api/last-updated', (req, res) => {
  try {
    const c = JSON.parse(fs.readFileSync(CRICKET_FILE, 'utf8'));
    const f = JSON.parse(fs.readFileSync(FOOTBALL_FILE, 'utf8'));
    const dates = [c.lastUpdated, f.lastUpdated].filter(Boolean);
    res.json({ date: dates[0] || new Date().toLocaleDateString('en-GB') });
  } catch (e) { res.json({ date: new Date().toLocaleDateString('en-GB') }); }
});

app.get('/api/:sport/:gender/:year', (req, res) => {
  const { sport, gender, year } = req.params;
  const file = sport === 'cricket' ? CRICKET_FILE : FOOTBALL_FILE;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const filtered = data.matches.filter(m => m.gender === gender && m.year === parseInt(year));
    const grouped = {};
    filtered.forEach(m => { grouped[m.category] = (grouped[m.category] || 0) + 1; });
    const categories = Object.keys(grouped).map(name => ({ name, count: grouped[name] }));
    res.json({ categories });
  } catch (e) { res.json({ categories: [] }); }
});

app.get('/api/:sport/:gender/:year/:category', (req, res) => {
  const { sport, gender, year, category } = req.params;
  const file = sport === 'cricket' ? CRICKET_FILE : FOOTBALL_FILE;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const matches = data.matches.filter(m =>
      m.gender === gender &&
      m.year === parseInt(year) &&
      m.category === decodeURIComponent(category)
    );
    res.json({ matches });
  } catch (e) { res.json({ matches: [] }); }
});

app.get('/api/refresh', (req, res) => {
  rebuildSportData('cricket', CRICKET_FILE);
  rebuildSportData('football', FOOTBALL_FILE);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Sports HistoryX চালু: http://localhost:${PORT}`);
});