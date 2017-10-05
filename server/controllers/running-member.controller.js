import Controller from './base.controller'
import model from '../models/running-member.model'
import selfish from '../helpers/selfish.helper'

export default selfish(new Controller(model))
