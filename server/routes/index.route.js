import express from 'express'
import userRoutes from './user.route'
import authRoutes from './auth.route'
import actionRoutes from './action.route'
import projectRoutes from './project.route'
import contextRoutes from './context.route'
import expressJwt from 'express-jwt'
import config from '../../config/config'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK hello-world 3')
)

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/actions', expressJwt({ secret: config.jwtSecret }), actionRoutes)
router.use('/projects', expressJwt({ secret: config.jwtSecret }), projectRoutes)
router.use('/contexts', expressJwt({ secret: config.jwtSecret }), contextRoutes)

export default router
