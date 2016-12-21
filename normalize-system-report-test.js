/* jshint
    browser: true, jquery: true, node: true,
    bitwise: true, camelcase: false, curly: true, eqeqeq: true, esversion: 6, evil: true, expr: true, forin: true, immed: true, indent: 4, latedef: false, multistr: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: single, regexdash: true, strict: true, sub: true, trailing: true, undef: true, unused: vars, white: true
*/

// https://developer.connectwise.com/manage/rest?a=System

'use strict';

const config = require('./test-config');
const log = x => console.log(require('util').inspect(x, {colors: true, depth: null}));
const normalize = require('./normalize-system-report');
const psa = require ('./index')(config);

psa.get('system/reports/holiday')
    .then(holidayReportInColumnarFormat => {
        const holidayDataInSaneObjectFormat = normalize(holidayReportInColumnarFormat);
        log(holidayReportInColumnarFormat);
        log(holidayDataInSaneObjectFormat);
    })
    .catch(log);
