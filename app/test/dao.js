var assert = require('assert');
var _ = require('lodash');
var dao = require('../lib/dao');

process.env.FunctionCITable = 'FunctionCI';

describe('dao', function() {
    it('put_project', function (done) {
        dao.put_project({
            project_id: 'rgfindl-cim-sh-master',
          github_owner: 'rgfindl',
          github_repo: 'cim.sh',
          github_branch: 'master',
          codebuid_compute_type: 'codebuid_compute_type',
          codebuid_image: 'codebuid_image'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
           done(err);
        });
    });
    it('update_project_build_count', function (done) {
        dao.update_project_build_count({
            project_id: 'rgfindl-cim-sh-master'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('get_project', function (done) {
        dao.get_project({
            project_id: 'rgfindl-cim-sh-master'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('put_project', function (done) {
        dao.put_project({
            project_id: 'aaa-cim-sh-master',
            github_owner: 'rgfindl',
            github_repo: 'cim.sh',
            github_branch: 'master',
            codebuid_compute_type: 'codebuid_compute_type',
            codebuid_image: 'codebuid_image'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('get_projects', function (done) {
        dao.get_projects({}, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('delete_project', function (done) {
        dao.delete_project({
            project_id: 'rgfindl-cim-sh-master'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('delete_project', function (done) {
        dao.delete_project({
            project_id: 'aaa-cim-sh-master'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('put_fn', function (done) {
        dao.put_fn({
            short_name: 'api',
            arn: 'api-arn'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('get_fn', function (done) {
        dao.get_fn({
            short_name: 'api'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('get_fns', function (done) {
        dao.get_fns({
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
    it('delete_fn', function (done) {
        dao.delete_fn({
            short_name: 'api'
        }, function(err, results) {
            console.log(JSON.stringify(results, null, 3));
            console.log(JSON.stringify(err, null, 3));
            done(err);
        });
    });
});
