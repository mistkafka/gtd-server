import express from 'express'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'
import authCtrl from '../controllers/auth.controller'
import SSOAuth from '../helpers/get-sso-auth'

const router = express.Router() // eslint-disable-line new-cap

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login)

router.route('/random-number')
  .get(SSOAuth, authCtrl.getRandomNumber)

router.route('/auth-token')
  .post(authCtrl.authToken)

export default router
