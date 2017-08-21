import mongoose from 'mongoose'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import login from '../helpers/api.login.helper'
import getREST from '../helpers/restful-test.helper'

let REST = null

chai.config.includeStack = true

after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('## App APIs', () => {
  const app = {
    domain: 'app1.domain1.com',
    name: 'app1',
    appKeys: 'askdf8212348asdkf812341234jaskdfasdf823asdf'
  }

  const updateApp = {
    domain: 'app2.domain1.com',
    name: 'app2',
    appKeys: 'afjdksdfdsdfsdf'
  }

  let login1

  before(async () => {
    login1 = await login()
    REST = getREST('/api/apps', login1.jwtToken)
  })

  after(async () => {
    let userREST = getREST('/api/users')
    userREST.remove(login1.user._id, {token: login1.jwtToken})
  })

  describe('# POST /api/apps', async () => {
    it('should create a new app', async () => {
      let { body } = await REST.create(app)

      expect(body.name).to.equal(app.name)
      expect(body.domain).to.equal(app.domain)
      expect(body.appKeys).to.equal(app.appKeys)

      await REST.remove(body._id)
    })
  })

  describe('# GET /api/apps/:id', () => {
    it('should get app details', async () => {
      let { body: newApp } = await REST.create(app)
      let { body } = await REST.get(newApp._id)

      expect(body.name).to.equal(app.name)
      expect(body.domain).to.equal(app.domain)
      expect(body.appKeys).to.equal(app.appKeys)

      await REST.remove(newApp._id)
    })

    it('should report error with message - Not found, when app dones not exists', async () => {
      let { body } = await REST.get('56c787ccc67fc16ccc1a5e92', {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')
    })
  })

  describe('# PUT /api/apps/:id', () => {
    it('should update app details', async () => {
      let { body: newApp } = await REST.create(app)
      let { body } = await REST.update({...updateApp, _id: newApp._id})

      expect(body.name).to.equal(updateApp.name)
      expect(body.domain).to.equal(updateApp.domain)
      expect(body.appKeys).to.equal(updateApp.appKeys)

      await REST.remove(newApp._id)
    })
  })

  describe('# GET /api/apps/', () => {
    it('should get all apps', async () => {
      await REST.create(app)

      let { body } = await REST.list()
      expect(body).to.be.an('array')
    })
  })

  describe('# DELETE /api/apps/:id', () => {
    it('should delete app', async () => {
      let { body: newApp } = await REST.create(app)
      let { body } = await REST.remove(newApp._id)

      expect(body.name).to.equal(newApp.name)
      expect(body.domain).to.equal(newApp.domain)
      expect(body.appKeys).to.equal(newApp.appKeys)
    })
  })
})
