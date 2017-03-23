import generateRoute from './base.route'
import ctrl from '../controllers/user.controller'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'

const extRules = {
  create: [validate(paramValidation[`createUser`]), ctrl.add]
}

export default generateRoute(ctrl, 'User', extRules)
