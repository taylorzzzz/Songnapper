const routes = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;


const KEYS = require('../keys');
const CALLBACK_URL = '/auth/google/callback';

const User = require('../Models/User');






// these are middleware function for passport
passport.serializeUser( (user, done) => {
  done(null, user._id);
});
passport.deserializeUser( (id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  })
})




/******************* GOOGLE STRATEGY *******************/

// Set up the GoogleStrategy 
passport.use(new GoogleStrategy({
    clientID: KEYS.googleClientID,
    clientSecret: KEYS.googleClientSecret,
    callbackURL: "/auth/google/callback",
  },
  async ( accessToken, refreshToken, profile, done) => {
    console.log('inside GoogleStrategy');
    // find or create a new user
    const existingUser = await User.findOne({google_ID: profile.id});
    if (existingUser) { 
      return done(null, existingUser) 
    }   
    const newUser = await new User(
      { 
        google_ID: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        display_name: profile.displayName,
       }).save();
    return done(null, newUser);
  }
));

// ********* ROUTE HANDLERS
routes.get(
  '/google/callback', 
  passport.authenticate('google'),
  (req, res) => {
    res.redirect(req.session.returnTo);
  }
  );

routes.get(['/google/:referer/:id', '/google/:referer', '/google'], (req, res, next) => {
  // set returnTo route
  req.session.returnTo = req.params.referer ? "/" + req.params.referer : "/";
  req.session.returnTo += req.params.id ? "/" + req.params.id : "";

  passport.authenticate('google', { scope: ['profile']})(req, res, next);
});





/******************* LOCAL STRATEGY *******************/
// login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {
  // This function is the "verify callback" which checks if the user is logged in
  User.findOne({email: email})
    .then(user => {
      if (!user) {  
        console.log('user with that email does not exist');
        return done(null, false); 
      }
      if (!(user.password === password)) { return done(null, false); }
      console.log('successful login');
      return done(null, user); 
    })
    .catch(err => {console.log(err, 'there was an error with the findOne query')});
}));
// register
passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {
  // This function is the "verify callback"
  console.log(req.body);
  User.findOne({email: email})
    .then(user => {
      if (user) {
        console.log('user already exists');
        return done(null, false);
      } 
      new User(
      { 
        username: req.body.username,
        email: email,
        password: password
       }).save()
      .then( newUser => {
        return done(null, newUser);
      })
      
      
    })
    .catch(err => {console.log(err, 'there was an error with the findOne query')});
}));



routes.post('/email/login', passport.authenticate('local-login'), (req, res) => {
  console.log('email/login callback');
  res.json({message: 'login successful'});
});
routes.post('/email/register', passport.authenticate('local-register'), (req, res) => {
  console.log('email/register callback');
  res.json({message: 'register successful'});
} );


routes.get('/checkUsername/:username', (req, res) => {
  User.findOne({username: req.params.username})
    .then(user => {
      if (user) {
        return res.json({usernameTaken: true});
      } else {
        return res.json({usernameTaken: false});
      }
    })
})
routes.post('/createUsername', (req, res) => {
  const username = req.body.username;
  const id = req.body.id;

  User.findOneAndUpdate({_id: id}, {username: username}, {new: true})
    .then(user => {
      res.json(user);
    })
})
routes.get('/current_user', (req, res) => {
  res.json(req.user);
}) 

routes.get('/logout', (req, res) => {
  req.logout();
  console.log('logout');
  res.redirect('/');
})


module.exports = routes;


