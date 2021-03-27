module.exports = {
  errorHandler: cb => async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  },
};
