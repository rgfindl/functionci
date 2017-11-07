var assert = require('assert');
var _ = require('lodash');
var index = require('../index');

process.env.SlackVerificationToken = '1234';
process.env.SlackBotOAuthToken = 'xoxb-xxxxxx';


describe('index', function() {
    it('create project', function (done) {
        var req = {
            path: '/slack/commands',
            "body": "token=1234&team_id=T1Y5SBYKV&team_domain=medisprout&channel_id=D1Y75LXV4&channel_name=directmessage&user_id=U1Y73S952&user_name=randyfindley&command=%2Ffn&text=deploy+fn+demo+functionci-demo-master+5&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT1Y5SBYKV%2F268633988183%2Fs2PDnET9JYjecdiqvtvfCGhv&trigger_id=267034568481.66196406675.ec9261de442dedb68a1d3647859f85fa"
        };
        index.handler(req, {}, function(err, response) {
            //assert.equal(response.statusCode, 200);
            // assert.ok(response.body);
            // console.log(response.body);
            // var body = JSON.parse(response.body);
            // assert.ok(body.event);
            // assert.ok(body.event.test);
            console.log(JSON.stringify(response, null, 3));
            done(err);
        });
    });
//     it('dialog', function(done) {
//        var req = {
//            path: '/slack/interactive-components',
//            body: 'payload=%7B%22type%22%3A%22dialog_submission%22%2C%22submission%22%3A%7B%22github_repo%22%3A%22repo%22%2C%22github_branch%22%3A%22branch%22%2C%22codebuid_compute_type%22%3A%22BUILD_GENERAL1_SMALL%22%2C%22codebuid_image%22%3A%22aws%5C%2Fcodebuild%5C%2Feb-nodejs-6.10.0-amazonlinux-64%3A4.0.0%22%7D%2C%22callback_id%22%3A%22create_project_1509900895876%22%2C%22team%22%3A%7B%22id%22%3A%22T1Y5SBYKV%22%2C%22domain%22%3A%22medisprout%22%7D%2C%22user%22%3A%7B%22id%22%3A%22U1Y73S952%22%2C%22name%22%3A%22randyfindley%22%7D%2C%22channel%22%3A%7B%22id%22%3A%22D1Y75LXV4%22%2C%22name%22%3A%22directmessage%22%7D%2C%22action_ts%22%3A%221509901021.230184%22%2C%22token%22%3A%221234%22%7D'
//        };
//        index.handler(req, {}, function(err, response) {
//            console.log(response);
//            done(err);
//        });
//     });
//     it('sns', function(done) {
//        var req = {
//            "Records": [
//                {
//                    "EventSource": "aws:sns",
//                    "EventVersion": "1.0",
//                    "EventSubscriptionArn": "arn:aws:sns:us-east-1:132093761664:functionci-app-topic:4c90cb05-57e2-469d-ad81-e89a9f5de0d6",
//                    "Sns": {
//                        "Type": "Notification",
//                        "MessageId": "2b1ce984-a2c9-591e-93d3-bbfdd0296226",
//                        "TopicArn": "arn:aws:sns:us-east-1:132093761664:functionci-app-topic",
//                        "Subject": "AWS CloudFormation Notification",
//                        "Message": "StackId='arn:aws:cloudformation:us-east-1:132093761664:stack/functionci-serverless-demo-master/877ae110-c2f6-11e7-9cf3-500c217b26c6'\nTimestamp='2017-11-06T13:30:59.384Z'\nEventId='b9e02f70-c2f6-11e7-9b77-500c2866f062'\nLogicalResourceId='functionci-serverless-demo-master'\nNamespace='132093761664'\nPhysicalResourceId='arn:aws:cloudformation:us-east-1:132093761664:stack/functionci-serverless-demo-master/877ae110-c2f6-11e7-9cf3-500c217b26c6'\nPrincipalId='AROAIYU25YZESDP2UYRZU:functionci-app-LambdaFunction-19QAJIOQZW45M'\nResourceProperties='null'\nResourceStatus='CREATE_COMPLETE'\nResourceStatusReason=''\nResourceType='AWS::CloudFormation::Stack'\nStackName='functionci-serverless-demo-master'\nClientRequestToken='null'\n",
//                        "Timestamp": "2017-11-05T20:12:16.265Z",
//                        "SignatureVersion": "1",
//                        "Signature": "bR4vGiVIHhk4JopYMcBnAvisyQDBmyd+CEpNljfh0B+s3T9MKwzJlMudK8i2qZeikAasMKK3j5HKnwQBqjfpSfiNnsnwNARjAFpSIo1Abd7Ef6ddhYCk05lIqJYyC7IMikYvsaahDFGcPzSWoHs6KOcbCF5uJjVAi4pX7XeFFpCM6U8qA8RxJTiQglxo2RAKWttmILbiFDpnCz1Urt3n0Gx6xRSx420sSc0hJmogkzS7M8YoFSjDxfcg/s9kxrdTDYONIsk/QWRcSGNKCyzGxDh/kvIpCDkcWpe2gbpAs74cgyeVqAF13eZcCpqLvwh+Ksh3GluvVkf6/sKn87otcQ==",
//                        "SigningCertUrl": "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-433026a4050d206028891664da859041.pem",
//                        "UnsubscribeUrl": "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:132093761664:functionci-app-topic:4c90cb05-57e2-469d-ad81-e89a9f5de0d6",
//                        "MessageAttributes": {}
//                    }
//                }
//            ]
//        };
//         index.handler(req, {}, function(err, response) {
//             console.log(response);
//             done(err);
//         });
// //     });
//     it('codebuild', function(done) {
//        var req = {
//            "version": "0",
//            "id": "fc545584-970e-991a-1113-46467a09cd04",
//            "detail-type": "CodeBuild Build State Change",
//            "source": "aws.codebuild",
//            "account": "132093761664",
//            "time": "2017-11-05T22:01:11Z",
//            "region": "us-east-1",
//            "resources": [
//                "arn:aws:codebuild:us-east-1:132093761664:build/functionci-thestackshack-serverless-demo-master-code-build:93942698-859e-4fa9-8fde-c062977f6053"
//            ],
//            "detail": {
//                "build-status": "IN_PROGRESS",
//                "project-name": "functionci-thestackshack-serverless-demo-master-code-build",
//                "build-id": "arn:aws:codebuild:us-east-1:132093761664:build/functionci-thestackshack-serverless-demo-master-code-build:93942698-859e-4fa9-8fde-c062977f6053",
//                "additional-information": {
//                    "artifact": {
//                        "location": "arn:aws:s3:::functionci-artifacts/functionci-thestacks/BuildOutpu/lrm1vN7"
//                    },
//                    "environment": {
//                        "image": "aws/codebuild/eb-nodejs-6.10.0-amazonlinux-64:4.0.0",
//                        "privileged-mode": false,
//                        "compute-type": "BUILD_GENERAL1_SMALL",
//                        "type": "LINUX_CONTAINER",
//                        "environment-variables": []
//                    },
//                    "timeout-in-minutes": 5,
//                    "build-complete": false,
//                    "initiator": "codepipeline/functionci-thestackshack-serverless-demo-master-AppCodePipeline-12OOMAI0OA7MG",
//                    "build-start-time": "Nov 5, 2017 10:01:11 PM",
//                    "source": {
//                        "buildspec": "buildspec.yml",
//                        "type": "CODEPIPELINE"
//                    },
//                    "source-version": "arn:aws:s3:::functionci-artifacts/functionci-thestacks/SourceOutp/PHoeKv7.zip"
//                },
//                "current-phase": "SUBMITTED",
//                "current-phase-context": "[]",
//                "version": "1"
//            }
//         };
//         index.handler(req, {}, function(err, response) {
//             console.log(response);
//             done(err);
//         });
//      });
//        var req_failed = {
//            "version": "0",
//            "id": "e0e9c40b-5720-143c-4667-fb67ef65a366",
//            "detail-type": "CodeBuild Build State Change",
//            "source": "aws.codebuild",
//            "account": "132093761664",
//            "time": "2017-11-06T01:35:07Z",
//            "region": "us-east-1",
//            "resources": [
//                "arn:aws:codebuild:us-east-1:132093761664:build/functionci-thestackshack-serverless-demo-master-code-build:845a17d1-3901-40aa-a169-15f7545eca60"
//            ],
//            "detail": {
//                "build-status": "FAILED",
//                "project-name": "functionci-thestackshack-serverless-demo-master-code-build",
//                "build-id": "arn:aws:codebuild:us-east-1:132093761664:build/functionci-thestackshack-serverless-demo-master-code-build:845a17d1-3901-40aa-a169-15f7545eca60",
//                "additional-information": {
//                    "artifact": {
//                        "location": "arn:aws:s3:::functionci-artifacts/functionci-thestacks/BuildOutpu/JU3DLlI"
//                    },
//                    "environment": {
//                        "image": "aws/codebuild/eb-nodejs-6.10.0-amazonlinux-64:4.0.0",
//                        "privileged-mode": false,
//                        "compute-type": "BUILD_GENERAL1_SMALL",
//                        "type": "LINUX_CONTAINER",
//                        "environment-variables": []
//                    },
//                    "timeout-in-minutes": 5,
//                    "build-complete": true,
//                    "initiator": "codepipeline/functionci-thestackshack-serverless-demo-master-AppCodePipeline-ZAKCN4G5I28G",
//                    "build-start-time": "Nov 6, 2017 1:33:58 AM",
//                    "source": {
//                        "buildspec": "buildspec.yml",
//                        "type": "CODEPIPELINE"
//                    },
//                    "source-version": "arn:aws:s3:::functionci-artifacts/functionci-thestacks/SourceOutp/Wk6cJXz.zip",
//                    "logs": {
//                        "group-name": "/aws/codebuild/functionci-thestackshack-serverless-demo-master-code-build",
//                        "stream-name": "845a17d1-3901-40aa-a169-15f7545eca60",
//                        "deep-link": "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logEvent:group=/aws/codebuild/functionci-thestackshack-serverless-demo-master-code-build;stream=845a17d1-3901-40aa-a169-15f7545eca60"
//                    },
//                    "phases": [
//                        {
//                            "phase-context": [],
//                            "start-time": "Nov 6, 2017 1:33:58 AM",
//                            "end-time": "Nov 6, 2017 1:33:59 AM",
//                            "duration-in-seconds": 0,
//                            "phase-type": "SUBMITTED",
//                            "phase-status": "SUCCEEDED"
//                        },
//                        {
//                            "phase-context": [],
//                            "start-time": "Nov 6, 2017 1:33:59 AM",
//                            "end-time": "Nov 6, 2017 1:34:55 AM",
//                            "duration-in-seconds": 56,
//                            "phase-type": "PROVISIONING",
//                            "phase-status": "SUCCEEDED"
//                        },
//                        {
//                            "phase-context": [
//                                "YAML_FILE_ERROR: stat /codebuild/output/src424818173/src/buildspec.yml: no such file or directory"
//                            ],
//                            "start-time": "Nov 6, 2017 1:34:55 AM",
//                            "end-time": "Nov 6, 2017 1:35:00 AM",
//                            "duration-in-seconds": 4,
//                            "phase-type": "DOWNLOAD_SOURCE",
//                            "phase-status": "FAILED"
//                        },
//                        {
//                            "phase-context": [],
//                            "start-time": "Nov 6, 2017 1:35:00 AM",
//                            "end-time": "Nov 6, 2017 1:35:06 AM",
//                            "duration-in-seconds": 5,
//                            "phase-type": "FINALIZING",
//                            "phase-status": "SUCCEEDED"
//                        },
//                        {
//                            "start-time": "Nov 6, 2017 1:35:06 AM",
//                            "phase-type": "COMPLETED"
//                        }
//                    ]
//                },
//                "current-phase": "COMPLETED",
//                "current-phase-context": "[]",
//                "version": "1"
//            }
//        };
//     });
//     it('codepipeline', function(done) {
//
//         var cp = {
//             "CodePipeline.job": {
//                 "id": "eddd25bc-ef53-4440-bee5-f69d804a5e9b",
//                 "accountId": "132093761664",
//                 "data": {
//                     "actionConfiguration": {
//                         "configuration": {
//                             "FunctionName": "functionci-app-LambdaFunction-19QAJIOQZW45M",
//                             "UserParameters": "functionci-functionci-demo-master"
//                         }
//                     },
//                     "inputArtifacts": [
//                         {
//                             "location": {
//                                 "s3Location": {
//                                     "bucketName": "functionci-artifacts",
//                                     "objectKey": "functionci-functionc/SourceOutp/8ws4keK.zip"
//                                 },
//                                 "type": "S3"
//                             },
//                             "revision": "e3642fdfabc5088e834519daa0222af4cb1c90e9",
//                             "name": "SourceOutput"
//                         },
//                         {
//                             "location": {
//                                 "s3Location": {
//                                     "bucketName": "functionci-artifacts",
//                                     "objectKey": "functionci-functionc/BuildOutpu/0iqXcIU"
//                                 },
//                                 "type": "S3"
//                             },
//                             "revision": null,
//                             "name": "BuildOutput"
//                         }
//                     ],
//                     "outputArtifacts": [],
//                     "artifactCredentials": {
//                         "secretAccessKey": "hPgQPlLqhfFaw44f82BZVocR7gSWrlyL5IMTIqNB",
//                         "sessionToken": "AgoGb3JpZ2luEFgaCXVzLWVhc3QtMSKAAhPEloBGV9Vu0jNLSJtSX+ZQzkS2MyAKv/VRjnuicMjRA05jyL5fTkVzjpz559z/n9464gGPnCqwm1hk34iv3dMsPDfuODzAHx10VzK1rSa2vwnGY7X2ySUrWQaIma4zH1YcgPkxkFfIveRUF3Oq8sp3arcVNFBT79HBR9UuzCHWIeIxq2hLn0G9Rq91bOkSgiwj3aJxAUfzOTgwAL788a+FzMObaMMxIL2p24XawsPU98jmrkGUfkSq0K/X7IZXrwI5t3O2KzIkx5+EjSQjfcevc3/9v9j2WaUqA6N9CpUqVrEMMzD70Qat3c5x6oyrpUvZmjfkbheWBSmdtHkt/owqpwUIjf//////////ARABGgwxMzIwOTM3NjE2NjQiDE/rhG51EaVG/liMCyr7BF82XXaiWQZyEhn7zMAOfgPQ6Wa1Vd0eWfElGRJgngL31Hev55FdAfA95xA2k8XsJSfC1LX+b7rYW0huqw/nZw/KOfrNYGsGkmk76lEJotYefhzsQ9Xfq5NZT2LI7htTrMn0REuS1/cbbkDeY6O++MlbUmeib2ha8XkFX/wMlYUgFdCL3WlCj01aV3THSRqMVaAQMCljrfIj2hMnCPXbRqpUQaDSaUmIIdOoMQEhSnpe7/VWeqL6KFAiNmmx+ZLjj/YWTiqSaYpIPB23RvwVgjKPATxhrgSJJdGLTatDItohOeqkfUovEAmJzrVAgP6Ksev8keDoceqkTetBGqAqE37KYw45CPQRP3+oM7AENsxQwcBJpGVgsBnLTlnoiVp9jQ2WXwoU/wLjolVY9/vJwrvKhN+0NVuQmqI0s5GbNmGbyhw+Wv1P+/tosUHm+w9JNplyVZIc7nbYoN+p1utgrmaedbexBiIbmM3XC3ffpFpgYY3v/c/lNTOgYGDzDGxG7GBvXhOiIxuPggoQBt8O4cSOHsmAyeqFGFP3u0oOr3qqt4v0/YWUr8VuJg9Q2r2KQgzVFG2NierDQMwrh2Hue2lcvx5qtjZKj4pNEO/ze3lKEiC4o3XIT4vrRw7L37k61eKgbQ9DFGaeDT9yUtu+EPYhQOShAhZBnkZfSavNbAtO/sYfhJyxK+fVxxBxxd/xe2K5XpLbaobiy2z2EZL/munoedOThNaUAO/8gP5CGPWZJLv+oSEjeAg93gGmpVq8ZfjE9NCpC8ZnFncT94EUJDrvAKVAHAR4+dDbZ5FDpWilZLw7HG25Fp5lu7Rnc29zmW9FQO00EhdGoqhDMKHDhtAF",
//                         "accessKeyId": "ASIAIWTXGKXK6IE7D7LQ"
//                     }
//                 }
//             }
//         };
//         index.handler(cp, {
//             succeed: function(err, response) {
//                 console.log('succeed');
//                 console.log(response);
//                 done(err);
//             },
//             fail: function(err, response) {
//                 console.log('fail');
//                 console.log(response);
//                 done(err);
//             }
//         }, function(err, response) {
//             console.log(response);
//             done(err);
//         });
//     });
});