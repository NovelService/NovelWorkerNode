import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand
} from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { randomUUID } from 'crypto'
import { Message } from '../types/message'

describe('Integration tests', () => {

    let dynamoDBClient: DynamoDBClient
    let s3Client: S3Client
    let sqsClient: SQSClient
    const id = randomUUID()
    const region = 'us-east-1'
    const credentials = {accessKeyId: 'some', secretAccessKey: 'thing'}
    const endpoint = 'http://localhost:4566'
    const queueUrl = `${endpoint}/000000000000/queue`
    const tableName = 'table'

    beforeEach(async () => {
        dynamoDBClient = new DynamoDBClient({
            region: region,
            credentials: credentials,
            endpoint: endpoint
        })
        s3Client = new S3Client({
            region: region,
            credentials: credentials,
            endpoint: endpoint,
            forcePathStyle: true
        })
        sqsClient = new SQSClient({
            region: region,
            credentials: credentials,
            endpoint: endpoint
        })

        const putItemCommand = new PutItemCommand({
            TableName: tableName,
            Item: {
                'id': {S: id},
                'status': {S: 'queued'}
            },
        })
        await dynamoDBClient.send(putItemCommand)
    })

    test('Calls percollate with correct values', async () => {
        // given
        const message: Message = {
            id: id,
            urls: ['https://novelservice.github.io/'],
            options: {
                output: 'to-be-removed'
            }
        }
        const sendMessageCommand = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(message)
        })

        // when
        const sqsResponse = await sqsClient.send(sendMessageCommand)

        // then
        console.log(sqsResponse)
        const getItemCommand = new GetItemCommand({
            TableName: tableName,
            Key: {'id': {S: id}}
        })
        await new Promise((r) => setTimeout(r, 20000))
        const getItemResponse = await dynamoDBClient.send(getItemCommand)
        console.log(getItemResponse)
    }, 30000)

})
