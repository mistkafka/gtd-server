import generateRoute from './base.route'
import ctrl from '../controllers/running-week.controller'

const extRules = {
  list: [ctrl.list],
  create: [ctrl.add],
  get: [ctrl.get],
  update: [ctrl.add],
  delete: [ctrl.remove]
}

export default generateRoute(ctrl, 'RunningWeek', extRules)
