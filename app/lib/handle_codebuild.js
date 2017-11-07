'use strict';

const _ = require('lodash');
const slack = require('./slack');
const dao = require('./dao');

var functions = {};

functions.handle = function(event, callback) {
    console.log('handle_codebuild');
    const project_id = _.replace(_.replace(event.detail['project-name'], 'functionci-', ''), '-code-build', '');

    dao.get_project({
        project_id: project_id
    }, function(err, data) {
        if (err) {
            console.log(err);
            return callback();
        }
        const status = event.detail['build-status'];
        var text = 'Build '+ status + ' - ' + data.Item.project_id+'';
        if (_.isEqual(status, 'FAILED')) {
            text += '\n';
            text += 'https://console.aws.amazon.com/cloudwatch/home?region='+event.region+'#logEventViewer:group=/aws/codebuild/'+event.detail['project-name']+';start=PT5M';
        }
        slack.post_message({
            channel: data.Item.channel,
            text: text
        }, callback);
    });
};

module.exports = functions;