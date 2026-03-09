module.exports = {
  name: '001_create_users_table',

  async up(pool) {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)  NOT NULL,
        email       VARCHAR(255)  NOT NULL UNIQUE,
        password    VARCHAR(255)  NOT NULL,
        phone       VARCHAR(50)   DEFAULT '',
        details     TEXT,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  },

  async down(pool) {
    await pool.execute('DROP TABLE IF EXISTS users');
  },
};
