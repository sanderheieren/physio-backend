const passport = require('passport');
const { Strategy } = require('passport-local');
const Pro = require('../models/Pro');
const Client = require('../models/Client');
const Invitation = require('../models/Invitation');

const authFields = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

passport.use(
  'login',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      let user = await Pro.findOne({ email });
      user = user ? user : await Client.findOne({ email });
      // user = !user && await Client.findOne({ email });

      if (!user || !user.password) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      const checkPassword = await user.comparePassword(password);

      if (!checkPassword) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      return cb(null, user, { message: 'Logged In Successfully' });
    } catch (err) {
      console.error(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);

passport.use(
  'signup',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      const checkEmail = await Pro.checkExistingField('email', email);
      if (checkEmail) {
        return cb(null, false, {
          statusCode: 409,
          message: 'Email already registered, log in instead',
        });
      }
      const newUser = new Pro();
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      await newUser.save();
      return cb(null, newUser);
    } catch (err) {
      console.log(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);

passport.use(
  'signupClient',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      const checkEmail = await Client.checkExistingField('email', email);
      if (checkEmail) {
        return cb(null, false, {
          statusCode: 409,
          message: 'Email already registered, log in instead',
        });
      }
      const newUser = new Client();
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.pro = req.body.pro;
      const invitation = await Invitation.findOne({ email: [newUser.email] });
      await Pro.findOneAndUpdate(
        { _id: newUser.pro },
        { $push: { clients: [newUser.id] } },
        { new: false }
      );
      await Pro.findOneAndUpdate(
        { _id: newUser.pro },
        { $pull: { invitations: { $in: invitation.id } } },
        { new: false }
      );
      await Invitation.deleteOne({ _id: invitation.id });
      await newUser.save();
      return cb(null, newUser);
    } catch (err) {
      console.log(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);
