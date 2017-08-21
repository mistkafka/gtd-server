import express from 'express'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'
import SSOAuth from '../helpers/get-sso-auth'

export default function (ctrl, modelName, extRules) {
  const router = express.Router() // eslint-disable-line new-cap
  const rules = Object.assign(getDefaultRules(ctrl, modelName), extRules)

  router.route('/')
    .get(...rules.list)
    .post(...rules.create)

  router.route('/:id')
    .get(...rules.get)
    .put(...rules.update)
    .delete(...rules.delete)

  router.param('id', ctrl.load)

  return router
}

function getDefaultRules (ctrl, modelName) {
  return {
    list: [SSOAuth, ctrl.list],
    create: [SSOAuth, validate(paramValidation[`create${modelName}`]), ctrl.add],
    get: [SSOAuth, ctrl.get],
    update: [SSOAuth, validate(paramValidation[`update${modelName}`]), ctrl.add],
    delete: [SSOAuth, ctrl.remove]
  }
}
