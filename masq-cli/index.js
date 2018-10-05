const swarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const wrtc = require('wrtc')
const ram = require('random-access-memory')
const hyperdb = require('hyperdb')

// TODO: the unique channel will be given by the app, off the record
const hub = signalhub('swarm-example', ['localhost:8080'])
const sw = swarm(hub, { wrtc })

sw.on('peer', function (peer, id) {
  console.log('connected to a new peer:', id)
  console.log('total peers:', sw.peers.length)
  // App request a new db
  // generate a db, start replicating, and send the key
  // The app starts to replicate, then send its key to authorize it as a writer.
  // Masq stores and replicates the db as soon as it starts
  // data: { cmd, key}
  let db = null

  peer.on('data', data => {
    const json = JSON.parse(data)
    const cmd = json.cmd

    if (cmd === 'requestDB') {
      console.log('requestDB')
      // Create app, asks user if he want to authorize it
      db = hyperdb(ram)
      db.on('ready', () =>
        peer.send(JSON.stringify({
          cmd: 'key',
          key: db.key.toString('hex')
        }))
      )
    }

    if (cmd === 'key') {
      console.log('cmd key', json.key)
      db.authorize(Buffer(json.key), (err) => {
        if (err) return console.error(err)
        peer.send(JSON.stringify({ cmd: 'success' }))
      })
    }
  })
})

sw.on('disconnect', function (peer, id) {
  console.log('disconnected from a peer:', id)
  console.log('total peers:', sw.peers.length)
})

// An app generate a masq link, containing the discoveryKey of
// its hyperdb instance
// Masq will then join it and decide to sync the app or not
