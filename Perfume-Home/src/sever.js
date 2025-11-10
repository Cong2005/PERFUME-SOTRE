import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import rateLimit from 'express-rate-limit';

const app = express();
const db = new Database('auth.db'); // file SQLite sẽ được tạo cùng thư mục

// --- DB init ---
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// --- Middleware ---
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// Giới hạn tần suất cho /api/auth/*
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', authLimiter);

// --- Helpers ---
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

const authRequired = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// --- Auth routes ---
// Đăng ký (tùy bạn dùng hay khóa ở prod)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu username/password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu >= 6 ký tự' });
    }
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    stmt.run(username, hash);
    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      return res.status(409).json({ message: 'Username đã tồn tại' });
    }
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Thiếu username/password' });
  }
  const row = db.prepare('SELECT * FROM users WHERE username=?').get(username);
  if (!row) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

  const token = signToken({ uid: row.id, username: row.username });
  return res.json({ token, user: { id: row.id, username: row.username } });
});

// Lấy thông tin user hiện tại (test token)
app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ user: { id: req.user.uid, username: req.user.username } });
});

// (Tuỳ chọn) route bảo vệ để test
app.get('/api/secure/ping', authRequired, (req, res) => {
  res.json({ ok: true, who: req.user.username, time: new Date().toISOString() });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Auth server running on', port));
