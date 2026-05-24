import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from '../../src/app.js'
import { mockUserPreferences, mockUserPreferencesManual } from '../data/index.js'
import { authHandlers } from '../handlers/authHandlers.js'
import { userPreferencesHandlers } from '../handlers/userPreferencesHandlers.js'
import { AUTH_HEADER } from '../helpers.js'
import { server } from '../server.js'

const app = createApp()

// ---------------------------------------------------------------------------
// GET /users/me/preferences
// ---------------------------------------------------------------------------

describe('GET /users/me/preferences', () => {
  it('returns 200 with default preferences', async () => {
    const res = await request(app)
      .get('/users/me/preferences')
      .set(AUTH_HEADER)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      user_id: mockUserPreferences.user_id,
      mode: null,
      has_seen_onboarding: false,
      initial_balance_set: false,
    })
  })

  it('returns 401 without authorization header', async () => {
    const res = await request(app).get('/users/me/preferences')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 401 with invalid token', async () => {
    server.use(authHandlers.unauthorized)

    const res = await request(app)
      .get('/users/me/preferences')
      .set(AUTH_HEADER)

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 500 on database error', async () => {
    server.use(
      userPreferencesHandlers.dbErrorGet,
      userPreferencesHandlers.dbErrorPost,
      userPreferencesHandlers.dbErrorPatch
    )

    const res = await request(app)
      .get('/users/me/preferences')
      .set(AUTH_HEADER)

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })
})

// ---------------------------------------------------------------------------
// PUT /users/me/preferences
// ---------------------------------------------------------------------------

describe('PUT /users/me/preferences', () => {
  it('returns 200 with updated preferences', async () => {
    const res = await request(app)
      .put('/users/me/preferences')
      .set(AUTH_HEADER)
      .send({ mode: 'manual', has_seen_onboarding: true })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      mode: mockUserPreferencesManual.mode,
      has_seen_onboarding: mockUserPreferencesManual.has_seen_onboarding,
    })
  })

  it('returns 400 with invalid mode value', async () => {
    const res = await request(app)
      .put('/users/me/preferences')
      .set(AUTH_HEADER)
      .send({ mode: 'invalid' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 401 without authorization', async () => {
    const res = await request(app)
      .put('/users/me/preferences')
      .send({ mode: 'manual' })

    expect(res.status).toBe(401)
  })

  it('returns 500 on database error', async () => {
    server.use(
      userPreferencesHandlers.dbErrorGet,
      userPreferencesHandlers.dbErrorPost,
      userPreferencesHandlers.dbErrorPatch
    )

    const res = await request(app)
      .put('/users/me/preferences')
      .set(AUTH_HEADER)
      .send({ mode: 'manual' })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })
})

// ---------------------------------------------------------------------------
// POST /users/me/initial-balance
// ---------------------------------------------------------------------------

describe('POST /users/me/initial-balance', () => {
  it('returns 200 with reference and flag', async () => {
    const res = await request(app)
      .post('/users/me/initial-balance')
      .set(AUTH_HEADER)
      .send({ amount: 1500 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      reference: 1500,
      initial_balance_set: true,
    })
  })

  it('returns 400 with missing amount', async () => {
    const res = await request(app)
      .post('/users/me/initial-balance')
      .set(AUTH_HEADER)
      .send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 400 with non-numeric amount', async () => {
    const res = await request(app)
      .post('/users/me/initial-balance')
      .set(AUTH_HEADER)
      .send({ amount: 'not-a-number' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 401 without authorization', async () => {
    const res = await request(app)
      .post('/users/me/initial-balance')
      .send({ amount: 1500 })

    expect(res.status).toBe(401)
  })

  it('returns 500 when preferences upsert/update fails', async () => {
    server.use(
      userPreferencesHandlers.dbErrorGet,
      userPreferencesHandlers.dbErrorPost,
      userPreferencesHandlers.dbErrorPatch
    )

    const res = await request(app)
      .post('/users/me/initial-balance')
      .set(AUTH_HEADER)
      .send({ amount: 1500 })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })
})
