'use strict';


const Socket = require('net').Socket,
	log = require('./log');


const PORT = 22,
	TIMEOUT = 5000;


/**
 * Return SSH version or null if cannot determine.
 *
 * @param {string} host Hostname to be checked
 * @returns {Promise<string|null>}
 */
const version = function(host) {
	return new Promise((resolve, reject) => {
		const socket = new Socket({readable: true, writable: false});


		let data = '';


		// handle incoming data
		const receiveHandler = function (buf) {
			log(`[ssh:receive] Received ${buf.length} bytes`);

			data += buf.toString();

			if (buf.indexOf('\n') > -1)
				socket.end();
		};


		// handles socket close
		const closeHandler = function () {
			log('[ssh:close] Disconnected');

			if (!data.length) {
				reject(new Error('No data received'));
				return;
			}

			// remove CR/LF from the end for nice output
			resolve(data.replace(/\r?\n/, ''));
		};


		// handles connected event
		const connectHandler = function () {
			log('[ssh:connect] Connected');
		};


		// handles connection errors
		const errorHandler = function(error) {
			log(`[ssh:errorHandler] ${error.message}`);
			resolve(null);
		};

		// timeout when no data is received
		socket.setTimeout(TIMEOUT);

		// bind events
		socket.on('connect', connectHandler)
			.on('data', receiveHandler)
			.on('error', errorHandler)
			.on('close', closeHandler);

		// make actual connection
		socket.connect({host: host, port: PORT});
	});
};


// module's public api
module.exports = {version};