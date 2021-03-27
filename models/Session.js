const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    pro: {
      type: Schema.Types.ObjectId,
      ref: 'Pro',
      required: true,
    },
    exercises: [
      {
        exercise: {
          type: Schema.Types.ObjectId,
          ref: 'Exercise',
        },
        comment: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Session', sessionSchema);
