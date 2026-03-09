require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('./database');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function ensureMigrationsTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL UNIQUE,
      run_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getCompletedMigrations() {
  const [rows] = await pool.execute('SELECT name FROM migrations ORDER BY id');
  return rows.map((r) => r.name);
}

function loadMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.js'))
    .sort()
    .map((f) => require(path.join(MIGRATIONS_DIR, f)));
}

async function runMigrations() {
  await ensureMigrationsTable();

  const completed = await getCompletedMigrations();
  const all = loadMigrationFiles();
  const pending = all.filter((m) => !completed.includes(m.name));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  for (const migration of pending) {
    console.log(`Running migration: ${migration.name}`);
    await migration.up(pool);
    await pool.execute('INSERT INTO migrations (name) VALUES (?)', [migration.name]);
    console.log(`  ✓ ${migration.name}`);
  }

  console.log(`${pending.length} migration(s) completed.`);
}

async function rollbackLast() {
  await ensureMigrationsTable();

  const completed = await getCompletedMigrations();
  if (completed.length === 0) {
    console.log('Nothing to rollback.');
    return;
  }

  const lastName = completed[completed.length - 1];
  const all = loadMigrationFiles();
  const migration = all.find((m) => m.name === lastName);

  if (!migration) {
    console.error(`Migration file for "${lastName}" not found.`);
    return;
  }

  console.log(`Rolling back: ${migration.name}`);
  await migration.down(pool);
  await pool.execute('DELETE FROM migrations WHERE name = ?', [migration.name]);
  console.log(`  ✓ Rolled back ${migration.name}`);
}

const command = process.argv[2];

(async () => {
  try {
    if (command === 'down' || command === 'rollback') {
      await rollbackLast();
    } else {
      await runMigrations();
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
