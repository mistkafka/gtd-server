import Controller from './base.controller'
import User from '../models/user.model'
import selfish from '../helpers/selfish.helper'

export default selfish(new Controller(User))
