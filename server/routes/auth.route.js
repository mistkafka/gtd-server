import express from 'express'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'
import authCtrl from '../controllers/auth.controller'
import config from '../../config/config'
import getSSOAuth from '../helpers/sso-auth'

const SSOAuth = getSSOAuth({
  redis: config.redis.uri,
  expressJwtConfig: {
    secret: config.jwtSecret
  },
  authUrl: config.sso.authTokenUrl
})
const router = express.Router() // eslint-disable-line new-cap

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login)

router.route('/random-number')
  .get(SSOAuth, authCtrl.getRandomNumber)

router.route('/auth-token')
  .post(authCtrl.authToken)

export default router
