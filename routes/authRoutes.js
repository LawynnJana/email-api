const passport = require('passport');

module.exports = app  => {
  app.get(
  '/auth/google', // pass google auth as route, then calls the call back url
   passport.authenticate('google', { // new GoogleStrategy(from above) uses 'google' as id 
    scope: ['profile', 'email'] // asks google for user's profile and email
  })); // gets code

  app.get(
    '/auth/google/callback', 
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );
  
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })
}

