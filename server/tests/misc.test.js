import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import app from '../../index'

chai.config.includeStack = true

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', async () => {
      await request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK')
        })
    })
  })

  describe('# GET /api/404', () => {
    it('should return 404 status', async () => {
      await request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
        })
    })
  })

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', async () => {
      await request(app)
        .get('/api/users/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error')
        })
    })

    it('should handle express validation error - username and password is required', async () => {
      await request(app)
        .post('/api/users')
        .send({
          mobileNumber: '1234567890'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('"username" is required and "password" is required')
        })
    })
  })
})
