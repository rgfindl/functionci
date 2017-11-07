var assert = require('assert');
var _ = require('lodash');
var codebuild = require('../lib/codebuild');

process.env.SlackVerificationToken = '1234';

describe('project', function() {
    it('main', function (done) {

        const github_url = 'https://github.com/rgfindl/functionci-demo.sh';
        const github_branch = 'master';

        const github_repo_parts = _.split(_.replace(github_url, 'https://github.com/', ''), '/');
        if (_.size(github_repo_parts) != 2) {
            done('INvalid');
        }
        const github_owner = github_repo_parts[0];
        const github_repo = github_repo_parts[1];
        const project_id = _.replace(_.join([github_repo, github_branch], '-'), /[^a-z0-9A-Z-]/g, '-');
        console.log(project_id);
        done();
    });
});