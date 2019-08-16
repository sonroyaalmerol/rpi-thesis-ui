// required libraries
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('views/vendors'))
const port = 3001
const Papa = require('papaparse')
const moment = require('moment')
var { db, errdb } = require('./db')


app.get('/', async (req, res) => {
  await db.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await db.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}] })
  console.log(result.docs)
  res.render('table', { 
    data: result.docs
  })
})
app.get('/errors', async (req, res) => {
  await errdb.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await errdb.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}] })
  console.log(result.docs)
  res.render('errtable', { 
    data: result.docs
  })
})
app.get('/csv', async (req, res) => {
  await db.createIndex({
    index: { fields: [{'timestamp': 'desc'}] }
  })
  let result = await db.find({ selector: { timestamp: {$exists: true} }, sort: [{timestamp: 'desc'}] })
  console.log(result.docs)
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
