import {
    UpdateItemCommand,
    UpdateItemCommandInput
} from '@aws-sdk/client-dynamodb'
import { Context } from './types/context.js'

async function finishItem(context: Context, id: string, url: string) {
    const input : UpdateItemCommandInput = {
            TableName: context.config.aws.dynamoDB.tableName,
            Key: {
                id: { S: id }
            },
            UpdateExpression: 'set #u = :url, #s = :status',
            ExpressionAttributeNames: {
                '#u': 'url',
                '#s': 'status'
            },
            ExpressionAttributeValues: {
                ':url': { S: url },
                ':status': { S: 'done' }
            }
        }
    const command = new UpdateItemCommand(input)
    console.log(`command ${JSON.stringify(input)}`)
    console.log(`Sending finish item message for item ${id}`)
    const response = await context.clients.dynamoDb.send(command)
    console.log(response)
}

export default { finishItem }