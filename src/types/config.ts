import { Credentials } from "@aws-sdk/types/dist-types/credentials"

export interface Config {
    aws: AWSConfig
    pollInterval: number
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