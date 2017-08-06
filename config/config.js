import Joi from 'joi'

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config()

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_USER: Joi.string(),
  MONGO_PASS: Joi.string(),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  MONGO_DB: Joi.string().required()
    .description('Mongo database name'),

  TEST_MONGO_HOST: Joi.string()
    .description('Mongo DB host url for run test case'),
  TEST_MONGO_PORT: Joi.number()
    .default(27017),
  TEST_MONGO_USER: Joi.string(),
  TEST_MONGO_PASS: Joi.string(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  AUTH_TOKEN_URL: Joi.string().required(),
}).unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    user: envVars.MONGO_USER,
    pass: envVars.MONGO_PASS,
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    db: envVars.MONGO_DB
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    uri: `redis://${envVars.REDIS_HOST}:${envVars.REDIS_PORT}`,
  }
}

if (envVars.NODE_ENV === 'test') {
  config.mongo.user = envVars.TEST_MONGO_USER
  config.mongo.pass = envVars.TEST_MONGO_PASS
  config.mongo.host = envVars.TEST_MONGO_HOST
  config.mongo.port = envVars.TEST_MONGO_PORT
  config.mongo.db = `test_${(new Date()).getTime()}`
}

function getMongoUri (mongo) {
  let uri = ''
  let {user, pass, host, port, db} = mongo
  uri = `${host}:${port}/${db}`
  if (user) {
    uri = `${user}:${pass}@${uri}`
  }
  uri = `mongodb://${uri}`

  return uri
}

config.mongo.uri = getMongoUri(config.mongo)
config.sso = {
  authTokenUrl: envVars.AUTH_TOKEN_URL
}

export default config
