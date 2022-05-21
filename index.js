require('dotenv').config()
const path = require('path');
const express = require('express');

// imports
const driverRoutes = require('./src/routes/driver');
const mongoose = require('mongoose');
const sync = require('./src/setup/sync');
const slackbot = require('./src/setup/slackbot');
const cloudinary = require('./src/setup/cloudinary');
const authRoutes = require('./src/routes/auth');
const { logError, returnError } = require('./src/middleware/errorHandler');

const app = express();


// Parser
app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

app.use('/images', express.static(path.join(__dirname, '/src/assets/images')))

exports.imagePath = path.join(__dirname, '/src/assets/images');

// Set CORS allowed headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Mentods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})
app.use('/auth', authRoutes)
app.use('/driver', driverRoutes)
app.use(logError)
app.use(returnError)

const PORT = 8080;

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9mwbq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  ).then((client) => {
    app.listen(PORT, () => {
      cloudinary.setup()
      // sync.checkData()
      slackbot.startup()
      console.log('Running on port ' + PORT);
      
      if(process.env.ENVIRONMENT === 'PROD') {
        slackbot.sendMessage(`
          Server startar
          `)
      }
    })
  })
  .catch(err => {
    console.log('Error while connecting to mongoDB', err);
    slackbot.sendMessage(`
            SERVER ERROR: ${err}
          `)
  })
