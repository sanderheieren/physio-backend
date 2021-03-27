const Pro = require('../models/Pro');

module.exports = {
  getProData: async id => Pro
    .findOne({ _id: id })
    .populate({
      path: 'clients',
      populate: {
        path: 'sessions',
        model: 'Session',
        populate: {
          path: 'exercises',
          populate: {
            path: 'exercise',
            model: 'Exercise',
          },
        },
      },
    })
    .populate({
      path: 'invitations'
    })
    .exec(),
  updatePro: async (id, data) => Pro
    .findByIdAndUpdate(id, data, { new: true })
    .populate({
      path: 'clients',
      populate: {
        path: 'sessions',
        model: 'Session',
        populate: {
          path: 'exercises',
          populate: {
            path: 'exercise',
            model: 'Exercise',
          },
        },
      },
    })
    .populate({
      path: 'invitations'
    })
    .exec(),
  deletePro: async id => Pro.deleteOne({ _id: id }),
};
