const Client = require('../models/Client');
const Pro = require('../models/Pro');
const Session = require('../models/Session');
const { ApplicationError } = require('../utils/errors');

module.exports = {
  getAllClients: async pro => {
    const queryFilters = {};
    pro ? queryFilters.pro = pro : null;
    const clientsData = await Client.find(queryFilters).populate('sessions').exec();
    return clientsData;
  },
  getClient: async id => Client.findOne({ _id: id }).populate('sessions').exec(),
  updateClient: async (id, data) => Client.findByIdAndUpdate(id, data, { new: true }),
  deleteClient: async id => {
    try {
      // const proId = await Client.findOne({ _id: id }).select('pro -_id');
      // await Pro.updateOne(proId, { $pull: { customer: [id] } }, { new: false });
      await Pro.updateOne(
        { clients: { $in: id } } ,
        { $pull: { clients: id } },
        { new: false, safe: true, multi: true }
      ).exec();
      await Session.deleteMany({ client: id }).exec();
      await Client.deleteOne({ _id: id });
      return;
    } catch (err) {
      throw new ApplicationError(500, error);
    }
  },
};
