import mongoose from 'mongoose'
import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import app from '../../index'

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
    it('should create a new action', (done) => {
      request(app)
        .post('/api/actions')
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
          action = res.body
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/actions/:id', () => {
    it('should get action details', (done) => {
      request(app)
        .get(`/api/actions/${action._id}`)
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
          done()
        })
        .catch(done)
    })

    it('should report error with message - Not found, when action does not exists', (done) => {
      request(app)
        .get('/api/actions/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/actions/:id', () => {
    it('should update action details', (done) => {
      request(app)
        .put(`/api/actions/${action._id}`)
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
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/actions/', () => {
    it('should get all actions', (done) => {
      request(app)
        .get('/api/actions')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/actions/:id', () => {
    it('should delete action', (done) => {
      request(app)
        .delete(`/api/actions/${action._id}`)
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
          done()
        })
        .catch(done)
    })
  })
})
