'use strict';

const _ = require('lodash');

const slack = require('./slack');

const VALID_COMMANDS = ['create project', 'deploy fn', 'show fn', 'add fn'];

var functions = {};

functions.create_project = function(params, callback) {
    console.log('handle_slack_commands.create_project');
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to create a new build project.'
        });
    }
    slack.create_dialog(params.trigger_id, function(err, body) {
        if (err) {
            return callback(null, {
                statusCode: 200,
                body: {
                    message: 'Unable to complete this command.  Please try again or check the logs.',
                    err: err
                }
            });
        } else if (!body.ok) {
            return callback(null, {
                statusCode: 200,
                body: body.error
            });
        } else {
            return callback(null, {
                statusCode: 200,
                body: ''
            });
        }
    });
};

functions.handle = function(body, callback) {
    console.log('handle_slack_commands.handle');
    // Is the token valid?
    if (!_.isEqual(body.token, process.env.SlackVerificationToken)) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid token'
        });
    }

    // Is the command valid?
    if (_.isNil(body.text) || _.isEmpty(body.text)) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid command'
        });
    }

    // Get the command.
    var options = _.split(body.text, /[ ]+/);
    var command = _.toLower(_.head(options));
    options = _.drop(options);
    command = command + ' ' + _.toLower(_.head(options));
    options = _.drop(options);

    // Validate the command
    if (!_.includes(VALID_COMMANDS, command)) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid command.  Must be one of ['+ _.join(VALID_COMMANDS) +'].'
        });
    }

    // Execute the command
    functions[_.replace(command, ' ', '_')](
        {
            options: options,
            trigger_id: body.trigger_id
        }, callback);
};

module.exports = functions;