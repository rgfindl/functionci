'use strict';

const _ = require('lodash');
const slack = require('./slack');
const dao = require('./dao');
const async = require('async');

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
        async.waterfall([
            function(next) {
                dao.get_project({
                    project_id: _.replace(message.LogicalResourceId, 'functionci-', '')
                }, next);
            },
            function(data, next) {
                dao.delete_project({
                    project_id: _.replace(message.LogicalResourceId, 'functionci-', '')
                }, function(err, results) {
                    next(err, data);
                });
            },
            function(data, next) {
                slack.post_message({
                    channel: data.Item.channel,
                    text: '*** Project creation failed - '+ data.Item.project_id+') ***'
                }, next);
            }
        ], callback);
    } else if (_.isEqual(message.ResourceStatus, 'DELETE_COMPLETE') &&
        _.isEqual(message.ResourceType, 'AWS::CloudFormation::Stack')) {
        // Tell user it didn't work.
        async.waterfall([
            function(next) {
                dao.get_project({
                    project_id: _.replace(message.LogicalResourceId, 'functionci-', '')
                }, next);
            },
            function(data, next) {
                dao.delete_project({
                    project_id: _.replace(message.LogicalResourceId, 'functionci-', '')
                }, function(err, results) {
                    next(err, data);
                });
            },
            function(data, next) {
                slack.post_message({
                    channel: data.Item.channel,
                    text: 'Project deleted - '+ data.Item.project_id
                }, next);
            }
        ], callback);
    } else if (_.isEqual(message.ResourceStatus, 'CREATE_COMPLETE') &&
        _.isEqual(message.ResourceType, 'AWS::CloudFormation::Stack')) {
        // Add to DB.
        // Tell user it worked.
        async.waterfall([
            function(next) {
                dao.get_project({
                    project_id: _.replace(message.LogicalResourceId, 'functionci-', '')
                }, next);
            },
            function(data, next) {
                slack.post_message({
                    channel: data.Item.channel,
                    text: 'Project created - '+ data.Item.project_id+')'
                }, next);
            }
        ], callback);
    } else {
        callback();
    }
};
module.exports = functions;