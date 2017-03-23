import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import app from '../../index'
import randomstring from 'randomstring'

export default async function () {
  const USER = {
    username: randomstring.generate(),
    password: randomstring.generate()
  }

  let info = {
    user: null,
    jwtToken: null
  }

  info.user = await request(app).post('/api/users')
    .send(USER)
    .expect(httpStatus.OK)
    .then((res) => res.body)

  info.jwtToken = await request(app)
    .post('/api/auth/login')
    .send(USER)
    .expect(httpStatus.OK)
    .then((res) => `Bearer ${res.body.token}`)

  return info
}
