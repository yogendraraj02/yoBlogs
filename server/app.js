const express = require('express');

const app = express();
require('dotenv').config();

const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

const errorHandler = require('./utils/errorHandler');

app.use(errorHandler);


mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    // console.log(result);
    app.listen(port, () => {
      console.log(`connected`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
