const passport = require('passport');
const passportLocal = require('../server/passportLocal');
const Client = require('../models/Client');
const Pro = require('../models/Pro');
const { ApplicationError } = require('../utils/errors');

const createCookieFromToken = (user, statusCode, req, res) => {
  const token = user.generateVerificationToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

module.exports = {
  signup: async (req, res, next) => {
    passport.authenticate(
      'signup',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            const { statusCode = 400, message } = info;

            res.status(statusCode).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          createCookieFromToken(user, 201, req, res);
        } catch (error) {
          console.log(error);
          throw new ApplicationError(500, error);
        }
      }
    )(req, res, next);
  },

  signupClient: async (req, res, next) => {
    passport.authenticate(
      'signupClient',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            const { statusCode = 400, message } = info;

            return res.status(statusCode).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          createCookieFromToken(user, 201, req, res);
        } catch (error) {
          console.log(error);
          throw new ApplicationError(500, error);
        }
      }
    )(req, res, next);
  },

  login: (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
      if (err || !user) {
        let message = err;
        if (info) {
          message = info.message;
        }
        return res.status(401).json({
          status: 'error',
          error: {
            message,
          },
        });
      }
      createCookieFromToken(user, 200, req, res);
    })(req, res, next);
  },

  autoLogin: async (req, res) => {
    let user = await Pro.findById(req.user._id).select('-password').exec();
    if (!user) {
      user = await Client.findById(req.user._id).select('-password').exec();
      user.accType = 'client';
    }
    if (!user) {
      return res
        .status(404)
        .send({ message: 'Session expired. Please log in again.' });
    }
    res.send({ ...user._doc });
  },
};
