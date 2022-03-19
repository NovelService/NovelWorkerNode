import { Config } from "./config";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";

export interface Context {
    config: Config,
    clients: {
        sqs: SQSClient,
        s3: S3Client
    }
}