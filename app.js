const ssh = require('./ssh'),
	http = require('./http');


const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
	hostRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;


const HOST = process.argv[2];


if (!(ipRegex.test(HOST) || hostRegex.test(HOST))) {
	console.error(`Invalid hostname/ip address: ${HOST}`);
	process.exit(1);
}


const show = function(results) {
	console.log(`Results for ${HOST}:`);
	console.log('');
	console.log(`\tSSH (22)\t\t${results[0] || 'unknown'}`);
	console.log(`\tHTTP (80)\t\t${results[1].version || 'unknown'}${results[1].wordpress ? ' (Wordpress installed)' : ''}`);
	console.log(`\tHTTP (443)\t\t${results[2].version || 'unknown'}${results[2].wordpress ? ' (Wordpress installed)' : ''}`);
	console.log('');
};


Promise.all([
		ssh.version(HOST),
		http.plain(HOST),
		http.ssl(HOST)
	])
	.then(show)
	.catch(error => console.error(error.stack));