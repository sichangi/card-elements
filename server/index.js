var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile('public/framer.js', {root: __dirname})
})

app.get('/frame', (req, res) => {
  res.sendFile('public/form.html', {root: __dirname})
})

app.get('/controller', (req, res) => {
  res.sendFile('public/controller.html', {root: __dirname})
})

app.post('/', (req, res) => {
  const body = req.body
  console.log('Received Card:', `...${body.number.substr(-4)}`)
  res.json({received: true})
})

app.get('/jq', (req, res) => {
  res.sendFile('public/jquery.js', {root: __dirname})
})

app.listen(3000, () => console.log(`Server application http;//localhost:3000\n`))
