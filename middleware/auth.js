/**
 * Redirect to login if user is not in session.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

module.exports = { requireAuth };
