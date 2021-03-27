const Session = require('../models/Session');
const Client = require('../models/Client');
const { ApplicationError } = require('../utils/errors');

module.exports = {
  getAllSessions: async (pro, client) => {
    const queryFilters = {};
    pro ? (queryFilters.pro = pro) : null;
    client ? (queryFilters.client = client) : null;
    const sessionsData = await Session.find(queryFilters)
      .populate('pro')
      .populate({
        path: 'exercises',
        populate: {
          path: 'exercise',
          model: 'Exercise',
        },
      })
      .exec();
    return sessionsData;
  },
  getSession: async (id) =>
    await Session.findOne({ _id: id })
      .populate('pro')
      .populate({
        path: 'exercises.exercise',
        model: 'Exercise',
      })
      .populate('client')
      .exec(),
  createSession: async (proId, values) => {
    try {
      values['pro'] = proId;
      const newSession = new Session(values);
      const savedSession = await newSession.save();
      const clientId = values.client;
      const sessionId = savedSession.id;
      await Client.updateOne(
        { _id: clientId },
        { $push: { sessions: [sessionId] } },
        { new: false }
      );
      return savedSession;
    } catch (err) {
      throw new ApplicationError(500, error);
    }
  },
  updateSession: async (id, data) => {
    console.log(data);
    const updatedSession = await Session.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedSession;
  },
  deleteSession: async (id) => {
    try {
      await Client.updateOne(
        { sessions: { $in: id } } ,
        { $pull: { sessions: id } },
        { new: false, safe: true, multi: true }
      ).exec();
      await Session.deleteOne({ _id: id });
      return;
    } catch (err) {
      throw new ApplicationError(500, error);
    }
  },
};
