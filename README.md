ConnectWise Manage REST API
===========================

A lightweight interface that preserves the syntax but removes as much boiler plate code as possible for using the ConnectWise REST API's.

api documentation
-----------------
https://developer.connectwise.com/REST_Documentation

features
--------
* uses promises
* automatic API version lookup with option to specify specific version
* option to retry in case of timeout
* works in browser and node.js

usage
-----
```JavaScript

const psa = require ('connectwise-manage-rest-api')({
	fqdn: '​api-na.myconnectwise.net',
	companyId: '################',
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
npm install --save connectwise-manage-rest-api
```
