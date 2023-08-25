const express = require('express');

const app = express();
require('dotenv').config();

const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

const userRoutes = require('./routes/auth'); 
const feedRoutes = require('./routes/post')
app.use(express.urlencoded());
app.use(express.json());

app.use('/api/user',userRoutes);

app.use('/api/feed',feedRoutes);

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

  app.use((error, req, res, next) => {
    console.log(`error func`, error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });
  