'use strict';

const _ = require('lodash');
const slack = require('./slack');

var functions = {};

functions.handle = function(event, callback) {
    console.log('handle_sns');
    var message_items = _.split(event.Sns.Message, '\n');
    var message = [];
    _.forEach(message_items, function(item) {
        const item_parts = _.split(item, '=');
        var obj = {};
        if (!_.isEmpty(item_parts[0])) {
            obj[item_parts[0]] = _.replace(item_parts[1], /'/g, '');
            message.push(obj);
        }
    });
    console.log(JSON.stringify(message, null, 3));
    if (_.startsWith(message.ResourceStatus, 'DELETE_COMPLETE')) {
        // Tell user it didn't work.
        slack.post_message({
            channel: 'G6QD7UBRD',
            text: 'Project setup failed'
        }, callback);
    } else if (_.startsWith(message.ResourceStatus, 'CREATE_COMPLETE') &&
        _.isEqual(message.ResourceType, 'AWS::CloudFormation::Stack')) {
        // Add to DB.
        // Tell user it worked.
        slack.post_message({
            channel: 'G6QD7UBRD',
            text: 'Project setup complete'
        }, callback);
    }
};
module.exports = functions;