'use strict';

const _ = require('lodash');
const slack = require('./slack');

var functions = {};

functions.handle = function(event, callback) {
    console.log('handle_sns');
    var message_items = _.split(event.Sns.Message, '\n');
    var message = {};
    _.forEach(message_items, function(item) {
        const item_parts = _.split(item, '=');
        if (!_.isEmpty(item_parts[0])) {
            message[item_parts[0]] = _.replace(item_parts[1], /'/g, '');
        }
    });
    console.log(message);
    if (_.isEqual(message.ResourceStatus, 'CREATE_FAILED') &&
        _.isEqual(message.ResourceType, 'AWS::CloudFormation::Stack')) {
        // Tell user it didn't work.
        slack.post_message({
            channel: 'C5GGB6Z3L',
            text: 'Project setup failed'
        }, callback);
    } else if (_.isEqual(message.ResourceStatus, 'CREATE_COMPLETE') &&
        _.isEqual(message.ResourceType, 'AWS::CloudFormation::Stack')) {
        // Add to DB.
        // Tell user it worked.
        console.log('here');
        slack.post_message({
            channel: 'G7V37B2P3',
            text: 'Project setup complete'
        }, callback);
    } else {
        callback();
    }
};
module.exports = functions;