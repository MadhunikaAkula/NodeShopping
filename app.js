const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//sessions
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
//csrf
const csrf = require('csurf');
//error messages
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://madhu_301:madhu_301_mongo@cluster0-0aj5t.mongodb.net/shop';

const app = express();
//creating sessions
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
//csrf protection
const csrfProtection = csrf();
//ejs handlebar configuration
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//session config
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
//csrf config
app.use(csrfProtection);
//flas config
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
//adding to all routes commenly
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.islogged;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(3000, () => {
      console.log("connected")
    });
  })
  .catch(err => {
    console.log(err);
  });
