
const AWS = require('aws-sdk');
const async = require('async');
const _ = require('lodash');
const s3 = new AWS.S3();


var functions = {};

functions.copy = function(bucket, source_key, dest_key, done) {
    console.log('copy_build_artifact');
    var params = {
        Bucket: bucket,
        CopySource: '/'+bucket+'/'+source_key,
        Key: dest_key
    };
    console.log(JSON.stringify(params));
    s3.copyObject(params, done);
};

functions.delete_with_prefix = function(input, done) {
    console.log('delete_with_prefix');
    var complete = false;
    var nextMarker;
    async.until(function() {
        return complete;
    }, function(next) {
        const params = {
            Bucket: input.bucket,
            Prefix: input.prefix,
            Marker: nextMarker
        };
        console.log(JSON.stringify(params, null, 3));
        s3.listObjects(params, function(err, data) {
            if (err) return next(err);
            console.log(JSON.stringify(data, null, 3));
            complete = !data.IsTruncated;
            if (_.size(data.Contents) > 0) {
                var objects = [];
                _.forEach(data.Contents, function (content) {
                    objects.push({
                        Key: content.Key
                    });
                    nextMarker = content.Key;
                });
                s3.deleteObjects({
                    Bucket: input.bucket,
                    Delete: {
                        Objects: objects
                    }
                }, function (err, data) {
                    console.log(JSON.stringify(data, null, 3));
                    next(err);
                });
            } else {
                next();
            }
        });
    }, function(err) {
        done(err, null);
    });
};

module.exports = functions;