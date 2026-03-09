const { pool } = require('../config/database');

exports.index = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) AS count FROM users');
    const totalUsers = rows[0].count;
    res.render('dashboard', { user: req.session.user, totalUsers });
  } catch {
    res.render('dashboard', { user: req.session.user, totalUsers: 0 });
  }
};

exports.users = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, created_at FROM users ORDER BY id DESC'
    );
    res.render('users', { user: req.session.user, users });
  } catch {
    res.render('users', { user: req.session.user, users: [] });
  }
};

exports.activity = (req, res) => {
  res.render('activity', { user: req.session.user });
};

exports.settings = (req, res) => {
  res.render('settings', { user: req.session.user });
};
