'use strict'

const dateformat = require('dateformat')
const mongoose = require('mongoose')
const toJSON = {
  transform: function (doc, obj) {
    delete obj.__v
    delete obj._id
    if (obj.date) obj.date = dateformat(obj.date, 'ddd mmm dd yyyy')
    return obj
  }
}
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true
  }
}, { toJSON })
const exerciseSchema = mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  duration: {
    type: Number,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { toJSON })

module.exports = {
  'User': mongoose.model('ExerciseUser', userSchema),
  'Exercise': mongoose.model('ExerciseTracking', exerciseSchema)
}