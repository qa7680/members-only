const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/routes');
const app = express();

//Connect to mongo atlas DB
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
const db = mongoose.connection;

//error log
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//EJS and view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport setup
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: "Incorrect username" });
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      // Passwords match, log user in!
      if (res) return done(null, user);
      // Passwords do not match!
      else return done(null, false, { message: "Incorrect password" });
    });
  });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//checks if a user object is defined
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//Route
app.use('/', indexRouter);

//error route
app.get('*', (req, res) => {
  res.render('error', { user: req.user })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => console.log(`app running on port ${process.env.PORT || 3000}`))


module.exports = app;