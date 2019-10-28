const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
var connections = []
var deviceState = {}



app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/build'))
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html')
})

server.listen(3000, () => {
	console.log('Barco control webApp listening on port 3000')
	deviceState.lastMac = 18
})


io.on('connection', (socket) => {
	var macros = require('./test').macros
	connections.push(socket)
	
	console.log(`server: number of client connections = ${connections.length}`)

	socket.on('page loaded', () => {
		console.log('page loaded')
		io.sockets.emit('macros', macros)
		io.sockets.emit('power', 1)
		io.sockets.emit('dowser', 1)
		io.sockets.emit('last macro', deviceState.lastMac)
	})

	socket.on('lens command', (data) => {
		console.log(data)

		switch (data.action) {
			case 'power':
				console.log(`send power value: ${data.command}`)
				if (data.command === '0') { // power is on
					console.log('lamp power is on - send off command');
					io.sockets.emit('power', 1)
				} else if (data.command === '1') {
					console.log('lamp power is off - send on command');
					io.sockets.emit('power', 0)
				}
				break;
			case 'dowser':
				console.log(`send dowser value: ${data.command}`)
				if (data.command === '0') { // power is on
					console.log('lamp power is on - send off command');
					io.sockets.emit('dowser', 1)
				} else if (data.command === '1') {
					console.log('lamp power is off - send on command');
					io.sockets.emit('dowser', 0)
				}
				break;
			case 'focus':
				console.log(`send focus value: ${data.command}`)
				break;
			case 'zoom':
				console.log(`send zoom value: ${data.command}`)
				break;
			case 'shift':
				console.log(`send shift value: ${data.command}`)
				break;
			default:
				console.log('projector command not recognized');
				break;
		}
	})

	socket.on('disconnect', function (socket) {
		connections.splice(connections.indexOf(socket), 1)
		console.log(`server: number of client connections = ${connections.length}`)
	})
})
