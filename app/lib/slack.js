const request = require('request');
const codebuid = require('./codebuild');
const _ = require('lodash');
const async = require('async');

var functions = {};

functions.channels_list = function(params, done) {
    var url = 'https://slack.com/api/channels.list';
    var options = {
        url: url,
        headers: {
            'Authorization':'Bearer '+process.env.SlackOAuthToken
        },
        json: true,
        method: 'GET',
        body: {
            limit: 200
        }
    };
    if (params.cursor) {
        options.body.cursor = cursor;
    }
    request(options, function(err, response, body) {
        done(err, body);
    });
};

functions.groups_list = function(params, done) {
    var url = 'https://slack.com/api/groups.list';
    var options = {
        url: url,
        headers: {
            'Authorization':'Bearer '+process.env.SlackOAuthToken
        },
        json: true,
        method: 'GET'
    };
    request(options, function(err, response, body) {
        done(err, body);
    });
};

functions.fetch_all_channels = function(params, done) {
    async.waterfall([
        async.constant([]),
        function(channels, next_waterfall) {
            var complete = false;
            var params = {};
            async.until(function() {
                return complete;
            }, function(next) {
                functions.channels_list(params, function(err, results) {
                    if (err) return next(err);
                    if (!results.ok) return next(results.error);

                    if (results.response_metadata && results.response_metadata.next_cursor) {
                        params.cursor = results.response_metadata.next_cursor;
                    } else {
                        complete = true;
                    }

                    // Add to the channels array.
                    channels = _.union(channels, _.map(results.channels, function(channel) {
                        return {
                            id: channel.id,
                            name: channel.name
                        }
                    }));

                    next();
                });
            }, function(err) {
                if (err) return done(err);
                next_waterfall(null, channels);
            });
        },
        function(channels, next) {
            functions.groups_list({}, function(err, results) {
                if (err) return next(err);
                channels = _.union(channels, _.map(results.groups, function(group) {
                    return {
                        id: group.id,
                        name: group.name
                    }
                }));
                next(null, channels);
            });
        }
    ], function(err, channels) {
        done(err, channels);
    });
};

functions.post_message = function(params, done) {

    var url = 'https://slack.com/api/chat.postMessage';
    var options = {
        url: url,
        headers: {
            'Authorization':'Bearer '+process.env.SlackOAuthToken
        },
        json: true,
        method: 'POST',
        body: {
            channel: params.channel,
            text: params.text
        }
    };
    console.log(JSON.stringify(options, null, 3));
    request(options, function(err, response, body) {
        console.log(JSON.stringify(body, null, 3));
        done(err);
    });
};

functions.create_dialog = function(trigger_id, done) {
    async.waterfall([
        async.constant({trigger_id: trigger_id}),
        function(params, next) {
            codebuid.listCuratedEnvironmentImages(function(err, images) {
                if (err) return done(err);
                params.images = images;
                next(null, params);
            });
        },
        function(params, next) {
            functions.fetch_all_channels({}, function(err, channels) {
                if (err) return done(err);
                params.channels = channels;
                next(null, params);
            });
        },
        function(params, next) {
            var url = 'https://slack.com/api/dialog.open';
            var options = {
                url: url,
                headers: {
                    'Authorization':'Bearer '+process.env.SlackOAuthToken
                },
                json:true,
                method: 'POST',
                body: {
                    trigger_id: trigger_id,
                    dialog: {
                        "callback_id": 'create_project_'+(new Date()).getTime(),
                        "title": "Create a build project",
                        "submit_label": "Create",
                        "elements": [
                            {
                                "type": "text",
                                "label": "Github Repo",
                                "name": "github_repo"
                            },
                            {
                                "type": "text",
                                "label": "Github Branch",
                                "name": "github_branch"
                            },
                            {
                                "label": "CodeBuild Compute Type",
                                "type": "select",
                                "name": "codebuid_compute_type",
                                "placeholder": "Select a CodeBuild compute type",
                                "value": "BUILD_GENERAL1_SMALL",
                                "options": [
                                    {
                                        "label": "build.general1.small",
                                        "value": "BUILD_GENERAL1_SMALL"
                                    },
                                    {
                                        "label": "build.general1.medium",
                                        "value": "BUILD_GENERAL1_MEDIUM"
                                    },
                                    {
                                        "label": "build.general1.large",
                                        "value": "BUILD_GENERAL1_LARGE"
                                    }
                                ]
                            },
                            {
                                "label": "CodeBuild Image",
                                "type": "select",
                                "name": "codebuid_image",
                                "placeholder": "Select a CodeBuild image",
                                "value": "aws/codebuild/eb-nodejs-6.10.0-amazonlinux-64:4.0.0",
                                "options": _.map(params.images, function(image) {
                                    return {
                                        label: image,
                                        value: image
                                    }
                                })
                            },
                            {
                                "label": "Notifications Channel",
                                "type": "select",
                                "name": "channel",
                                "placeholder": "Select a Channel to receive build notifications",
                                "options": _.map(params.channels, function(channel) {
                                    return {
                                        label: channel.name,
                                        value: channel.id
                                    }
                                })
                            }
                        ]
                    }
                }
            };
            console.log(JSON.stringify(options, null, 3));
            request(options, function(err, response, body) {
                console.log(JSON.stringify(body, null, 3));
                next(err, body);
            });
        }
    ], done);
};

module.exports = functions;