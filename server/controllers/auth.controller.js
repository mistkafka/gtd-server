import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import config from '../../config/config'
import User from '../models/user.model'
import redis from 'redis'

const redisClient = redis.createClient({url: config.redis.uri})

function login (req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  User.verifyLogin({ username: req.body.username, password: req.body.password })
    .then((user) => {
      const token = jwt.sign({
        username: user.username,
        id: user._id
      }, config.jwtSecret)

      redisClient.set(token, '1')

      return res.json({
        token,
        username: user.username
      })
    })
    .catch(() => {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
      return next(err)
    })
}

function logout (req, res, next) {
  const token = req.body.token || ''
  redisClient.del(token)
  res.end('ok')
}

function getRandomNumber (req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  })
}

async function authToken (req, res, next) {
  const token = req.body.token
  if (!token) {
    res.end('failed')
  }

  redisClient.get(token, (err, isExists) => {
    if (err) {
      next(err)
    }

    if (isExists) {
      res.end('ok')
    } else {
      err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
      next(err)
    }
  })
}

export default {
  login,
  logout,
  getRandomNumber,
  authToken,
}
