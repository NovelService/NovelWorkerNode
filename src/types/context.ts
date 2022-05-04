import { Config } from "./config.js";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";

export interface Context {
    config: Config,
    clients: {
        sqs: SQSClient,
        s3: S3Client,
        s3Presigner: S3RequestPresigner,
        dynamoDb: DynamoDBClient,

    }
}