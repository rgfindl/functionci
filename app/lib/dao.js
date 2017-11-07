const AWS = require('aws-sdk');
const _ = require('lodash');
const async = require('async');
    // var credentials = new AWS.SharedIniFileCredentials({profile: 'bluefin'});
    // AWS.config.credentials = credentials;
var docClient = new AWS.DynamoDB.DocumentClient();

var functions = {};

functions.put_project = function(input, done) {
    console.log('dao.put_project');
    input.hash_key = 'project';
    input.sort_key = input.project_id;
    input.build_count = 0;
    var params = {
        TableName: process.env.FunctionCITable,
        Item: input,
        ConditionExpression: "attribute_not_exists(build_count)"
    };
    console.log(JSON.stringify(params));
    docClient.put(params, done);
};

functions.update_project_build_count = function(input, done) {
    console.log('dao.update_project_count');
    input.hash_key = 'project';
    input.sort_key = input.project_id;
    var params = {
        TableName: process.env.FunctionCITable,
        Key:{
            "hash_key": 'project',
            "sort_key": input.project_id
        },
        UpdateExpression: "set build_count = build_count + :val",
        ExpressionAttributeValues:{
            ":val":1
        },
        ReturnValues:"UPDATED_NEW"
    };
    console.log(JSON.stringify(params));
    docClient.update(params, done);
};

functions.get_project = function(input, done) {
  console.log('dao.get_project');
  var params = {
      TableName: process.env.FunctionCITable,
      Key:{
          "hash_key": 'project',
          "sort_key": input.project_id
      }
  };
  docClient.get(params, done);
};

functions.delete_project = function(input, done) {
  console.log('dao.delete_project');
  async.waterfall([
      function(next) {
          var params = {
              TableName: process.env.FunctionCITable,
              Key:{
                  "hash_key": 'project',
                  "sort_key": input.project_id
              }
          };
          docClient.delete(params, next);
      }, function(results, next) {
          functions.delete_builds_per_project(input, next);
      }
  ], done);
};

functions.get_projects = function(input, done) {
    console.log('dao.get_projects');
    var params = {
        TableName: process.env.FunctionCITable,
        KeyConditionExpression: "#hash_key = :hash_key",
        ExpressionAttributeNames:{
            "#hash_key": "hash_key"
        },
        ExpressionAttributeValues: {
            ":hash_key":'project'
        }
    };
    if (!_.isNil(input.from)) {
        params.ExclusiveStartKey = {
            sort_key: from,
            hash_key: 'project'
        };
    }

    docClient.query(params, done);
};

functions.put_fn = function(input, done) {
  console.log('dao.put_fn');
  async.waterfall([
      function(next) {
          input.hash_key = 'function-arn';
          input.sort_key = input.arn;
          var params = {
              TableName: process.env.FunctionCITable,
              Item: input,
              ConditionExpression: "attribute_not_exists(arn)"
          };
          console.log(JSON.stringify(params));
          docClient.put(params, next);
      },
      function(results, next) {
          input.hash_key = 'function';
          input.sort_key = input.short_name;
          var params = {
              TableName: process.env.FunctionCITable,
              Item: input,
              ConditionExpression: "attribute_not_exists(arn)"
          };
          console.log(JSON.stringify(params));
          docClient.put(params, next);
      }
  ], done);
};

functions.get_fn = function(input, done) {
  console.log('dao.get_fn');
  var params = {
      TableName: process.env.FunctionCITable,
      Key:{
          "hash_key": 'function',
          "sort_key": input.short_name
      }
  };
  docClient.get(params, done);
};

functions.delete_fn = function(input, done) {
    console.log('dao.delete_fn');
    async.waterfall([
        function(next) {
            functions.get_fn({
                short_name: input.short_name
            }, next);
        },
        function(data, next) {
            input.arn = data.Item.arn;
            var params = {
                TableName: process.env.FunctionCITable,
                Key:{
                    "hash_key": 'function-arn',
                    "sort_key": input.arn
                }
            };
            docClient.delete(params, next);
        },
        function(results, next) {
            var params = {
                TableName: process.env.FunctionCITable,
                Key:{
                    "hash_key": 'function',
                    "sort_key": input.short_name
                }
            };
            docClient.delete(params, next);
        },
        function(results, next) {
            functions.delete_deployments_per_fn(input, next);
        }
    ], done);
};

functions.get_fns = function(input, done) {
    console.log('dao.get_projects');
    var params = {
        TableName: process.env.FunctionCITable,
        KeyConditionExpression: "#hash_key = :hash_key",
        ExpressionAttributeNames:{
            "#hash_key": "hash_key"
        },
        ExpressionAttributeValues: {
            ":hash_key":'function'
        }
    };
    if (!_.isNil(input.from)) {
        params.ExclusiveStartKey = {
            sort_key: from,
            hash_key: 'function'
        };
    }

    docClient.query(params, done);
};

functions.put_build = function(input, done) {
  console.log('dao.put_build');
  input.hash_key = input.project_id;
  input.sort_key = input.version;
  var params = {
      TableName: process.env.FunctionCITable,
      Item: input
  };
  console.log(JSON.stringify(params));
  docClient.put(params, done);
};

functions.get_build = function(input, done) {
    console.log('dao.get_build');
    var params = {
        TableName: process.env.FunctionCITable,
        Key:{
            "hash_key": input.project_id,
            "sort_key": input.version
        }
    };
    docClient.get(params, done);
};

functions.get_builds_per_project = function(input, done) {
    console.log('dao.get_builds_per_project');
    var params = {
        TableName: process.env.FunctionCITable,
        KeyConditionExpression: "#hash_key = :hash_key",
        ExpressionAttributeNames:{
            "#hash_key": "hash_key"
        },
        ExpressionAttributeValues: {
            ":hash_key": input.project_id
        }
    };
    if (!_.isNil(input.from)) {
        params.ExclusiveStartKey = {
            sort_key: from,
            hash_key: input.short_name
        };
    }

    docClient.query(params, done);
};

functions.delete_builds_per_project = function(input, done) {
    done(null, {});
};

functions.put_deployment = function(input, done) {
  console.log('dao.put_build');
  input.hash_key = input.fn_short_name;
  input.sort_key = input.deployment_date;
  var params = {
      TableName: process.env.FunctionCITable,
      Item: input
  };
  console.log(JSON.stringify(params));
  docClient.put(params, done);
};

functions.get_deployments_per_fn = function(input, done) {
    console.log('dao.get_projects');
    var params = {
        TableName: process.env.FunctionCITable,
        KeyConditionExpression: "#hash_key = :hash_key",
        ExpressionAttributeNames:{
            "#hash_key": "hash_key"
        },
        ExpressionAttributeValues: {
            ":hash_key": input.short_name
        }
    };
    if (!_.isNil(input.from)) {
        params.ExclusiveStartKey = {
            sort_key: from,
            hash_key: input.short_name
        };
    }

    docClient.query(params, done);
};

functions.delete_deployments_per_fn = function(input, done) {
    done(null, {});
};

module.exports = functions;
