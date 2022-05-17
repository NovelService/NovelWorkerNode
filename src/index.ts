import { Config } from "./types/config.js"
import { Context } from "./types/context.js"
import messageListener from './messageListener.js';

import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Hash } from "@aws-sdk/hash-node";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

console.log("start");

const config = readConfig();

const context: Context = {
    config: config,
    clients: {
        sqs: new SQSClient({
            region: config.aws.region,
            credentials: config.aws.credentials,
            endpoint: config.aws.endpoint
        }),
        s3: new S3Client({
            region: config.aws.region,
            credentials: config.aws.credentials,
            endpoint: config.aws.endpoint,
            forcePathStyle: true //Required for localstack setup
        }),
        s3Presigner: new S3RequestPresigner({
            region: config.aws.region,
            credentials: config.aws.credentials,
            sha256: Hash.bind(null, "sha256"),
        }),
        dynamoDb: new DynamoDBClient({
            region: config.aws.region,
            credentials: config.aws.credentials,
            endpoint: config.aws.endpoint
        })
    }
}

messageListener.start(context);
console.log("message listener started")

function readConfig(): Config {
    return {
        aws: {
            credentials: {
                accessKeyId: getEnvOrThrow("ACCESS_KEY_ID"),
                secretAccessKey: getEnvOrThrow("SECRET_ACCESS_KEY"),
            },
            region: getEnvOrThrow("REGION"),
            endpoint: process.env.ENDPOINT,
            host: process.env.HOST,
            sqs: {
                queueUrl: getEnvOrThrow("QUEUE_URL")
            },
            s3: {
                bucket: getEnvOrThrow("BUCKET")
            },
            dynamoDB: {
                tableName: getEnvOrThrow("TABLE")
            }
        },
        pollInterval: parseInt(process.env.POLL_INTERVAL || "20000")
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