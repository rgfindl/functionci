const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

var functions = {};

functions.deploy = function(input, done) {
    console.log('deploy');

    var params = {
        FunctionName: input.arn, /* required */
        DryRun: false,
        Publish: true,
        S3Bucket: input.bucket,
        S3Key: input.key
    };
    lambda.updateFunctionCode(params, done);
};

module.exports = functions;