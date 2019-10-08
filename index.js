// required libraries
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('views/vendors'))
const port = 3001
const Papa = require('papaparse')
const moment = require('moment')
var { db, errdb, settingsdb } = require('./db')

var bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies


app.get('/', async (req, res) => {
  await db.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await db.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}] })
  res.render('table', { 
    data: result.docs,
    moment
  })
})

app.get('/table', async (req, res) => {
  await db.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await db.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}], limit: 999999999999 })
  let setting = await settingsdb.find({ selector: { value: {$exists: true} } })
  res.render('table2', { 
    data: result.docs,
    setting: setting.docs,
    moment
  })
})

app.post('/settings', async (request, response) => {
  Object.keys(request.body).forEach(async (key, index) => {
    var name = key
    var value = request.body[key]
    let setting = await settingsdb.find({ selector: { value: {$exists: true}, name } })
    setting = setting.docs
    
    if (setting.length > 0) {
      await settingsdb.put({
        _id: setting[0]._id,
        _rev: setting[0]._rev,
        name,
        value,
        default: setting[0].default
      })
    } else {
      await settingsdb.put({
        _id: new Date().toJSON(),
        name,
        value,
        default: value
      })
    }
  })
  
  response.redirect('back')
})

app.get('/settingsdef', async (request, response) => {
  let setting = await settingsdb.find({ selector: { value: {$exists: true} } })
  setting = setting.docs
  
  for(var i=0; i < setting.length; i++) {
    await settingsdb.put({
      _id: setting[i]._id,
      _rev: setting[i]._rev,
      name: setting[i].name,
      value: setting[i].default,
      default: setting[i].default
    })
  }
  
  response.redirect('back')
})

app.get('/errors', async (req, res) => {
  await errdb.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await errdb.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}] })
  res.render('errtable', { 
    data: result.docs
  })
})

app.get('/csv', async (req, res) => {
  await db.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await db.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}], limit: 99999999999 })
  result.docs.map((res) => {
      delete res._id
      delete res._rev
      res.timestamp = moment(res.timestamp).format("MMM DD YYYY, h:mm:ss a")
  })
  let csv = Papa.unparse(result.docs)
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'thesis-data-' + Date.now() + '.csv\"')
  res.send(csv)
})

app.listen(port, '127.0.0.1', () => console.log(`Thesis API listening on port ${port}!`))
