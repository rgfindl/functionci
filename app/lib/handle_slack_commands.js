'use strict';

const _ = require('lodash');
const async = require('async');

const slack = require('./slack');
const dao = require('./dao');
const cloudformation = require('./cloudformation');
const lambda = require('./lambda');

const VALID_COMMANDS = ['create project', 'delete project', 'show project', 'show projects', 'deploy fn', 'show fn', 'add fn', 'show fns', 'delete fn'];

var functions = {};

functions.add_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to add a new function.  Usage: /fn add fn <short-name> <lambda-arn>'
        });
    }

    if (_.size(params.options) != 3) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid format.  Usage: /fn add fn <short-name> <lambda-arn>'
        });
    }

    const short_name = _.toLower(_.head(params.options));
    params.options = _.drop(params.options);
    const arn = _.head(params.options);

    dao.put_fn({
        short_name: short_name,
        arn: arn
    }, function(err, data) {
        if (err) {
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
            });
        } else {
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Function has been added.'
                })
            });
        }
    });
};

functions.delete_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to delete a function.  Usage: /fn delete fn <short-name>'
        });
    }

    if (_.size(params.options) != 2) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid format.  Usage: /fn delete fn <short-name>'
        });
    }

    const short_name = _.toLower(_.head(params.options));

    dao.delete_fn({
        short_name: short_name
    }, function(err, data) {
        if (err) {
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
            });
        } else {
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Function has been deleted.'
                })
            });
        }
    });
};

functions.show_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show a functions deployment history.  Usage: /fn show fn <short-name> '
        });
    }

    if (_.size(params.options) != 2) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid format.  Usage: /fn show fn <short-name>'
        });
    }
    const short_name = _.toLower(_.head(params.options));

    dao.get_deployments_per_fn({
        short_name: short_name
    }, function(err, data) {
        if (err) {
            return callback(null, {
                statusCode: 200,
                body: {
                    message: 'Unable to complete this command.  Please try again or check the logs.',
                    err: err
                }
            });
        } else {
            var text = '';
            var div = '';
            _.forEach(data.Items, function(item) {
                text += div;
                text += 'project: '+item.project_id + '\n';
                text += 'version ' + item.build_version + '\n';
                text += 'date ' + item.deployment_date + '\n';
                text += 'by ' + item.user_name + '\n';
                div = '\n';
            });
            // TODO if (!_.isNil(data.LastEvaluatedKey))
            if (_.isEmpty(text)) {
                text = 'You have no deployments.';
            } else {
                text = 'Deployment History:'+div+text;
            }
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: text
                })
            });
        }
    });
};

functions.deploy_fn = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to deploy a function.  Usage: /fn deploy fn <short-name> <project-id> <version>'
        });
    }

    if (_.size(params.options) != 4) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid format.  Usage: /fn deploy fn <short-name> <project-id> <version>'
        });
    }

    const short_name = _.toLower(_.head(params.options));
    params.options = _.drop(params.options);

    const project_id = _.toLower(_.head(params.options));
    params.options = _.drop(params.options);

    const version = _.toLower(_.head(params.options));
    params.options = _.drop(params.options);

    const user_name = _.toLower(_.head(params.options));

    async.waterfall([
        function(next) {
            console.log('get fn');
            dao.get_fn({
                short_name: short_name
            }, next);
        },
        function(fn_results, next) {
            console.log('get build');
            dao.get_build({
                project_id: project_id,
                version: version
            }, function(err, build_results) {
                if (err) return next(err);
                next(null, {
                    fn: fn_results.Item,
                    build: build_results.Item
                });
            });
        },
        function(results, next) {
            console.log('deploy lambda');
            console.log(JSON.stringify(results, null, 3));
            lambda.deploy({
                arn: results.fn.arn,
                bucket: results.build.bucket,
                key: results.build.key
            }, function(err, deploy_results) {
                if (err) return next(err);
                results.deployment = deploy_results;
                next(null, results);
            });
        },
        function(results, next) {
            console.log('save deployment');
            var now = new Date();
            dao.put_deployment({
                fn_short_name: short_name,
                deployment_date: now + '',
                build_version: version,
                project_id: project_id,
                lambda_version: results.deployment.Version,
                user_name: user_name
            }, next);
        }
    ], function(err, results) {
        if (err) {
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
            });
        } else {
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: project_id+ ', version '+version+' has been deployed to '+short_name+'.'
                })
            });
        }
    });
};

functions.show_fns = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show all functions.  Usage: /fn show fns'
        });
    }

    dao.get_fns({}, function(err, data) {
        if (err) {
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
            });
        } else {
            var text = '';
            var div = '';
            _.forEach(data.Items, function(item) {
                text += div + item.short_name + ' -> ' + item.arn;
                div = '\n';
            });
            // TODO if (!_.isNil(data.LastEvaluatedKey))
            if (_.isEmpty(text)) {
                text = 'You have no functions.';
            } else {
                text = 'Functions:'+div+text;
            }
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: text
                })
            });
        }
    });
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
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
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

    if (_.size(params.options) != 2) {
        return callback(null, {
            statusCode: 200,
            body: 'Invalid format.  Usage: /fn delete project <github_repo-github_branch>'
        });
    }

    const project_id = _.toLower(_.head(params.options));

    cloudformation.delete_stack({
        project_id: project_id
    }, function(err, data) {
        if (err) {
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
            });
        } else {
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Project is being deleted.'
                })
            });
        }
    });
};

functions.show_project = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show the build history of a project.  Usage: /fn show project <github_repo-github_branch>'
        });
    }
    const project_id = _.toLower(_.head(params.options));

    dao.get_builds_per_project({
        project_id: project_id
    }, function(err, data) {
        if (err) {
            return callback(null, {
                statusCode: 200,
                body: {
                    message: 'Unable to complete this command.  Please try again or check the logs.',
                    err: err
                }
            });
        } else {
            var text = '';
            var div = '';
            _.forEach(data.Items, function(item) {
                text += div;
                text += 'version ' + item.version + '\n';
                text += 'commit ' + _.truncate(item.commit, {length: 6, omission: ''}) + '\n';
                text += 'date ' + item.build_date + '\n';
                div = '\n';
            });
            // TODO if (!_.isNil(data.LastEvaluatedKey))
            if (_.isEmpty(text)) {
                text = 'You have no builds.';
            } else {
                text = 'Build History:'+div+text;
            }
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: text
                })
            });
        }
    });
};

functions.show_projects = function(params, callback) {
    if (_.isEqual(_.toLower(_.head(params.options)), 'help')) {
        return callback(null, {
            statusCode: 200,
            body: 'Use this command to show all projects.  Usage: /fn show projects'
        });
    }

    dao.get_projects({}, function(err, data) {
        if (err) {
            console.log(err);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: 'Unable to complete this command.  Please try again or check the logs.'
                })
            });
        } else {
            var text = '';
            var div = '';
            _.forEach(data.Items, function(item) {
                text += div + item.project_id + ' -> ' + item.github_url;
                div = '\n';
            });
            // TODO if (!_.isNil(data.LastEvaluatedKey))
            if (_.isEmpty(text)) {
                text = 'You have no projects.';
            } else {
                text = 'Projects:'+div + text;
            }
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    response_type: "in_channel",
                    text: text
                })
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
    options.push(body.user_name);

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