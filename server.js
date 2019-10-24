const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
var connections = []


app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/build'))
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html')
})

server.listen(3000, () => {
	console.log('Barco control webApp listening on port 3000')
})


io.on('connection', (socket) => {
	connections.push(socket)

	console.log(`server: number of client connections = ${connections.length}`)

	socket.on('page loaded', () => {
		console.log('page loaded')
	})

	socket.on('lens command', (data) => {
		console.log(data)


		switch (data.action) {
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
