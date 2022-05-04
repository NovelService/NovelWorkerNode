import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Context } from "./types/context.js";

async function finishItem(context: Context, id: string, url: string) {
    const command = new UpdateItemCommand(
        {
            TableName: context.config.aws.dynamoDB.tableName,
            Key: {
                id: { S: id }
            },
            UpdateExpression: "set #u = :url, #s = :status",
            ExpressionAttributeNames: {
                "#u": "url",
                "#s": "status"
            },
            ExpressionAttributeValues: {
                ":url": { S: url },
                ":status": { S: "done" }
            }
        }
    );
    console.log("Sending finish item message for item ");
    const response = await context.clients.dynamoDb.send(command);
    console.log(response);
}

export default { finishItem };