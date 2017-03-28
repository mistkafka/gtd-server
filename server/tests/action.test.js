import mongoose from 'mongoose'
import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import app from '../../index'
import login from '../helpers/api.login.helper'
import getREST from '../helpers/restful-test.helper'

let REST = null

chai.config.includeStack = true

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('## Action APIs', () => {
  let login1
  let login2
  before(async () => {
    ([login1, login2] = await Promise.all([login(), login()]))
    REST = getREST('/api/actions', login1.jwtToken)
  })

  after(async () => {
    let userREST = getREST('/api/users')
    await Promise.all([
      userREST.remove(login1.user._id, {token: login1.jwtToken}),
      userREST.remove(login2.user._id, {token: login2.jwtToken})
    ])
  })

  let action = {
    title: 'Take milk',
    description: 'Take milk to grandmother',
    project: '',
    type: 'Todo/Done',
    dueDate: (new Date('2017-04-21 18:08:20')).toString(),
    target: 1,
    statics: 'Active'
  }

  let updateAction = {
    title: 'Cook 7 times',
    dueDate: (new Date('2017-04-22 18:08:20')).toString(),
    target: 7,
  }

  describe('# POST /api/actions', () => {
    it('should create a new action which owner is login user', async () => {
      let { body } = await REST.create(action)

      body.dueDate = (new Date(body.dueDate)).toString()
      expect(body.title).to.equal(action.title)
      expect(body.target).to.equal(action.target)
      expect(body.dueDate).to.equal(action.dueDate)
      expect(body.owner).to.be.equal(login1.user._id)

      REST.remove(body._id)
    })
  })

  describe('# GET /api/actions/:id', () => {
    it('should get action details', async () => {
      let { body: newAction } = await REST.create(action)
      let { body } = await REST.get(newAction._id)

      body.dueDate = (new Date(body.dueDate)).toString()
      expect(body.title).to.equal(action.title)
      expect(body.target).to.equal(action.target)
      expect(body.dueDate).to.equal(action.dueDate)

      await REST.remove(newAction._id)
    })

    it('should report error with message - Not found, when action does not exists', async () => {
      let { body } = await REST.get('56c787ccc67fc16ccc1a5e92', {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')
    })

    it('should report error with message - Not found, when load other user\'s action', async () => {
      let { body: othersAction } = await REST.create(action, {token: login2.jwtToken})
      let { body } = await REST.get(othersAction._id, {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')

      await REST.remove(othersAction._id, {token: login2.jwtToken})
    })
  })

  describe('# PUT /api/actions/:id', () => {
    it('should update action details', async () => {
      let { body: newAction } = await REST.create(action)
      let { body } = await REST.update({...updateAction, _id: newAction._id})

      body.dueDate = (new Date(body.dueDate)).toString()
      expect(body.title).to.equal(updateAction.title)
      expect(body.dueDate).to.equal(updateAction.dueDate)
      expect(body.target).to.equal(updateAction.target)

      await REST.remove(newAction._id)
    })

    it('owner shouldn\'t be updated', async () => {
      let { body: newAction } = await REST.create(action)
      let { body } = await REST.update({owner: 'ad231bcd', _id: newAction._id})

      expect(body.owner).to.equal(login1.user._id)
    })
  })

  describe('# GET /api/actions/', () => {
    it('should get all actions', async () => {
      await request(app)
        .get('/api/actions')
        .set('Authorization', login1.jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array')
        })
    })

    it('should only get self actions', async () => {
      let action = {title: 'test'}
      let actions = Array(5).fill(action)
      actions = await REST.createMany(actions)
      let res = await REST.list({token: login2.jwtToken})

      expect(res.body.length).to.equal(0)

      await REST.removeMany(actions.map(_ => _._id))
    })
  })

  describe('# DELETE /api/actions/:id', () => {
    it('should delete action', async () => {
      let { body: newAction } = await REST.create(action)
      let { body } = await REST.remove(newAction._id)

      body.dueDate = (new Date(body.dueDate)).toString()
      expect(body.title).to.equal(action.title)
      expect(body.dueDate).to.equal(action.dueDate)
      expect(body.target).to.equal(action.target)
    })
  })
})
