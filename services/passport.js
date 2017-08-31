const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); // fetch users model class

passport.serializeUser((user, done) => { // includes user.id into cookie
  done(null, user.id);
});

passport.deserializeUser((id, done) => { // extracts id from cookie, finds logged in user with the id
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, 
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if(existingUser)
        // User exists already, do nothing
        return done(null, existingUser); // Args: null = no errors, existingUser = here is the user
       
      
      // User doesn't exist
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);


