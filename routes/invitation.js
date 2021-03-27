const express = require('express');

const router = express.Router();

const invitationControllers = require('../controllers/invitation');
const { errorHandler } = require('../utils/errorHandler');

router
  .get(
    '/',
    errorHandler(async (req, res) => {
      const { pro } = req.query;
      const invitationsData = await invitationControllers.getAllInvitations(pro);
      res.json(invitationsData).status(200).end();
    }),
  )
  .get(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const invitationData = await invitationControllers.getInvitation(id);
      res.json(invitationData).status(200).end();
    }),
  )
  .post(
    '/',
    errorHandler(async (req, res) => {
      const pro = req.user.id;
      const invitationValues = req.body;
      const invitationData = await invitationControllers.createInvitation(pro, invitationValues);
      res.json(invitationData).status(201).end();
    }),
  )
  .delete(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      await invitationControllers.deleteInvitation(id);
      res.status(200).end();
    }),
  );

module.exports = router;
