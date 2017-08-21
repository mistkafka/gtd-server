import express from 'express'
import userRoutes from './user.route'
import authRoutes from './auth.route'
import appRoutes from './app.route'
import SSOAuth from '../helpers/get-sso-auth'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/apps', SSOAuth, appRoutes)

export default router
