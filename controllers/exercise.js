const Session = require('../models/Session');
const Exercise = require('../models/Exercise');

module.exports = {
  getAllExercises: async (pro, title) => {
    const queryFilters = {};
    pro ? (queryFilters.pro = pro) : null;
    title ? (queryFilters.title = title) : null;
    const exercisesData = await Exercise.find(queryFilters).exec();
    return exercisesData;
  },
  getExercise: async (id) => Exercise.findOne({ _id: id }),
  createExercise: async (proId, values) => {
    values['pro'] = proId;
    const newExercise = new Exercise(values);
    const savedExercise = await newExercise.save();
    return savedExercise;
  },
  updateExercise: async (id, data) =>
    Exercise.findByIdAndUpdate(id, data, { new: true }),
  deleteExercise: async (id) => {
    try {
      await Session.updateMany(
        { 'exercises.exercise': id } ,
        { $pull: { exercises: { exercise: id } } },
        { new: false, safe: true, multi: true }
      ).exec();
      await Exercise.deleteOne({ _id: id });
      return;
    } catch (err) {
      throw { status: 500, code: 'FAILED_TRANSACTION', message: err.message };
    }
  },
};
