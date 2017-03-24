import app from '../../index'
import request from 'supertest-as-promised'

export default function (baseUrl, defaultToken) {
  function list ({token = defaultToken, status = 200} = {}) {
    return request(app)
      .get(baseUrl)
      .set('Authorization', token)
      .expect(status)
  }

  function get (id, {token = defaultToken, status = 200} = {}) {
    return request(app)
      .get(`${baseUrl}/${id}`)
      .set('Authorization', token)
      .expect(status)
  }

  function create (data, {token = defaultToken, status = 200} = {}) {
    return request(app)
      .post(baseUrl)
      .send(data)
      .set('Authorization', token)
      .expect(status)
  }

  function createMany (datas, {token = defaultToken, status = 200} = {}) {
    return Promise.all(datas.map(_ => create(_, status, token)))
      .then(_s => _s.map(_ => _.body))
  }

  function update (data, {token = defaultToken, status = 200} = {}) {
    return request(app)
      .put(`${baseUrl}/${data._id}`)
      .send(data)
      .set('Authorization', token)
      .expect(status)
  }

  function remove (id, {token = defaultToken, status = 200} = {}) {
    return request(app)
      .delete(`${baseUrl}/${id}`)
      .set('Authorization', token)
      .expect(status)
  }

  function removeMany (ids, {token = defaultToken, status = 200} = {}) {
    return Promise.all(ids.map(_ => remove(_, status, token)))
      .then(_s => _s.map(_ => _.body))
  }

  return { list, get, create, createMany, update, remove, removeMany }
}
