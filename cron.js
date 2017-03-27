import 'babel-polyfill'
import mongoose from 'mongoose'
import Project from './server/models/project.model'
import schedule from 'node-schedule'
import config from './config/config'

let crontabMap = null
if (config.env === 'development') {
  crontabMap = {
    'every day': '*/10 * * * * *',
    'every week': '*/1 * * * *',
    'every year': '0 0 31 12 *'
  }
} else {
  crontabMap = {
    'every day': '0 0 * * *',
    'every week': '0 0 * * 0',
    'every year': '0 0 31 12 *'
  }
}

function getSchedule (type) {
  return schedule.scheduleJob(crontabMap[type], async () => {
    let projects = await Project.list()
    projects = projects.filter(_ => {
      return _.reviewSchemas.includes(type)
    })
    const NOW = new Date()
    let promises = []
    for (let project of projects) {
      project.reviewEvents.push({
        date: NOW,
        type
      })
      promises.push(project.save())
    }

    await Promise.all(promises)
  })
}

// Replace mongoose Promise
mongoose.Promise = Promise
// connect to mongo db
const mongoUri = `${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`)
})

console.log(`cron task started at ${new Date().toString()}`)
Object.keys(crontabMap).forEach(_ => getSchedule(_))
