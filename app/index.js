'use strict';

const qs = require('querystring');
const _ = require('lodash');

const handle_slack_commands = require('./lib/handle_slack_commands');
const handle_slack_interactive_components = require('./lib/handle_slack_interactive_components');
const handle_sns = require('./lib/handle_sns');
const handle_codebuild = require('./lib/handle_codebuild');
const handle_codepipeline = require('./lib/handle_codepipeline');

//
// Handles all Slack API calls
//
exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, 3));
    if (!_.isNil(event.source) && _.isEqual(event.source, 'aws.codebuild')) {
        handle_codebuild.handle(event, callback);
        return;
    } else if (!_.isNil(event['CodePipeline.job'])) {
        handle_codepipeline.handle(event, context);
        return;
    } else if (!_.isNil(event.Records) && _.isEqual(event.Records[0].EventSource, 'aws:sns')) {
        handle_sns.handle(event.Records[0], callback);
        return;
    }

    const body = qs.parse(event.body);
    console.log(JSON.stringify(body, null, 3));

    if (_.isEqual(event.path, '/slack/commands')) {
        handle_slack_commands.handle(body, callback);
        return;
    } else if (_.isEqual(event.path, '/slack/interactive-components')) {
        handle_slack_interactive_components.handle(body, callback);
        return;
    } else {
        return callback(null, {
            statusCode: 200,
            body: 'Unknown command'
        });
    }
};
