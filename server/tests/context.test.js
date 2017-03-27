import mongoose from 'mongoose'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
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

describe('## Context APIs', () => {
  let login1
  let login2
  before(async () => {
    ([login1, login2] = await Promise.all([login(), login()]))
    REST = getREST('/api/contexts', login1.jwtToken)
  })

  after(async () => {
    let userREST = getREST('/api/users')
    await Promise.all([
      userREST.remove(login1.user._id, {token: login1.jwtToken}),
      userREST.remove(login2.user._id, {token: login2.jwtToken})
    ])
  })

  const context = {
    title: 'way to home',
    description: 'on the way to home'
  }

  const updateContext = {
    description: 'way home'
  }

  describe('# POST /api/contexts', () => {
    it('should create a new context which owner is login user', async () => {
      let { body } = await REST.create(context)

      expect(body.title).to.equal(context.title)
      expect(body.description).to.equal(context.description)

      REST.remove(body._id)
    })
  })

  describe('# GET /api/contexts/:id', () => {
    it('should get context details', async () => {
      let { body: newContext } = await REST.create(context)
      let { body } = await REST.get(newContext._id)

      expect(body.title).to.equal(context.title)
      expect(body.description).to.equal(context.description)

      await REST.remove(newContext._id)
    })

    it('should report error with message - Not found, when context does not exists', async () => {
      let { body } = await REST.get('56c787ccc67fc16ccc1a5e92', {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')
    })

    it('should report error with message - Not found, when load other user\'s context', async () => {
      let { body: othersContext } = await REST.create(context, {token: login2.jwtToken})
      let { body } = await REST.get(othersContext._id, {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')

      await REST.remove(othersContext._id, {token: login2.jwtToken})
    })
  })

  describe('# PUT /api/contexts/:id', () => {
    it('should update context details', async () => {
      let { body: newContext } = await REST.create(context)
      let { body } = await REST.update({...updateContext, _id: newContext._id})

      expect(body.description).to.equal(updateContext.description)
      expect(body.title).to.equal(context.title)

      await REST.remove(newContext._id)
    })

    it('owner shouldn\'t be updated', async () => {
      let { body: newContext } = await REST.create(context)
      let { body } = await REST.update({owner: 'ad231bcd', _id: newContext._id})

      expect(body.owner).to.equal(login1.user._id)
    })
  })

  describe('# GET /api/contexts/', () => {
    it('should get all contexts', async () => {
      let { body } = await REST.list()

      expect(body).to.be.an('array')
    })

    it('should only get self contexts', async () => {
      let context = {title: 'test'}
      let contexts = Array(5).fill(context)
      contexts = await REST.createMany(contexts)
      let res = await REST.list({token: login2.jwtToken})

      expect(res.body.length).to.equal(0)

      await REST.removeMany(contexts.map(_ => _._id))
    })
  })

  describe('# DELETE /api/contexts/:id', () => {
    it('should delete context', async () => {
      let { body: newContext } = await REST.create(context)
      let { body } = await REST.remove(newContext._id)

      expect(body.title).to.equal(context.title)
      expect(body.description).to.equal(context.description)
    })
  })
})
