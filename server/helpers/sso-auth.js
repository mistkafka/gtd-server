import expressJwt from 'express-jwt'
import connect from 'connect'
import request from 'request-promise'
import redis from 'redis'
import httpStatus from 'http-status'
import APIError from './APIError'

let redisClient = null

export default config => {
  if (!redisClient) {
    redisClient = redis.createClient(config.redis)
  }

  let expressJwtConfig = Object.assign({
    getToken: getTokenFromHeaderQueryCookie,
  }, config.expressJwtConfig)
  const jwtTokenAuthMiddleware = expressJwt(expressJwtConfig)

  const ssoAuthMiddleware = function (req, res, next) {
    const token = getTokenFromHeaderQueryCookie(req)

    redisClient.get('client:' + token, (err, isExist) => {
      if (err) {
        err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
        return next(err)
      }

      if (isExist) {
        return next()
      }

      request({
        uri: config.authUrl,
        method: 'POST',
        body: {
          token: token
        },
        json: true
      }).then(function (res) {
        redisClient.set('client:' + token, '1')
        next()
      }).catch(function (NO_USE) {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
        return next(err)
      })
    })
  }

  const SSOMiddleware = [jwtTokenAuthMiddleware, ssoAuthMiddleware].reduce((chain, middlleware) => {
    chain.use(middlleware)
    return chain
  }, connect())

  return SSOMiddleware
}

function getTokenFromHeaderQueryCookie (req) {
  const tokens = []
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    tokens.push(req.headers.authorization.split(' ')[1])
  }

  if (req.query && req.query.jwtToken) {
    tokens.push(req.query.jwtToken)
  }

  const cookies = (req.headers.cookie || '').split(';').reduce((mapping, rawCookie) => {
    let cookie = rawCookie.split('=')
    cookie = {
      key: cookie[0],
      value: cookie[1]
    }
    mapping[cookie.key] = cookie.value
    return mapping
  }, {})

  if (cookies.jwtToken) {
    tokens.push(cookies.jwtToken)
  }

  const token = tokens.filter(_ => _)[0]

  return token
}
