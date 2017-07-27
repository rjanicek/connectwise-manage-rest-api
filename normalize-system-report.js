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
