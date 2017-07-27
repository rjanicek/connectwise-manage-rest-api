'use strict';

const config = require('./test-config');
const log = x => console.log(require('util').inspect(x, {colors: true}));

const manage = require ('./index')(config);

const SERIAL_BATCH_COUNT = 1;
const CONCURRENT_REQUEST_COUNT = 500;

(async () => {
    console.log(`making ${SERIAL_BATCH_COUNT * CONCURRENT_REQUEST_COUNT} api requests...`);

    for (let serial = 1; serial <= SERIAL_BATCH_COUNT; serial++) {
        const concurrentPromises = [];
        for (let concurrent = 1; concurrent <= CONCURRENT_REQUEST_COUNT; concurrent++) {
            concurrentPromises.push(manage.get(`system/info`));
        }
        await Promise.all(concurrentPromises);
        console.log('everything is a-ok');
    }
})().catch(error => {
    log(error);
});
