// required libraries
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('views/vendors'))
const port = 3000
var db = require('./db').db


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

app.listen(port, '127.0.0.1', () => console.log(`Thesis API listening on port ${port}!`))
