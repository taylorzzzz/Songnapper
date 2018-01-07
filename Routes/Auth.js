const routes = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const KEYS = require('../keys');
const CALLBACK_URL = '/auth/google/callback';

const User = require('../Models/User');


passport.serializeUser( (user, done) => {
  console.log('serializeUser');
  done(null, user._id);
});

passport.deserializeUser( (id, done) => {
  console.log('deserializeUser');
  User.findById(id).then(user => {
    done(null, user);
  })
})

passport.use(new GoogleStrategy({
    clientID: KEYS.googleClientID,
    clientSecret: KEYS.googleClientSecret,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('back over in GoogleStrategy callback');

    User.findOne({google_ID: profile.id})
      .then(user => {
        if (user) {
          console.log('user exists');
          done(null, user);
        } else {
          new User({google_ID: profile.id}).save()
            .then(user => {
              done(null, user);
            })
        }
      })
      .catch(err => {
        console.log('err', err);
      })
  }
));

//     /auth routes

// When user clicks sign in with google button

routes.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Callback URL for google auth
routes.get('/google/callback', passport.authenticate('google'));

// End point route after we have 
routes.get('/current_user', (req, res) => {
  res.json(req.user);
}) 

routes.get('/logout', (req, res) => {
  console.log(req);
  req.logout();
  res.json(req.user);
})

module.exports = routes;