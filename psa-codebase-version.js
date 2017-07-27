'use strict';

const fetchIt = require('fetch-ponyfill')().fetch;

module.exports = async (fqdn, companyId) => {

    let error;

    // fetched api version url
    const response = await fetchIt(`https://${fqdn}/login/companyinfo/${companyId}`);

    if (!response.ok) {
        error = new Error(response.statusText);
        error.response = response;
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

    const version = data.Codebase.replace(/\//g, '');
    return version;

};
