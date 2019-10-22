const express = require('express')
const app = express()
const server = require('http').Server(app)
const net = require('net')
const ipaddr = process.argv[2] || '10.208.79.50'
var connections = []
var isOnline = undefined


app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/build'))


const device = net.createConnection({
	port: 9990,
	host: ipaddr
}, () => {
	console.log(`connecting to router at: ${ipaddr}`)
})



device.on('connect', () => {
	isOnline = true
})



device.on('data', (data) => {
	console.log(data.toString());
})



device.on('close', () => {
	isOnline = false
	console.log('connection closed')
})



device.on('end', () => {
	isOnline = null
	console.log('projector connection ended')
})


device.on('error', () => {
	isOnline = false
	console.log('projector connection error')
})


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html')
})


io.on('connection', (socket) => {
	connections.push(socket)
	

	socket.on('disconnect', function (socket) {
		connections.splice(connections.indexOf(socket), 1)
		console.log(`server: number of client connections = ${connections.length}`)
	})
	
	
	if (isOnline === true) {
		console.log('client connection: projector is online')		
	}
	
	socket.on('get io', () => {
		console.log('socket - get io')
		socket.emit('io init', ioTable)
	})

})


function startWebServer() {
	server.listen(3000, () => {
		console.log('Barco control webApp listening on port 3000')
	})	
}

