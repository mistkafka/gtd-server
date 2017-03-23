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
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  MONGO_DB: Joi.string().required()
    .description('Mongo database name'),
  TEST_MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url for run test case'),
  TEST_MONGO_PORT: Joi.number()
    .default(27017)
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
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    db: envVars.MONGO_DB
  }
}

if (envVars.NODE_ENV === 'test') {
  config.mongo.host = envVars.TEST_MONGO_HOST
  config.mongo.port = envVars.TEST_MONGO_PORT
  config.mongo.db = `test_${(new Date()).getTime()}`
}

export default config
