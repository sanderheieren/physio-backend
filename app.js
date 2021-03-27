// const expressSession = require('express-session')({
//   secret: 'loopers-secret',
//   resave: false,
//   saveUninitialized: false
// });

const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const proRoutes = require('./routes/pro');
const clientRoutes = require('./routes/client');
const sessionRoutes = require('./routes/session');
const exerciseRoutes = require('./routes/exercise');
const invitationRoutes = require('./routes/invitation');
const { authenticate } = require('./middleware/authenticate');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

// app.use(expressSession);
// app.use(passport.session());

app.use('/auth', authRoutes);

app.use('/pros', authenticate, proRoutes);
app.use('/clients', authenticate, clientRoutes);
app.use('/invitations', authenticate, invitationRoutes);
app.use('/sessions', authenticate, sessionRoutes);
app.use('/exercises', authenticate, exerciseRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports.app = app;
