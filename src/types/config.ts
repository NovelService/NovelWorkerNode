import { Credentials } from "@aws-sdk/types/dist-types/credentials"

export interface Config {
    aws: AWSConfig
}

interface AWSConfig {
    credentials: Credentials,
    region: string,
    endpoint?: string,
    sqs: {
        queueUrl: string
    },
    s3: {
        bucket: string
    }
}