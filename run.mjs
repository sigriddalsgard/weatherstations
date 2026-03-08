import * as d3 from 'd3'
import HyperDB from 'hyperdb'
import def from './spec/hyperdb/index.js'
import Hypercore from 'hypercore'

import { retention } from 'hyperdb-retention'

import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { writeFile } from 'fs/promises'

const core = new Hypercore('./weather.db')
const db = HyperDB.bee(core, def, { autoUpdate: true })
await db.ready()

const stations = [
  { name: 'Tórshavn', lat: 62.01, lon: -6.77 },
  { name: 'Klaksvík', lat: 62.23, lon: -6.59 },
  { name: 'Vágur', lat: 61.47, lon: -6.81 }
]

setInterval(async () => {
  const station = stations[Math.floor(Math.random() * stations.length)]
  await db.insert('@weatherstations/climate', {
    timestamp: new Date(),
    name: station.name,
    temperature: Number((Math.random() * 10 + 10).toFixed(1)),
    humidity: Number((Math.random() * 20 + 60).toFixed(1))
  })
  await db.flush()

  await retention(db, {
    collection: '@weatherstations/climate',
    maxAge: 3 * 1000
  })
}, 1000)


// Simple server
const server = createServer(async (req, res) => {
  if (req.url === '/') {
    const html = await readFile('./index.html', 'utf-8')
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  } else if (req.url === '/data') {
    const all = await db.find('@weatherstations/climate').toArray()
    const data = JSON.stringify(all, null, 2)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(data)
  }
})

server.listen(3000, () => console.log('Server kører på http://localhost:3000'))

