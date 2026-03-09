const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new user. Returns the safe user object (no password) or null if
 * the email is already taken.
 */
async function create({ name, email, password, phone, details }) {
  const existing = await findByEmail(email);
  if (existing) return null;

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password, phone, details)
     VALUES (?, ?, ?, ?, ?)`,
    [
      name.trim(),
      email.trim().toLowerCase(),
      hashedPassword,
      (phone || '').trim(),
      (details || '').trim(),
    ]
  );

  const user = await findById(result.insertId);
  return stripPassword(user);
}

/**
 * Verify credentials. Returns the safe user object or null.
 */
async function authenticate(email, password) {
  const user = await findByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return stripPassword(user);
}

function stripPassword(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

module.exports = {
  findByEmail,
  findById,
  create,
  authenticate,
};
