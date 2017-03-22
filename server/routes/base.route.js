import express from 'express'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'

export default function (ctrl, modelName) {
  const router = express.Router() // eslint-disable-line new-cap

  router.route('/')
    .get(ctrl.list)
    .post(validate(paramValidation[`create${modelName}`]), ctrl.add)

  router.route('/:id')
    .get(ctrl.get)
    .put(validate(paramValidation[`update${modelName}`]), ctrl.add)
    .delete(ctrl.remove)

  router.param('id', ctrl.load)

  return router;
}
