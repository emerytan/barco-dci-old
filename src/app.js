import io from 'socket.io-client'
var socket = io.connect()

var appMessages = document.getElementById('appMessages')
var ioState = document.getElementById('ioState')
var headerText = document.getElementById('headerText')
var lensButtons = document.getElementsByTagName('input')
var macroList = document.getElementById('macroList')
var ipList = document.getElementById('ipList')
var lampPower = document.getElementById('lampPower')
var dowser = document.getElementById('dowser')



document.addEventListener('DOMContentLoaded', function () {

	ipList.options.length = 0
	appMessages.innerText = 'page fully loaded'
	appMessages.style.color = 'green'
	headerText.innerText = "CO3 Barco Web Control"
	headerText.style.color = 'green'

	
	
	document.getElementById('test1').addEventListener('click', () => {
		appMessages.innerText = 'test1'
		activateButtons(lensButtons, true)
	})

	document.getElementById('test2').addEventListener('click', () => {
		appMessages.innerText = 'test2'		
		activateButtons(lensButtons, false)
	})

	document.getElementById('test3').addEventListener('click', () => {
		appMessages.innerText = 'test3'		
	})

	document.getElementById('test4').addEventListener('click', () => {
		appMessages.innerText = 'test4'		
	})

	document.addEventListener('click', function (event) {
		if (event.target.matches('.lens')) {
			let CMD = event.target.dataset
			appMessages.innerText = `action: ${CMD.action}  <--->   command: ${CMD.command}`
			socket.emit('lens command', {
				action: CMD.action,
				command: CMD.command
			})
		} else if (event.target.matches('.test')) {
			if (event.target.id === "connect") {
				console.log("send connect socket")
				socket.emit('projector connect', {
					ip: ipList.options[ipList.selectedIndex].text
				})
			}
			if (event.target.id === "selectMacro") {
				console.log("send macro chnage request")
				socket.emit('change macro', {
					index: macroList.options[macroList.selectedIndex].value,
					macroName: macroList.options[macroList.selectedIndex].text
				})
				
			}
		}
	})
	

	// sockets
	socket.on('connect', () => {
		ioState.innerText = 'Web server online'
		ioState.style.color = 'green'
		socket.emit('page loaded', {
			message: 'hello world'
		})
	})


	socket.on('power', (msg) => {
		ioState.innerText = msg
		if (msg === 0) {
			appMessages.innerText = 'lamp is on'
			lampPower.classList.remove('btn-dark')
			lampPower.classList.add('btn-success')
			lampPower.dataset.command = 0
			lampPower.value = 'On'
		} else if (msg === 1) {
			appMessages.innerText = 'lamp is off'
			lampPower.classList.remove('btn-success')
			lampPower.classList.add('btn-dark')
			lampPower.dataset.command = 1
			lampPower.value = 'Off'
		} else {
			appMessages.innerText = 'lamp power command fail'
		}
	})

	socket.on('dowser', (msg) => {
		ioState.innerText = msg
		if (msg === 0) {
			appMessages.innerText = 'dowser is open'
			dowser.classList.remove('btn-dark')
			dowser.classList.add('btn-success')
			dowser.dataset.command = 0
			dowser.value = 'Open'
		} else if (msg === 1) {
			appMessages.innerText = 'dowser is closed'
			dowser.classList.remove('btn-success')
			dowser.classList.add('btn-dark')
			dowser.dataset.command = 1
			dowser.value = 'Closed'
		} else {
			appMessages.innerText = 'dowser command fail'
		}
	})

	socket.on('projectors', (arr) => {
		console.log(arr)
		addProjectors(arr)		
	})

	socket.on('macros', (data) => {
		addMacros(data)
	})

	socket.on('last macro', (msg) => {
		macroList.value = msg
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


function activateButtons(elements, action) {
	var t
	var i = 0
	while (t = elements[i++]) {
		t.disabled = action
	}
}

function addProjectors(arr) {
	let opt
	for (let index = 0; index < arr.length; index++) {
		opt = document.createElement('option')
		opt.textContent = arr[index]
		opt.value = index
		ipList.appendChild(opt)
	}
}

function addMacros(macros) {
	var opt
	for (const key in macros) {
		if (macros.hasOwnProperty(key) && macros[key] != '') {
			opt = document.createElement('option')
			opt.textContent = macros[key]
			opt.value = key
			macroList.appendChild(opt)
		}
	}
}
