'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const api = require('./api')

mongoose.connect(process.env.MONGO_URL)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

/**
 * {
     "username": "someone",
     "_id": "HyYdFDfgm"
   }
 */
app.post('/api/exercise/new-user', api.addNewUser)
/**
 * {
     "username": "someone",
     "description": "test",
     "duration": 10,
     "_id": "HyYdFDfgm",
     "date": "Mon Jun 04 2018"
   }
 */
app.post('/api/exercise/add', api.checkUserBody, api.checkDateBody, api.addExercise)

app.get('/api/exercise/log', api.checkUserQuery, api.checkDateQuery, api.getUserLogs)

// error handler
app.use(api.errorHandler)

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
})
