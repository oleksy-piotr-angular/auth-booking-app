//mock-auth.js
const cors = require('cors');
const express    = require('express');
const bodyParser = require('body-parser');
const jwt        = require('jsonwebtoken');
const fs          = require('fs');
const path        = require('path');

const DB_PATH            = path.resolve(__dirname, 'db.json');
const ENABLE_PERSISTENCE = process.env.PERSIST_DB === 'true';

const app = express();
app.use(cors({ origin: [
  'http://localhost:4200',
  'http://localhost:4201',
  'http://localhost:4202',
  'http://localhost:4203',
  'http://localhost:4204'
] }));
app.use(bodyParser.json());

const SECRET = 'dev-jwt-secret';

// Helper to load the full DB
function loadDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[LOGIN] payload:', req.body);
  }

  // always read the latest users
  const { users } = loadDb();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ accessToken: token, user: { id: user.id, email: user.email } });
});

// Protected profile endpoint
app.get('/api/users/:id', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token      = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    if (payload.sub !== +req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // reload latest users
    const { users } = loadDb();
    const user = users.find(u => u.id === payload.sub);
    res.json(user);

  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Register endpoint with optional persistence
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[REGISTER] payload:', req.body);
  }

  const db = loadDb();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const newUser = {
    id:       db.users.length + 1,
    email,
    password,
    name:     name || email.split('@')[0]
  };

  db.users.push(newUser);

  if (ENABLE_PERSISTENCE) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('[REGISTER] user persisted to db.json');
  }

  const token = jwt.sign(
    { sub: newUser.id, email: newUser.email },
    SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({
    accessToken: token,
    user:        { id: newUser.id, email: newUser.email }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔐 Mock auth server listening at http://localhost:${PORT}`);
});