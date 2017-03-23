import express from 'express'
import userRoutes from './user.route'
import authRoutes from './auth.route'
import actionRoutes from './action.route'
import expressJwt from 'express-jwt'
import config from '../../config/config'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/actions', expressJwt({ secret: config.jwtSecret }), actionRoutes)

export default router
