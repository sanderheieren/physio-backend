const Invitation = require('../models/Invitation');
const Pro = require('../models/Pro');

module.exports = {
  getAllInvitations: async pro => {
    const queryFilters = {};
    pro ? queryFilters.pro = pro : null;
    const invitationData = await Invitation.find(queryFilters).exec();
    return invitationData;
  },
  getInvitation: async id => Invitation.findOne({ _id: id }),
  createInvitation: async (pro, values) => {
    try {
      values.pro = pro;
      const newInvitation = new Invitation(values);
      const savedInvitation = await newInvitation.save();
      const invitationId = savedInvitation.id;
      await Pro.updateOne({ _id: pro }, { $push: { invitations: [invitationId] } }, { new: false });
      return savedInvitation;
    } catch (err) {
      throw ({ status: 500, code: 'FAILED_TRANSACTION', message: err.message });
    }
  },
  deleteInvitation: async id => {
    try {
      await Pro.findOneAndUpdate({ invitations: { '$in': [id] } }, { $pull: { invitations: { $in: id } } }, { new: false });
      await Invitation.deleteOne({ _id: id });
      return;
    } catch (err) {
      throw ({ status: 500, code: 'FAILED_TRANSACTION', message: err.message });
    }
  },
};