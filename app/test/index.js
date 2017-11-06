var assert = require('assert');
var _ = require('lodash');
var index = require('../index');

process.env.SlackVerificationToken = '1234';
process.env.SlackOAuthToken = 'xoxp-66196406675-66241893172-266495788663-5bff8cd86b45dae4b51378147e1e99ec';

describe('index', function() {
    it('create project', function (done) {
        var req = {
            path: '/slack/commands',
            "body": "token=1234&team_id=T1Y5SBYKV&team_domain=medisprout&channel_id=D1Y75LXV4&channel_name=directmessage&user_id=U1Y73S952&user_name=randyfindley&command=%2Ffn&text=create+project&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT1Y5SBYKV%2F268633988183%2Fs2PDnET9JYjecdiqvtvfCGhv&trigger_id=267034568481.66196406675.ec9261de442dedb68a1d3647859f85fa"
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
//                        "Message": "StackId='arn:aws:cloudformation:us-east-1:132093761664:stack/functionci-thestackshack-serverless-demo-master/614bea20-c265-11e7-a414-50fae98974fd'\nTimestamp='2017-11-05T20:12:16.126Z'\nEventId='9e55d480-c265-11e7-979b-500c5242948e'\nLogicalResourceId='functionci-thestackshack-serverless-demo-master'\nNamespace='132093761664'\nPhysicalResourceId='arn:aws:cloudformation:us-east-1:132093761664:stack/functionci-thestackshack-serverless-demo-master/614bea20-c265-11e7-a414-50fae98974fd'\nPrincipalId='AROAIYU25YZESDP2UYRZU:functionci-app-LambdaFunction-19QAJIOQZW45M'\nResourceProperties='null'\nResourceStatus='DELETE_COMPLETE'\nResourceStatusReason=''\nResourceType='AWS::CloudFormation::Stack'\nStackName='functionci-thestackshack-serverless-demo-master'\nClientRequestToken='null'\n",
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
//     });
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
//        };
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
});