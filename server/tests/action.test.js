import mongoose from 'mongoose'
import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import app from '../../index'
import login from '../helpers/api.login.helper'

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
  })

  after(async () => {
    let r1 = request(app)
          .delete(`/api/users/${login1.user._id}`)
          .set('Authorization', login1.jwtToken)
          .expect(httpStatus.OK)
    let r2 = request(app)
          .delete(`/api/users/${login2.user._id}`)
          .set('Authorization', login2.jwtToken)
          .expect(httpStatus.OK)

    await r1
    await r2
  })

  let action = {
    title: 'Take milk',
    description: 'Take milk to grandmother',
    project: '',
    type: 'Todo/Done',
    dueDate: (new Date('2017-04-21 18:08:20')).toString(),
    target: 1,
    processItems: [],
    statics: 'Active'
  }

  let updateAction = {
    title: 'Cook 7 times',
    dueDate: (new Date('2017-04-22 18:08:20')).toString(),
    target: 7,
    processItems: [
      {date: (new Date('2017-04-22 18:08:20')).toString(), log: 'for grandmother'},
      {date: (new Date('2017-04-22 18:08:21')).toString(), log: 'for papa'},
      {date: (new Date('2017-04-22 18:08:22')).toString(), log: 'for mom'}
    ]
  }

  describe('# POST /api/actions', () => {
    it('should create a new action which owner is login user', async () => {
      await request(app)
        .post('/api/actions')
        .set('Authorization', login1.jwtToken)
        .send(action)
        .expect(httpStatus.OK)
        .then((res) => {
          res.body.dueDate = (new Date(res.body.dueDate)).toString()
          res.body.processItems = res.body.processItems.map((_) => {
            _.date = (new Date(_.date)).toString()
            return _
          })
          expect(res.body.title).to.equal(action.title)
          expect(res.body.target).to.equal(action.target)
          expect(res.body.processItems).to.deep.equal(action.processItems)
          expect(res.body.dueDate).to.equal(action.dueDate)

          expect(res.body.owner).to.be.equal(login1.user._id)

          action = res.body
        })
    })
  })

  describe('# GET /api/actions/:id', () => {
    it('should get action details', async () => {
      await request(app)
        .get(`/api/actions/${action._id}`)
        .set('Authorization', login1.jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          res.body.dueDate = (new Date(res.body.dueDate)).toString()
          res.body.processItems = res.body.processItems.map((_) => {
            _.date = (new Date(_.date)).toString()
            return _
          })
          expect(res.body.title).to.equal(action.title)
          expect(res.body.target).to.equal(action.target)
          expect(res.body.processItems).to.deep.equal(action.processItems)
          expect(res.body.dueDate).to.equal(action.dueDate)
        })
    })

    it('should report error with message - Not found, when action does not exists', async () => {
      await request(app)
        .get('/api/actions/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', login1.jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
        })
    })

    it('should report error with message - Not found, when load other user\'s action', async () => {
      let othersAction = await request(app)
            .post('/api/actions')
            .set('Authorization', login2.jwtToken)
            .send({title: 'sdfasdfk'})
            .expect(httpStatus.OK)
            .then((res) => {
              return res.body
            })

      await request(app)
        .get(`/api/actions/${othersAction._id}`)
        .set('Authorization', login1.jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
        })
    })
  })

  describe('# PUT /api/actions/:id', () => {
    it('should update action details', async () => {
      await request(app)
        .put(`/api/actions/${action._id}`)
        .set('Authorization', login1.jwtToken)
        .send(updateAction)
        .expect(httpStatus.OK)
        .then((res) => {
          res.body.dueDate = (new Date(res.body.dueDate)).toString()
          res.body.processItems = res.body.processItems.map((_) => {
            _.date = (new Date(_.date)).toString()
            return _
          })
          expect(res.body.title).to.equal(updateAction.title)
          expect(res.body.dueDate).to.equal(updateAction.dueDate)
          expect(res.body.target).to.equal(updateAction.target)
          expect(res.body.processItems).to.deep.equal(updateAction.processItems)
        })
    })

    it('owner shouldn\'t be updated', async () => {
      let res = await request(app)
            .put(`/api/actions/${action._id}`)
            .set('Authorization', login1.jwtToken)
            .send({owner: 'ad231bcd'})
            .expect(httpStatus.OK)

      expect(res.body.owner).to.equal(login1.user._id)
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
  })

  describe('# DELETE /api/actions/:id', () => {
    it('should delete action', async () => {
      await request(app)
        .delete(`/api/actions/${action._id}`)
        .set('Authorization', login1.jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          res.body.dueDate = (new Date(res.body.dueDate)).toString()
          res.body.processItems = res.body.processItems.map((_) => {
            _.date = (new Date(_.date)).toString()
            return _
          })
          expect(res.body.title).to.equal(updateAction.title)
          expect(res.body.dueDate).to.equal(updateAction.dueDate)
          expect(res.body.target).to.equal(updateAction.target)
          expect(res.body.processItems).to.deep.equal(updateAction.processItems)
        })
    })
  })
})
