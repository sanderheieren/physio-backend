const passportJWT = require('../server/passportJwt');
const { ApplicationError } = require('../utils/errors');

module.exports = {
  authenticate: (req, res, next) => {
    passportJWT.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        throw new ApplicationError(
          (statusCode = 401),
          'invalid token, please log in or sign up',
        );
      }
      req.user = user;
      return next();
    })(req, res, next);
  },
};
