var assert = require('assert');
var _ = require('lodash');
var s3 = require('../lib/s3');

describe('s3', function() {
    it('main', function (done) {
        s3.delete_with_prefix({
                bucket: 'functionci-artifacts',
                prefix: 'functionci-demo-master'
            },
            function(err, images) {
                console.log(JSON.stringify(images, null, 3));
                done();
            }
        );
    });
});