import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand
} from '@aws-sdk/client-dynamodb'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { randomUUID } from 'crypto'
import * as https from 'https'
import { Message } from '../src/types/message.js'

describe('Integration tests', () => {

    let dynamoDBClient: DynamoDBClient
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

    test('Send epub job and download epub', async () => {
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
        const getItemCommand = new GetItemCommand({
            TableName: tableName,
            Key: marshall({'id': id})
        })
        let isDone = false
        let retries = 5
        while (!isDone && retries > 0) {
            const {Item} = await dynamoDBClient.send(getItemCommand)
            expect(Item).not.toBeUndefined()
            const itemObject = unmarshall(Item!!)
            if (itemObject.status === 'done') {
                isDone = true
                expect(itemObject.url).not.toBeUndefined()
                https.get(itemObject.url, (res) => {
                    expect(res.statusCode).toBe(200)
                })
            }
            retries--
            await new Promise((r) => setTimeout(r, 1000))
        }
        if (retries === 0) {
            throw Error('Job was not finished in 5 seconds')
        }
    }, 10000)
})
