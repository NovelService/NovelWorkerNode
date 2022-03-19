import {Config} from "./types/config.js"
import {Context} from "./types/context.js"
import messageListener from './messageListener.js';

import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";

console.log("start");

const config = readConfig();

const context: Context  = {
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
                endpoint: config.aws.endpoint,
                forcePathStyle: true //Required for localstack setup
            }
        )
    }
}

messageListener.start(context);

function readConfig(): Config {
    return {
        aws: {
            credentials: {
                accessKeyId: getEnvOrThrow("ACCESS_KEY_ID"),
                secretAccessKey: getEnvOrThrow("SECRET_ACCESS_KEY"),
            },
            region: getEnvOrThrow("REGION"),
            endpoint: process.env.ENDPOINT,
            sqs: {
                queueUrl: getEnvOrThrow("QUEUE_URL")
            },
            s3: {
                bucket: getEnvOrThrow("BUCKET")
            }
        }
    };
}

function getEnvOrThrow(key: string): string {
    const value = process.env[key]  
    if (typeof value !== "undefined") {
        return value
    } else {
        throw (`Missing environment variable ${key}`)
    }
}