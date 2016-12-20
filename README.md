ConnectWise REST API
====================

A lightweight interface for the ConnectWise REST API.

api documentation
-----------------
https://developer.connectwise.com/REST_Documentation

usage
-----
```JavaScript

const psa = require ('connectwise-rest-api')({
	fqdn: 'idev.connectwisedev.com',
	companyId: 'idev',
	publicKey: '################',
	privateKey: '################',

	// optional settings
	version: 'v4_6_release',   // if ommitted, latest version will be looked up
	timeoutRetries: 10         // number of times to retry request in case of timeout error
});

psa.get(`system/info`)
	.then(resultGraph => {
		console.log(resultGraph);
	}).catch(error => {
		console.log(error);
	});
```

see [test.js](./test.js) for more examples

install
-------
```
npm install --save connectwise-rest-api
```
