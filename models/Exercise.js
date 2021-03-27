const mongoose = require('mongoose');

const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: String,
    duration: String,
    pro: {
      type: Schema.Types.ObjectId,
      ref: 'Pro',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Exercise', exerciseSchema);
