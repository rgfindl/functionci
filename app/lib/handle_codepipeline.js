'use strict';

const _ = require('lodash');
const slack = require('./slack');
const dao = require('./dao');
const async = require('async');

const AWS = require('aws-sdk');
const codepipeline = new AWS.CodePipeline();
const s3 = new AWS.S3();

// Notify AWS CodePipeline of a successful job
var putJobSuccess = function(jobId, message, context) {
    console.log('putJobSuccess');
    var params = {
        jobId: jobId
    };
    codepipeline.putJobSuccessResult(params, function(err, data) {
        if(err) {
            context.fail(err);
        } else {
            context.succeed(message);
        }
    });
};

// Notify AWS CodePipeline of a failed job
var putJobFailure = function(jobId, message, context) {
    console.log('putJobFailure');
    var params = {
        jobId: jobId,
        failureDetails: {
            message: JSON.stringify(message),
            type: 'JobFailed',
            externalExecutionId: context.invokeid
        }
    };
    codepipeline.putJobFailureResult(params, function(err, data) {
        context.fail(message);
    });
};

var functions = {};

functions.copy_build_artifact = function(bucket, source_key, dest_key, callback) {
    console.log('copy_build_artifact');
    var params = {
        Bucket: bucket,
        CopySource: '/'+bucket+'/'+source_key,
        Key: dest_key
    };
    console.log(JSON.stringify(params));
    s3.copyObject(params, callback);
};

functions.handle = function(event, context) {
    console.log('handle_codepipeline');

    // Retrieve the Job ID from the Lambda action
    var jobId = event["CodePipeline.job"].id;

    if (event["CodePipeline.job"].data.inputArtifacts[0].revision) {
        var SourceOutput = event["CodePipeline.job"].data.inputArtifacts[0];
        var BuildOutput = event["CodePipeline.job"].data.inputArtifacts[1];
    } else {
        var SourceOutput = event["CodePipeline.job"].data.inputArtifacts[1];
        var BuildOutput = event["CodePipeline.job"].data.inputArtifacts[0];
    }
    var bucket = BuildOutput.location.s3Location.bucketName;
    var key = BuildOutput.location.s3Location.objectKey;
    var project_id = _.replace(event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters, 'functionci-', '');

    var commit = SourceOutput.revision;

    async.waterfall([
        function(next) {
            // Get the project
            dao.get_project({
                project_id: project_id
            }, next);
        },
        function(project_data, next) {
            // Increment the build counter.
            dao.update_project_build_count({
                project_id: project_id
            }, function(err, data) {
                if (err) return next(err);
                project_data.Item.build_count = data.Attributes.build_count;
                next(null, project_data.Item);
            });
        },
        function(project, next) {
            // Move the zip file.
            functions.copy_build_artifact(bucket, key, project_id+'/'+project_id+'-'+project.build_count, function(err, results) {
                if (err) return next(err);
                next(null, project);
            });
        },
        function(project, next) {
            // Save the build.
            var now = new Date();
            dao.put_build({
                project_id: project.project_id,
                build_date: now + '',
                version: project.build_count+'',
                commit: commit,
                bucket: bucket,
                key: project_id+'/'+project_id+'-'+project.build_count
            }, function(err, results) {
                if (err) return next(err);
                next(null, project);
            });
        },
        function(project, next) {
            // Notify slack
            var text = 'Build '+ project.build_count + ' is ready - ' + project.project_id+'';
            var d = new Date();
            var seconds = d.getTime() / 1000;
            var message = {
                channel: project.channel,
                attachments: [
                    {
                        "fallback": text,
                        "color": 'good',
                        "text": text,
                        "ts": seconds
                    }
                ]
            };
            slack.post_message(message, next);
        }
    ], function(err, results) {
        if (err) {
            return putJobFailure(jobId, err, context);
        } else {
            return putJobSuccess(jobId, '', context);
        }
    });
};

module.exports = functions;