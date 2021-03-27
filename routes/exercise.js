const express = require('express');

const router = express.Router();

const exerciseControllers = require('../controllers/exercise');
const { errorHandler } = require('../utils/errorHandler');

router
  .get(
    '/',
    errorHandler(async (req, res) => {
      const { pro, title } = req.query;
      const exercisesData = await exerciseControllers.getAllExercises(pro, title);
      res.json(exercisesData).status(200).end();
    }),
  )
  .get(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const exerciseData = await exerciseControllers.getExercise(id);
      res.json(exerciseData).status(200).end();
    }),
  )
  .post(
    '/',
    errorHandler(async (req, res) => {
      const proId = req.user.id;
      const exerciseValues = req.body;
      const exerciseData = await exerciseControllers.createExercise(proId, exerciseValues);
      res.json(exerciseData).status(201).end();
    }),
  )
  .put(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      const updatedExerciseData = req.body;
      const exerciseData = await exerciseControllers.updateExercise(id, updatedExerciseData);
      res.json(exerciseData).status(201).end();
    }),
  )
  .delete(
    '/:id',
    errorHandler(async (req, res) => {
      const { id } = req.params;
      await exerciseControllers.deleteExercise(id);
      res.status(200).end();
    }),
  );

module.exports = router;
