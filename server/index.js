const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3010;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data', 'scenes');
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, '..');
const MAX_BODY_BYTES = process.env.MAX_BODY_BYTES || '1mb';

fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: MAX_BODY_BYTES }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function sceneFile(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

function createId() {
  return crypto.randomBytes(5).toString('base64url');
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/scenes', (req, res) => {
  const data = req.body?.data;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid scene payload' });
  }

  const id = createId();
  const payload = {
    id,
    createdAt: new Date().toISOString(),
    data,
  };

  fs.writeFileSync(sceneFile(id), JSON.stringify(payload));
  res.status(201).json({ id });
});

app.get('/api/scenes/:id', (req, res) => {
  const id = req.params.id;
  if (!/^[A-Za-z0-9_-]{6,24}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid scene id' });
  }
  const file = sceneFile(id);
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: 'Scene not found' });
  }
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  res.json(payload);
});

app.use(express.static(STATIC_DIR, { extensions: ['html'] }));

app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VitreoSketch backend listening on port ${PORT}`);
});
