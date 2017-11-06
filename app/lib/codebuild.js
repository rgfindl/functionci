const AWS = require('aws-sdk');
const codebuild = new AWS.CodeBuild({apiVersion: '2016-10-06'});
const _ = require('lodash');

var functions = {};

functions.listCuratedEnvironmentImages = function(done) {
    console.log('listCuratedEnvironmentImages');
    var params = {
    };
    codebuild.listCuratedEnvironmentImages(params, function(err, data) {
        if (err) return done(err);
        var images = [];
        _.forEach(data.platforms, function(platform) {
            _.forEach(platform.languages, function(language) {
                _.forEach(language.images, function(image) {
                    images.push(image.name);
                });
            });
        });
        return done(null, images);
    });

};

module.exports = functions;