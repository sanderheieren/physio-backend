const express = require('express');

const router = express.Router();

const sessionControllers = require('../controllers/session');
const { errorHandler } = require('../utils/errorHandler');

router
  .get(
    '/',
    errorHandler(async (req, res) => {
      const { pro, client } = req.query;
      const sessionsData = await sessionControllers.getAllSessions(pro, client);
      res.json(sessionsData).status(200).end();
    }),
  )
  .get(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const sessionData = await sessionControllers.getSession(id);
      res.json(sessionData).status(200).end();
    }),
  )
  .post(
    '/',
    errorHandler(async (req, res) => {
      const proId = req.user.id;
      const sessionValues = req.body;
      const sessionData = await sessionControllers.createSession(proId, sessionValues);
      res.json(sessionData).status(201).end();
    }),
  )
  .put(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const updatedSessionData = req.body;
      const sessionData = await sessionControllers.updateSession(id, updatedSessionData);
      res.json(sessionData).status(201).end();
    }),
  )
  .delete(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      await sessionControllers.deleteSession(id);
      res.status(200).end();
    }),
  );

module.exports = router;
