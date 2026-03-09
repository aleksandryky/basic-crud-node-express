const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readAll() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeAll(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function findByEmail(email) {
  return readAll().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findById(id) {
  return readAll().find((u) => u.id === id);
}

/**
 * Create a new user. Returns the safe user object (no password) or null if
 * the email is already taken.
 */
function create({ name, email, password, phone, details }) {
  if (findByEmail(email)) return null;

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    phone: (phone || '').trim(),
    details: (details || '').trim(),
    createdAt: new Date().toISOString(),
  };

  const users = readAll();
  users.push(newUser);
  writeAll(users);

  return stripPassword(newUser);
}

/**
 * Verify credentials. Returns the safe user object or null.
 */
function authenticate(email, password) {
  const user = findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) return null;
  return stripPassword(user);
}

function stripPassword(user) {
  const { password, ...safe } = user;
  return safe;
}

module.exports = {
  readAll,
  findByEmail,
  findById,
  create,
  authenticate,
};
