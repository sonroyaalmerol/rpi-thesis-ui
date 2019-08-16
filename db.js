const PouchDB = require("pouchdb")
PouchDB.plugin(require('pouchdb-find'))

const db = new PouchDB('http://admin:admin123@127.0.0.1:5984/thesis-data')
exports.db = db
