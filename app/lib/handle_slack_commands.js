'use strict';

const _ = require('lodash');

const slack = require('./slack');

const VALID_COMMANDS = ['create project', 'delete project', 'show project', 'show projects', 'deploy fn', 'show fn', 'add fn', 'show fns'];

var functions = {};

functions.add_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to add a new function.  Usage: /fn add fn <short-name> <lambda-arn>'
        });
    }

};

functions.delete_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to delete a function.  Usage: /fn delete fn <short-name>'
        });
    }
};

functions.show_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show a functions deployment history.  Usage: /fn show fn <short-name> '
        });
    }
};

functions.show_fns = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show all functions.  Usage: /fn show fns'
        });
    }

};

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

functions.delete_project = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to delete a project.  Usage: /fn delete project <github_repo-github_branch>'
        });
    }

};

functions.show_project = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show the build history of a project.  Usage: /fn show project <github_repo-github_branch>'
        });
    }

};

functions.show_projects = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show all projects.  Usage: /fn show projects'
        });
    }

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