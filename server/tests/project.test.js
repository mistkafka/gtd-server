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

describe('## Project APIs', () => {
  let login1
  let login2
  before(async () => {
    ([login1, login2] = await Promise.all([login(), login()]))
    REST = getREST('/api/projects', login1.jwtToken)
  })

  after(async () => {
    let userREST = getREST('/api/users')
    await Promise.all([
      userREST.remove(login1.user._id, {token: login1.jwtToken}),
      userREST.remove(login2.user._id, {token: login2.jwtToken})
    ])
  })

  const project = {
    title: 'plan for 2017',
    description: 'my personal plan for 2017'
  }

  const updateProject = {
    description: 'personal plan for 2017'
  }

  describe('# POST /api/projects', () => {
    it('should create a new project which owner is login user', async () => {
      let { body } = await REST.create(project)

      expect(body.title).to.equal(project.title)
      expect(body.description).to.equal(project.description)

      REST.remove(body._id)
    })
  })

  describe('# GET /api/projects/:id', () => {
    it('should get project details', async () => {
      let { body: newProject } = await REST.create(project)
      let { body } = await REST.get(newProject._id)

      expect(body.title).to.equal(project.title)
      expect(body.description).to.equal(project.description)

      await REST.remove(newProject._id)
    })

    it('should report error with message - Not found, when project does not exists', async () => {
      let { body } = await REST.get('56c787ccc67fc16ccc1a5e92', {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')
    })

    it('should report error with message - Not found, when load other user\'s project', async () => {
      let { body: othersProject } = await REST.create(project, {token: login2.jwtToken})
      let { body } = await REST.get(othersProject._id, {status: httpStatus.NOT_FOUND})

      expect(body.message).to.equal('Not Found')

      await REST.remove(othersProject._id, {token: login2.jwtToken})
    })
  })

  describe('# PUT /api/projects/:id', () => {
    it('should update project details', async () => {
      let { body: newProject } = await REST.create(project)
      let { body } = await REST.update({...updateProject, _id: newProject._id})

      expect(body.description).to.equal(updateProject.description)
      expect(body.title).to.equal(project.title)

      await REST.remove(newProject._id)
    })

    it('owner shouldn\'t be updated', async () => {
      let { body: newProject } = await REST.create(project)
      let { body } = await REST.update({owner: 'ad231bcd', _id: newProject._id})

      expect(body.owner).to.equal(login1.user._id)
    })
  })

  describe('# GET /api/projects/', () => {
    it('should get all projects', async () => {
      let { body } = await REST.list()

      expect(body).to.be.an('array')
    })

    it('should only get self projects', async () => {
      let project = {title: 'test'}
      let projects = Array(5).fill(project)
      projects = await REST.createMany(projects)
      let res = await REST.list({token: login2.jwtToken})

      expect(res.body.length).to.equal(0)

      await REST.removeMany(projects.map(_ => _._id))
    })
  })

  describe('# DELETE /api/projects/:id', () => {
    it('should delete project', async () => {
      let { body: newProject } = await REST.create(project)
      let { body } = await REST.remove(newProject._id)

      expect(body.title).to.equal(project.title)
      expect(body.description).to.equal(project.description)
    })
  })
})
