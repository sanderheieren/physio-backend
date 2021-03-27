const mongoose = require('mongoose');
const { app } = require('./app.js');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.jwwh2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  // `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.55hby.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  app.listen(process.env.PORT || 4000, () => console.log(`App is running at port: ${process.env.PORT || 4000}`)),
);
