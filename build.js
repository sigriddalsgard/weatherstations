// build.js
const Hyperschema = require('hyperschema')
const HyperDB = require('hyperdb/builder')

const SCHEMA_DIR = './spec/hyperschema' // where the schema definitions are written
const DB_DIR = './spec/hyperdb' // Where to install db definition

// Hyperschema definitions
const schema = Hyperschema.from(SCHEMA_DIR)
const ws = schema.namespace('weatherstations')

// CLIMATE 
 ws.register({
  name: 'climate',
  fields: [
    { name: 'timestamp', type: 'date', required: true },
    { name: 'temperature', type: 'float64', required: true },
    { name: 'humidity', type: 'uint', required: true },
    { name: 'name', type: 'string', required: true }
  ]
})

 ws.register({
  name: 'wind',
  compact: true,
  fields: [
    { name: 'timestamp', type: 'date', required: true },
    { name: 'speed', type: 'float64', required: true },
    { name: 'direction', type: 'string', required: true }
  ]
})

 ws.register({
  name: 'station',
  compact: true,
  fields: [
    { name: 'name', type: 'string', required: true },
    { name: 'lat', type: 'float64', required: true },
    { name: 'lon', type: 'float64', required: true }
  ]
})

Hyperschema.toDisk(schema)

// Hyperdb collection definitions
const db = HyperDB.from(SCHEMA_DIR, DB_DIR)
const wsDB = db.namespace('weatherstations')

// Import helpers (see next step)
// wsDB.require('./helpers.js')

wsDB.collections.register({
  name: 'climate',
  schema: '@weatherstations/climate',
  key: ['timestamp']
})

wsDB.collections.register({
  name: 'wind',
  schema: '@weatherstations/wind',
  key: ['timestamp']
})

wsDB.collections.register({
  name: 'station',
  schema: '@weatherstations/station',
  key: ['name']
})

HyperDB.toDisk(db)
