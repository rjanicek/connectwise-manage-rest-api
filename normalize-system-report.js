/* jshint
    browser: true, jquery: true, node: true,
    bitwise: true, camelcase: false, curly: true, eqeqeq: true, esversion: 6, evil: true, expr: true, forin: true, immed: true, indent: 4, latedef: true, multistr: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: single, regexdash: true, strict: true, sub: true, trailing: true, undef: true, unused: vars, white: true
*/

'use strict';

const _ = require('lodash/core');

module.exports = systemReport => {
    const keys = systemReport.column_definitions.map(x => _.head(_.keys(x)));
    return _.map(systemReport.row_values, values => {
        return _.reduce(values, (object, value, index) => {
            object[keys[index]] = value;
            return object;
        }, {});
    });
};
