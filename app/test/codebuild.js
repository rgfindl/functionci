var assert = require('assert');
var _ = require('lodash');
var codebuild = require('../lib/codebuild');

process.env.SlackVerificationToken = '1234';

describe('codebuild', function() {
    it('main', function (done) {
        codebuild.listCuratedEnvironmentImages(function(err, images) {
           console.log(JSON.stringify(images, null, 3));
           done();
        });
    });
});