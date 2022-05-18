require('dotenv').config()
const express = require('express');
const driverRoutes = require('./src/routes/driver');
const mongoose = require('mongoose');
const sync = require('./src/setup/sync');
const slackbot = require('./src/setup/slackbot')

const app = express();


// Parser
app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

// Set CORS allowed headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Mentods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

app.use('/driver', driverRoutes)

const PORT = 8080;

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9mwbq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  ).then((client) => {
    app.listen(PORT, () => {
      sync.checkData()
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
