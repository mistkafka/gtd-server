import Controller from './base.controller'
import App from '../models/app.model'
import selfish from '../helpers/selfish.helper'

class AppCtrl extends Controller {
}

export default selfish(new AppCtrl(App))
