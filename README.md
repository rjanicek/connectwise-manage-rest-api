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
* system report data normalizer

usage
-----
```JavaScript

const manage = require ('connectwise-manage-rest-api')({
	fqdn: '​api-na.myconnectwise.net',
	companyId: '################',
	publicKey: '################',
	privateKey: '################',

	// optional settings
	version: 'v4_6_release',   // if ommitted, latest version will be looked up
	timeoutRetries: 10         // number of times to retry request in case of timeout error
});

(async () => {
    const resultGraph = await manage.get(`system/info`);
    console.log(resultGraph);
}).catch(error => {
    console.log(error);
})();

```

see [test.js](./test.js) for more examples

### system report normalizer
```JavaScript
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
```
transforms this
```JavaScript
{ column_definitions:
   [ { Holiday_List_RecID: { type: 'Numeric', isNullable: false } },
     { Holiday_List_Name: { type: 'Text', isNullable: false } },
     { Holiday_Date: { type: 'DateTime', isNullable: false } },
     { Time_Start: { type: 'DateTime', isNullable: true } },
     { Time_End: { type: 'DateTime', isNullable: true } },
     { Description: { type: 'Text', isNullable: false } },
     { Last_Update_UTC: { type: 'DateTime', isNullable: false } },
     { Updated_By: { type: 'Text', isNullable: false } },
     { Time_Zone: { type: 'Text', isNullable: true } } ],
  row_values:
   [ [ 1,
       'Standard Holidays',
       '2016-12-26T05:00:00Z',
       null,
       null,
       'Christmas Day',
       '2015-10-02T18:14:42Z',
       'chigley',
       'Eastern Standard Time' ],
     [ 1,
       'Standard Holidays',
       '2016-12-23T05:00:00Z',
       null,
       null,
       'Christmas Eve',
       '2015-10-02T18:14:32Z',
       'chigley',
       'Eastern Standard Time' ]
   ]
}
```

into this

```JavaScript

[ { Holiday_List_RecID: 1,
    Holiday_List_Name: 'Standard Holidays',
    Holiday_Date: '2016-12-26T05:00:00Z',
    Time_Start: null,
    Time_End: null,
    Description: 'Christmas Day',
    Last_Update_UTC: '2015-10-02T18:14:42Z',
    Updated_By: 'chigley',
    Time_Zone: 'Eastern Standard Time' },
  { Holiday_List_RecID: 1,
    Holiday_List_Name: 'Standard Holidays',
    Holiday_Date: '2016-12-23T05:00:00Z',
    Time_Start: null,
    Time_End: null,
    Description: 'Christmas Eve',
    Last_Update_UTC: '2015-10-02T18:14:32Z',
    Updated_By: 'chigley',
    Time_Zone: 'Eastern Standard Time' }]
```

install
-------
```
npm install connectwise-manage-rest-api
```
