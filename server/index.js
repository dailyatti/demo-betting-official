import express from 'express';
import cors from 'cors';
import { randomBytes } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Simple JSON file storage
const DATA_DIR = join(__dirname, 'data');
const DB_FILE = join(DATA_DIR, 'db.json');
const KEYS_FILE = join(DATA_DIR, 'keys.json');

ensureDataFiles();

function ensureDataFiles() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, JSON.stringify({ tipstersData: {}, bets: [] }, null, 2));
  if (!existsSync(KEYS_FILE)) writeFileSync(KEYS_FILE, JSON.stringify({ keys: [] }, null, 2));
}

function readDB() {
  return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function readKeys() {
  return JSON.parse(readFileSync(KEYS_FILE, 'utf-8'));
}

function writeKeys(data) {
  writeFileSync(KEYS_FILE, JSON.stringify(data, null, 2));
}

// API-key middleware
function requireApiKey(req, res, next) {
  const header = req.get('x-api-key') || req.query.apiKey;
  if (!header) return res.status(401).json({ error: 'API key required' });
  const { keys } = readKeys();
  if (!keys.includes(header)) return res.status(403).json({ error: 'Invalid API key' });
  next();
}

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Generate API key
app.post('/api/keys', (req, res) => {
  const { keys } = readKeys();
  const key = randomBytes(24).toString('hex');
  keys.push(key);
  writeKeys({ keys });
  res.json({ apiKey: key });
});

// Get current state (for sync)
app.get('/api/state', requireApiKey, (req, res) => {
  res.json(readDB());
});

// Replace state (dangerous)
app.put('/api/state', requireApiKey, (req, res) => {
  const { tipstersData, bets } = req.body || {};
  if (!tipstersData || !bets) return res.status(400).json({ error: 'tipstersData and bets required' });
  writeDB({ tipstersData, bets });
  res.json({ ok: true });
});

// Clear state
app.delete('/api/state', requireApiKey, (req, res) => {
  writeDB({ tipstersData: {}, bets: [] });
  res.json({ ok: true });
});

// Append a single bet
app.post('/api/bets', requireApiKey, (req, res) => {
  const { bet } = req.body || {};
  if (!bet || !bet.tipster || !bet.sport || !bet.team || !bet.betAmount || !bet.odds) {
    return res.status(400).json({ error: 'Missing bet fields' });
  }
  const db = readDB();
  const normalized = normalizeBet(bet);
  db.bets.push(normalized);
  writeDB(db);
  res.json({ ok: true, bet: normalized });
});

// Append multiple bets
app.post('/api/bets/bulk', requireApiKey, (req, res) => {
  const { bets } = req.body || {};
  if (!Array.isArray(bets)) return res.status(400).json({ error: 'bets array required' });
  const db = readDB();
  const inserted = [];
  for (const b of bets) {
    if (!b || !b.tipster || !b.sport || !b.team || !b.betAmount || !b.odds) continue;
    const normalized = normalizeBet(b);
    db.bets.push(normalized);
    inserted.push(normalized);
  }
  writeDB(db);
  res.json({ ok: true, count: inserted.length, bets: inserted });
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function normalizeBet(b) {
  return {
    id: b.id || generateId(),
    tipster: String(b.tipster),
    sport: String(b.sport),
    team: String(b.team),
    betAmount: Number(b.betAmount),
    odds: Number(b.odds),
    outcome: b.outcome === 'win' || b.outcome === 'lose' ? b.outcome : 'pending',
    date: b.date ? new Date(b.date).toISOString() : new Date().toISOString(),
    notes: b.notes ? String(b.notes) : ''
  };
}

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


