const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/gm, '\n');

const proSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Please provide a valid email address'],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: 8,
    },
    userType: {
      type: String,
      required: true,
      default: 'pro',
    },
    clients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Client',
      },
    ],
    invitations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Invitation',
      },
    ],
  },
  { timestamps: true }
);

proSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next;
  this.password = await bcrypt.hash(this.password, parseInt(process.env.HASH));
  return next();
});

proSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

proSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

proSchema.methods.generateVerificationToken = function () {
  return jwt.sign({ id: this._id }, jwtPrivateSecret, {
    expiresIn: '2h',
    algorithm: 'RS256',
  });
};

proSchema.statics.checkExistingField = async function (field, value) {
  const checkField = await Pro.findOne({ [`${field}`]: value });
  return checkField;
};

const Pro = mongoose.model('Pro', proSchema);

module.exports = Pro;
