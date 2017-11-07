var assert = require('assert');
var _ = require('lodash');
var slack = require('../lib/slack');

process.env.SlackBotOAuthToken = 'xoxb-xxxx';

describe('slack', function() {
    // it('channels', function (done) {
    //     slack.fetch_all_channels({}, function(err, channels) {
    //         //console.log(JSON.stringify(err, null, 3));
    //         console.log(JSON.stringify(channels, null, 3));
    //        done();
    //     });
    // });
    // it('create_dialog', function(done) {
    //     slack.create_dialog('test', function(err) {
    //         done(err);
    //     });
    // });
    it('post_message', function(done) {

        var d = new Date();
        var seconds = d.getTime() / 1000;
        var message = {
            channel: 'G7V37B2P3',
            text: '',
            attachments: [
                {
                    "fallback": 'test',
                    "color": "#dddddd",
                    "text": 'test',
                    "ts": seconds
                }
            ]
        };
        slack.post_message(message, done);
    });
});