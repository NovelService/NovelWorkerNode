import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand
} from '@aws-sdk/client-dynamodb'
import {
    PurgeQueueCommand,
    SendMessageCommand,
    SQSClient
} from '@aws-sdk/client-sqs'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { randomUUID } from 'crypto'
import * as https from 'https'
import each from 'jest-each'
import { FileType, Message } from '../src/types/message'

describe('Integration tests', () => {

    let dynamoDBClient: DynamoDBClient
    let sqsClient: SQSClient
    let id : string
    const region = 'us-east-1'
    const credentials = {accessKeyId: 'some', secretAccessKey: 'thing'}
    const endpoint = 'http://localhost:4566'
    const queueUrl = `${endpoint}/000000000000/queue`
    const tableName = 'table'

    beforeEach(async () => {
        id = randomUUID()
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

    afterEach(async () => {
        const purgeQueueCommand = new PurgeQueueCommand({
            QueueUrl: queueUrl
        })
        await sqsClient.send(purgeQueueCommand)
        dynamoDBClient.destroy()
        sqsClient.destroy()
    })

    each([[FileType.EPUB], [FileType.PDF]])
        .test('Send %s job and download it', async (filetype: FileType) => {
            // given
            const message: Message = {
                id: id,
                urls: ['https://novelservice.github.io/', 'https://novelservice.github.io/'],
                options: {
                    fileType: filetype,
                    output: 'to-be-removed'
                }
            }
            const sendMessageCommand = new SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify(message)
            })

            // when
            await sqsClient.send(sendMessageCommand)

            // then
            const getItemCommand = new GetItemCommand({
                TableName: tableName,
                Key: marshall({'id': id})
            })
            let isDone = false
            let retries = 50
            while (!isDone && retries > 0) {
                const {Item} = await dynamoDBClient.send(getItemCommand)
                expect(Item).not.toBeUndefined()
                const itemObject = unmarshall(Item!!)
                if (itemObject.status === 'done') {
                    isDone = true
                    expect(itemObject.url).not.toBeUndefined()
                    expect(itemObject.url).toContain(filetype)
                        await new Promise<void>((resolve => {
                        https.get(itemObject.url, (res) => {
                            res.destroy()
                            expect(res.statusCode).toBe(200)
                            resolve()
                        })
                    }))
                }
                retries--
                await new Promise((resolve) => setTimeout(resolve, 200))
            }
            if (retries === 0) {
                throw Error('Job was not finished in 10 seconds')
            }
        }, 15000)

})
