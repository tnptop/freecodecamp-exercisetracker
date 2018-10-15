'use strict'

const dateformat = require('dateformat')
const { User, Exercise } = require('./db')

const getValidDate = (datetime, allowDefault) => {
  const isCurrent = datetime === ''
  const date = isCurrent && allowDefault ? new Date() : new Date(datetime)

  return date.toString() !== 'Invalid Date' ? date : null
}

// User
exports.addNewUser = async (req, res, next) => {
  const { username } = req.body
  const isExist = await User.findOne({ username })

  return isExist ?
    next({ status: 400, error: 'Username already taken' }) :
    res.json(await User.create({ username }))
}

exports.checkUserBody = async (req, res, next) => {
  const { username } = req.body
  const user = await User.findOne({ username })

  return user ? next() : next({ status: 404, error: 'User Not Found' })
}

exports.checkUserQuery = async (req, res, next) => {
  const { username } = req.query
  const user = await User.findOne({ username })

  return user ? next() : next({ status: 404, error: 'User Not Found' })
}

exports.getUserLogs = async (req, res, next) => {
  const { username, limit } = req.query
  const { from, to } = res.locals
  const criteria = { username, date: {} }
  if (from) criteria.date['$gte'] = from
  if (to) criteria.date['$lte'] = to
  if (Object.keys(criteria.date).length === 0) delete criteria.date

  let logQuery = Exercise.find(criteria)
  if (limit) logQuery = logQuery.limit(parseInt(limit))
  let log = await logQuery.exec()

  const response = { username, count: log.length, log }
  if (from) response.from = dateformat(from, 'ddd mmm dd yyyy')
  if (to) response.to = dateformat(to, 'ddd mmm dd yyyy')
  return res.json(response)
}

// Date
exports.checkDateBody = async (req, res, next) => {
  const { date } = req.body
  const validDate = getValidDate(date, true)
  if (validDate) {
    res.locals.date = validDate
    next()
  }
  else next({ status: 400, error: 'Invalid Date' })
}

exports.checkDateQuery = async (req, res, next) => {
  const { from, to } = req.query
  
  if (!from && !to) return next()

  res.locals.from = getValidDate(from, false)
  res.locals.to = getValidDate(to, false)

  if (res.locals.from || res.locals.to) next()
  else next({ status: 400, error: 'Invalid Date' })
}

// Exercise
exports.addExercise = async (req, res, next) => {
  const { username, description, duration } = req.body
  const { date } = res.locals
  const isValid = username !== '' &&
    description !== '' &&
    duration !== ''

  return isValid ?
    res.json(await Exercise.create({ username, description, duration, date })) :
    next({ status: 400, error: 'Missing fields' })
}

// Error Handler
exports.errorHandler = async (err, req, res, next) => {
  const { status } = err

  res.status(status).json(err)
}
