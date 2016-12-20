/* jshint 
    browser: true, jquery: true, node: true,
    bitwise: true, camelcase: false, curly: true, eqeqeq: true, esversion: 6, evil: true, expr: true, forin: true, immed: true, indent: 4, latedef: true, multistr: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: single, regexdash: true, strict: true, sub: true, trailing: true, undef: true, unused: vars, white: true
*/

'use strict';

const fetchIt = require('fetch-ponyfill')().fetch;
const promiseRetry = require('promise-retry');
const psaCodebaseVersion = require('./psa-codebase-version');

module.exports = cwRestApiConfiguration => {
	const AUTHORIZATION_HEADER = 'Basic ' + new Buffer(`${cwRestApiConfiguration.companyId}+${cwRestApiConfiguration.publicKey}:${cwRestApiConfiguration.privateKey}`).toString('base64');
	const apiUrl = version => `https://${cwRestApiConfiguration.fqdn}/${version}/apis/3.0/`;
	let cachedApiUrl;

	function fetchRequest(options) {

		let requestOptions = {
			method: options.method || 'GET',
			headers: {
		    	'x-forwarded-proto': 'https',
		    	Authorization: AUTHORIZATION_HEADER,
		    	'Content-Type': 'application/json'
		  	}
		};

	  	if (options.body) {
	  		requestOptions.body = options.body;
			if (typeof requestOptions.body === 'object') {
				requestOptions.body = JSON.stringify(requestOptions.body);
			}
	  	}

		const promiseToGetApiUrl = (() => {
			// cached api url
			if (cachedApiUrl) {
				return Promise.resolve(cachedApiUrl);
			}

			// configured api version url
			if (cwRestApiConfiguration.version) {
				cachedApiUrl = apiUrl(cwRestApiConfiguration.version);
				return Promise.resolve(cachedApiUrl);
			}

			// fetched api version url
			return psaCodebaseVersion(cwRestApiConfiguration.fqdn, cwRestApiConfiguration.companyId)
				.then(version => {
					cachedApiUrl = apiUrl(version);
					return Promise.resolve(cachedApiUrl);
				});
		})();

		let error;

		const promise = promiseToGetApiUrl
			.then(restApiUrl => fetchIt(restApiUrl + options.endpoint, requestOptions))
			.then(response => {
				if (!response.ok) {
					error = new Error(response.statusText);
					error.response = response;
			  	}

			  	if (response.status === 204) {	// 204 = No Content
			  		return Promise.resolve();
			  	}

			  	return response.text();
			}).then(responseText => {
				let data;

				try {
					data = JSON.parse(responseText);
				} catch (e) {}

				if (typeof error !== 'undefined') {
					error.responseBody = data || responseText;
					throw error;
				}

				return Promise.resolve(data);
			});

		if (!cwRestApiConfiguration.timeoutRetries) {
			return promise;
		}

		return promiseRetry((retry, number) => {
		    return promise.catch(error => {
	        	if (error.response && error.response.status === 504) {	// 504 = GATEWAY_TIMEOUT
		            retry(error);
		        }
		        throw error;
		    });
		}, {retries: cwRestApiConfiguration.timeoutRetries});

	}

	return {
		delete: endpoint => fetchRequest({method: 'DELETE', endpoint}),
		get: 	endpoint => fetchRequest({method: 'GET', endpoint}),
		patch: 	(endpoint, body) => fetchRequest({method: 'PATCH', endpoint, body}),
		post: 	(endpoint, body) => fetchRequest({method: 'POST', endpoint, body}),
		put: 	(endpoint, body) => fetchRequest({method: 'PUT', endpoint, body}),
	};

};
