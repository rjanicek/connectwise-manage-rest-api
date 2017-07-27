// https://developer.connectwise.com/manage/rest?a=System

'use strict';

const config = require('./test-config');
const log = x => console.log(require('util').inspect(x, {colors: true, depth: null}));
const normalize = require('./normalize-system-report');
const manage = require ('./index')(config);

(async () => {
    const holidayReportInColumnarFormat = await manage.get('system/reports/holiday');
    const holidayDataInSaneObjectFormat = normalize(holidayReportInColumnarFormat);
    log(holidayReportInColumnarFormat);
    log(holidayDataInSaneObjectFormat);
})().catch(log);
