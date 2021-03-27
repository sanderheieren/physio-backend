const express = require('express');

const router = express.Router();

const proControllers = require('../controllers/pro');
const { errorHandler } = require('../utils/errorHandler');

router
  .get(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const proData = await proControllers.getProData(id);
      res.json(proData).status(200).end();
    }),
  )
  .put(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const updatedProData = req.body;
      const proData = await proControllers.updatePro(id, updatedProData);
      res.json(proData).status(201).end();
    }),
  )
  .delete(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      await proControllers.deletePro(id);
      res.status(200).end();
    }),
  );

module.exports = router;
