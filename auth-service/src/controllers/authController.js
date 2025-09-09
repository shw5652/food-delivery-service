import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

// store valid refresh tokens (in-memory for now, ideally in DB/Redis)
let refreshTokens = [];

/**
 * Signup
 */
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const userCheck = await pool.query(
      'SELECT * FROM app_auth.users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO app_auth.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userQuery = await pool.query(
      'SELECT * FROM app_auth.users WHERE email = $1',
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateToken(
      { id: user.id, email: user.email },
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    refreshTokens.push(newRefreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Current user
 */
export async function currUser(req, res) {
  try {
    const userId = req.user && req.user.id; // fixed
    if (!userId) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM app_auth.users WHERE id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('currUser error:', err);
    return res.status(500).json({ error: 'internal_server_error' });
  }
}

/**
 * Refresh token
 */
export const refresh = (req, res) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const accessToken = generateToken(
      { id: decoded.id, email: decoded.email },
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Expired refresh token' });
  }
};

/**
 * Logout
 */
export const logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.json({ message: 'Logged out successfully' });
};
