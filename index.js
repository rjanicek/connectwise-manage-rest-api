/* eslint no-empty: "off" */

'use strict';

const {fetch} = require('fetch-ponyfill')();
const psaCodebaseVersion = require('./psa-codebase-version');

module.exports = cwRestApiConfiguration => {
    const AUTHORIZATION_HEADER = 'Basic ' + Buffer.from(`${cwRestApiConfiguration.companyId}+${cwRestApiConfiguration.publicKey}:${cwRestApiConfiguration.privateKey}`).toString('base64');
    const apiUrl = version => `https://${cwRestApiConfiguration.fqdn}/${version}/apis/3.0/`;

    let promiseToGetApiUrl;
    const makePromiseToGetApiUrl = (async () => {
        // configured api version url
        if (cwRestApiConfiguration.version) {
            return apiUrl(cwRestApiConfiguration.version);
        }

        // fetched api version url
        const version = await psaCodebaseVersion(cwRestApiConfiguration.fqdn, cwRestApiConfiguration.companyId);
        return apiUrl(version);
    });

    async function fetchRequest(options) {

        if (!promiseToGetApiUrl) {
            promiseToGetApiUrl = makePromiseToGetApiUrl();
        }

        let requestOptions = {
            method: options.method || 'GET',
            headers: {
                'connection': 'keep-alive',
                'x-forwarded-proto': 'https',
                Authorization: AUTHORIZATION_HEADER,
                'Content-Type': 'application/json'
            }
        };

        if(cwRestApiConfiguration.clientId){
            requestOptions.headers.clientId = cwRestApiConfiguration.clientId;
        }

        if (options.body) {
            requestOptions.body = options.body;
            if (typeof requestOptions.body === 'object') {
                requestOptions.body = JSON.stringify(requestOptions.body);
            }
        }

        let error;

        const makePromise = (async () => {
            const restApiUrl = await promiseToGetApiUrl;
            const response = await fetch(restApiUrl + options.endpoint, requestOptions);

            if (!response.ok) {
                error = new Error(response.statusText);
                error.response = response;
            }

            if (response.status === 204) {	// 204 = No Content
                return;
            }

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch (e) {}

            if (typeof error !== 'undefined') {
                error.responseBody = data || responseText;
                throw error;
            }

            return data;
        });

        let lastError;
        for (let retry = 1; retry <= (cwRestApiConfiguration.timeoutRetries || 1); retry++) {
            try {
                const promise = makePromise();
                await promise;
                return promise;
            } catch (error) {
                lastError = error;
                if (error.response && error.response.status === 504) {	// 504 = GATEWAY_TIMEOUT
                    continue;
                }
                throw error;                
            }
        }
        throw lastError;
        
    }

    return {
        delete: endpoint => fetchRequest({method: 'DELETE', endpoint}),
        get: 	endpoint => fetchRequest({method: 'GET', endpoint}),
        patch: 	(endpoint, body) => fetchRequest({method: 'PATCH', endpoint, body}),
        post: 	(endpoint, body) => fetchRequest({method: 'POST', endpoint, body}),
        put: 	(endpoint, body) => fetchRequest({method: 'PUT', endpoint, body}),
    };

};
