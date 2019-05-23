'use strict'

const { app, server } = require('../../../bin/www')
const request = require('supertest')

describe('API Folders (v1)', () => {
  // ********** CONFIG **********

  beforeAll((done) => {
    server.on('listening', () => {
      done()
    })
  })

  afterAll((done) => {
    _db.dropDatabase()
  })

  // ********** TEST **********

  test('Get a empty list of folders [200]', (done) => {
    return request(app).get('/api/v1/folders')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ list: [], total: 0 })
        done()
      })
  })

  test('Create a new folder [201]', (done) => {
    const folder = { path: null, name: 'f-01' }
    return request(app).post('/api/v1/folders')
      .expect(201)
      .send(folder)
      .set('Content-Type', 'application/json')
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: 'f-01',
            created_at: expect.any(String),
            path: null
          })
        )
        done()
      })
  })

  test('Create a new folder with a malformed path [400]', (done) => {
    const folder = { path: '/f-01.+', name: 'f-01' }
    return request(app).post('/api/v1/folders')
      .expect(400)
      .send(folder)
      .set('Content-Type', 'application/json')
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            error: expect.any(String)
          })
        )
        done()
      })
  })

  test('Create a subfolder in a non-existent folder [404]', (done) => {
    const folder = { path: '/f-02/', name: 'f-01' }
    return request(app).post('/api/v1/folders')
      .expect(404)
      .send(folder)
      .set('Content-Type', 'application/json')
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            error: expect.any(String)
          })
        )
        done()
      })
  })

  test('Create an existing folder [409]', (done) => {
    const folder = { path: null, name: 'f-01' }
    return request(app).post('/api/v1/folders')
      .expect(409)
      .send(folder)
      .set('Content-Type', 'application/json')
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            error: expect.any(String)
          })
        )
        done()
      })
  })

  test('Get a not empty list of folders [200]', (done) => {
    return request(app).get('/api/v1/folders')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            list: expect.any(Array),
            total: 1
          })
        )
        expect(response.body.list[0]).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            created_at: expect.any(String),
            name: expect.any(String),
            path: null
          })
        )
        done()
      })
  })
})
