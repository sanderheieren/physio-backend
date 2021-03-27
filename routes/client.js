const express = require('express');

const router = express.Router();

const clientControllers = require('../controllers/client');
const { errorHandler } = require('../utils/errorHandler');

router
  .get(
    '/',
    errorHandler(async (req, res) => {
      const { pro } = req.query;
      const clientsData = await clientControllers.getAllClients(pro);
      res.json(clientsData).status(200).end();
    }),
  )
  .get(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const clientData = await clientControllers.getClient(id);
      res.json(clientData).status(200).end();
    }),
  )
  .put(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const updatedClientData = req.body;
      const clientData = await clientControllers.updateClient(id, updatedClientData);
      res.json(clientData).status(201).end();
    }),
  )
  .delete(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      await clientControllers.deleteClient(id);
      res.status(200).end();
    }),
  );

module.exports = router;
