import messageListener from './messageListener.js';
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";

console.log("start");

const config = readConfig();

const context = {
    config: config,
    clients: {
        sqs: new SQSClient(
            {
                region: config.aws.region,
                credentials: config.aws.credentials,
                endpoint: config.aws.endpoint
            }),
        s3: new S3Client(
            {
                region: config.aws.region,
                credentials: config.aws.credentials,
            }
        )
    }
}

messageListener.start(context);

function readConfig() {
    // TODO verify non-empty values
    return {
        aws: {
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: process.env.REGION,
            endpoint: process.env.ENDPOINT,
            sqs: {
                queueUrl: process.env.QUEUE_URL
            },
            s3: {
                bucket: process.env.BUCKET
            }
        }
    };
}