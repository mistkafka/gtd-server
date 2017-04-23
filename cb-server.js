const express = require('express')
const app = express()
const shell = require('shelljs')

app.get('/deploy/:token', (req, res) => {
  let token = req.params.token
  if (token === 'hello-world') {
    shell.exec('./deploy.sh', (code, stdout, stderr) => {
      console.log('done!')
    })
    return res.send('deploying')
  }
  return res.send('Token require')
})

app.listen(4000, () => {
  console.log('server running......')
})
