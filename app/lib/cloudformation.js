'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const cloudformation = new AWS.CloudFormation();
const _ = require('lodash');
const fs = require('fs');
const async = require('async');

var functions = {};

functions.uploadCFTemplate = function(done) {
    console.log('uploadCFTemplate');
    fs.readFile('./lib/resources/cloudformation.yml', function (err, data) {
        if (err) {
            throw err;
        }

        var base64data = new Buffer(data, 'binary');
        var params = {
            Body: base64data,
            Bucket: process.env.ArtifactsBucket,
            Key: '_cloudformation.yml'
        };
        s3.putObject(params, function(err, result) {
            if (err) {
                throw err;
            }
            done(err, 'https://s3.amazonaws.com/'+process.env.ArtifactsBucket+'/_cloudformation.yml');
        });
    });
};

functions.createStack = function(params, done) {
    console.log('Creating stack');
    var input = {
        StackName: 'functionci-'+params.project_id,
        Capabilities: [
            'CAPABILITY_NAMED_IAM'
        ],
        OnFailure: 'DELETE',
        RoleARN: process.env.IamRoleCloudFormationExecution,
        NotificationARNs: [
            process.env.SNSTopic
        ],
        Parameters: [
            {
                ParameterKey: 'FunctionCIStack',
                ParameterValue: 'functionci-app'
            },
            {
                ParameterKey: 'GitHubOwner',
                ParameterValue: params.github_owner
            },
            {
                ParameterKey: 'GitHubRepo',
                ParameterValue: params.github_repo
            },
            {
                ParameterKey: 'GitHubBranch',
                ParameterValue: params.github_branch
            },
            {
                ParameterKey: 'GitHubToken',
                ParameterValue: process.env.GithubToken
            },
            {
                ParameterKey: 'CodeBuildComputeType',
                ParameterValue: params.codebuid_compute_type
            },
            {
                ParameterKey: 'CodeBuildImage',
                ParameterValue: params.codebuid_image
            }
        ],
        Tags: [
            {
                Key: 'App', /* required */
                Value: 'functionci' /* required */
            },
            {
                Key: 'Id', /* required */
                Value: params.project_id /* required */
            }
        ],
        TemplateURL: params.templateS3Url
    };
    console.log(JSON.stringify(input, null, 3));
    cloudformation.createStack(input, done);
};

functions.build_stack_up = function(params, done) {
    async.waterfall([
        functions.uploadCFTemplate,
        function(templateS3Url, next) {
            params.templateS3Url = templateS3Url;
            functions.createStack(params, next);
        }
    ], done);
};

module.exports = functions;