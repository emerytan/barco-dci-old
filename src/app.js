import io from 'socket.io-client'
var socket = io.connect()



var appMessages = document.getElementById('appMessages')
var ioState = document.getElementById('ioState')
var headerText = document.getElementById('headerText')


document.addEventListener('DOMContentLoaded', function () {

	appMessages.innerText = 'page fully loaded'
	appMessages.style.color = 'green'
	headerText.innerText = "Barco Web Control - Minimal"
	headerText.style.color = 'green'

	document.addEventListener('click', function (event) {
		if (event.target.matches('.btn')) {
			let CMD = event.target.dataset
			appMessages.innerText = `action: ${CMD.action}  <--->   command: ${CMD.command}`
			socket.emit('lens command', {
				action: CMD.action,
				command: CMD.command
			})
		}
	})

	// sockets
	socket.on('connect', () => {
		ioState.innerText = 'Web server online'
		ioState.style.color = 'green'
		console.log('web socket connected')
		socket.emit('page loaded', {
			message: 'hello world'
		})
	})

	
	socket.on('disconnect', () => {
		ioState.innerText = "Web server down"
		ioState.style.color = 'red'
	})
	

	socket.on('io init', (msg) => {
		appMessages.innerText = 'io init socket'
		appMessages.style.color = 'orange'
	})


	socket.on('server messages', (msg) => {
		appMessages.innerText = msg
	})

})



