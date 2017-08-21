import config from '../../config/config'
import getSSOAuth from '../helpers/sso-auth'

const SSOAuth = getSSOAuth({
  redis: config.redis.uri,
  expressJwtConfig: {
    secret: config.jwtSecret
  },
  authUrl: config.sso.authTokenUrl
})

export default SSOAuth
