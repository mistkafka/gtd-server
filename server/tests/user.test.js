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

describe('## User APIs', () => {
  let user = {
    username: 'KK123',
    mobileNumber: '1234567890',
    password: '123'
  }
  let jwtToken

  describe('# POST /api/users', () => {
    it('should create a new user', async () => {
      user = await request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username)
          expect(res.body.mobileNumber).to.equal(user.mobileNumber)
          return res.body
        })

      jwtToken = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => `Bearer ${res.body.token}`)
    })
  })

  describe('# GET /api/users/:userId', () => {
    it('should get user details', async () => {
      await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username)
          expect(res.body.mobileNumber).to.equal(user.mobileNumber)
        })
    })

    it('should report error with message - Not found, when user does not exists', async () => {
      await request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
        })
    })
  })

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', async () => {
      user.username = 'KK'
      await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', jwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('KK')
          expect(res.body.mobileNumber).to.equal(user.mobileNumber)
        })
    })
  })

  describe('# GET /api/users/', () => {
    it('should get all users', async () => {
      await request(app)
        .get('/api/users')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array')
        })
    })
  })

  describe('# DELETE /api/users/', () => {
    it('should delete user', async () => {
      await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('KK')
          expect(res.body.mobileNumber).to.equal(user.mobileNumber)
        })
    })
  })
})
