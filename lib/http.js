'use strict';


const http = require('http'),
	https = require('https'),
	log = require('./log');


const PATH = '/', // HTTP path to be checked
	VER_HEADER = 'server', // response header which should contain server version string
	WORDPRESS_STRING = '/wp-content/'; // string to be searched in body in order to determine Wordpress site


/**
 * @typedef {{version: string, wordpress: boolean}} HTTPResult
 */


/**
 * Returns function which handles incoming HTTP response.
 *
 * @param {function} resolve Promise's resolve function
 * @param {function} reject Promise's reject function
 * @returns {function(object)}
 */
const responseHandler = function(resolve, reject) {
	return (response) => {
		log('[http:responseHandler] Got response from host');

		// response body buffer
		let data = '';

		// handles all data received event
		const endHandler = function() {
			log('[http:endHandler] Data transfer finished');

			const result = {wordpress: false, version: null};

			// look for wordpress
			if (data.indexOf(WORDPRESS_STRING) > -1) {
				result.wordpress = true;
			}

			// look for server version
			if (VER_HEADER in response.headers) {
				result.version = response.headers[VER_HEADER];
			}

			resolve(result);
		};

		// handles incoming data
		const dataHandler = function(buf) {
			data += buf;
			log(`[http:dataHandler] Received ${buf.length} bytes`);
		};

		// wire up
		response.on('data', dataHandler)
			.on('end', endHandler)
			.on('error', reject);
	};
};


/**
 * Returns function which handles errors.
 *
 * @param {function} resolve Promise's resolve function
 * @param {function} reject Promise's reject function
 * @returns {function(Error)}
 */
const errorHandler = function(resolve, reject) {
	return (error) => {
		log(`[http:errorHandler] ${error.message}`);
		resolve({});
	};
};


/**
 * Makes plain HTTP connection to host.
 *
 * @param {string} host Hostname
 * @returns {Promise<HTTPResult>}
 */
const plain = function(host) {
	log(`[http:plain] Making HTTP request to ${host}...`);

	return new Promise((resolve, reject) => {
		http.request({host: host, path: PATH}, responseHandler(resolve, reject))
			.on('error', errorHandler(resolve, reject))
			.end();
	});
};


/**
 * Makes HTTPS connection to host.
 *
 * @param {string} host Hostname
 * @returns {Promise<HTTPResult>}
 */
const ssl = function(host) {
	log(`[http:ssl] Making HTTPS request to ${host}...`);

	return new Promise((resolve, reject) => {
		https.request({host: host, path: PATH}, responseHandler(resolve, reject))
			.on('error', errorHandler(resolve, reject))
			.end();
	});
};


module.exports = {plain, ssl};