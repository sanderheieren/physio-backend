const express = require('express');

const router = express.Router();

const authControllers = require('../controllers/auth');
const { authenticate } = require('../middleware/authenticate');
const { errorHandler } = require('../utils/errorHandler');

router
  .post('/signup', errorHandler(authControllers.signup))
  .post('/client/signup', errorHandler(authControllers.signupClient))
  .post('/login', errorHandler(authControllers.login))
  .get('/login', authenticate, errorHandler(authControllers.autoLogin));

module.exports = router;
