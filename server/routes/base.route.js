import express from 'express'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'
import expressJwt from 'express-jwt'
import config from '../../config/config'

const auth = expressJwt({ secret: config.jwtSecret })

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
    list: [auth, ctrl.list],
    create: [auth, validate(paramValidation[`create${modelName}`]), ctrl.add],
    get: [auth, ctrl.get],
    update: [auth, validate(paramValidation[`update${modelName}`]), ctrl.add],
    delete: [auth, ctrl.remove]
  }
}
