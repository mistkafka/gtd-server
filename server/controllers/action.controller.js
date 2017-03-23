import Controller from './base.controller'
import Action from '../models/action.model'
import selfish from '../helpers/selfish.helper'

class ActionCtrl extends Controller {
  add (req, res, next) {
    req.body.owner = req.user.id
    return super.add(...arguments)
  }

  load (req, res, next, id) {
    return super.load(req, res, next, {owner: req.user.id, _id: id})
  }

}

export default selfish(new ActionCtrl(Action))
