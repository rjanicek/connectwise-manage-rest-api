/* jshint 
    browser: true, jquery: true, node: true,
    bitwise: true, camelcase: false, curly: true, eqeqeq: true, esversion: 6, evil: true, expr: true, forin: true, immed: true, indent: 4, latedef: true, multistr: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: single, regexdash: true, strict: true, sub: true, trailing: true, undef: true, unused: vars, white: true
*/

'use strict';

const fetchIt = require('fetch-ponyfill')().fetch;

module.exports = (fqdn, companyId) => {

	let error;

	// fetched api version url
	return fetchIt(`https://${fqdn}/login/companyinfo/${companyId}`)
		.then(response => {
			if (!response.ok) {
				error = new Error(response.statusText);
				error.response = response;
		  	}
			return response.text();
		}).then(responseText => {

			let data;
			try {
				data = JSON.parse(responseText);
			}catch(e) {}

			if (typeof error !== 'undefined') {
				error.responseBody = data || responseText;
				throw error;
			}

			const version = data.Codebase.replace(/\//g, '');
			return Promise.resolve(version);
		});
};
