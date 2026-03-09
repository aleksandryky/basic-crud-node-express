const User = require('../models/User');

exports.getSignup = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('signup', { error: null });
};

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password, phone, details } = req.body;

    if (!name || !email || !password) {
      return res.render('signup', {
        error: 'Name, email and password are required.',
        name: name || '',
        email: email || '',
        phone: phone || '',
        details: details || '',
      });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.render('signup', {
        error: 'An account with this email already exists.',
        name: name.trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        details: (details || '').trim(),
      });
    }

    const user = await User.create({ name, email, password, phone, details });

    if (!user) {
      return res.render('signup', { error: 'Could not create account. Try again.' });
    }

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    res.render('signup', { error: 'Something went wrong. Please try again.' });
  }
};

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required.' });
    }

    const user = await User.authenticate(email, password);
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
