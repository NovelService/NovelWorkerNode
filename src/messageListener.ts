import _messageHandler from './messageHandler.js';
import { Context } from "./types/context.js";

import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

/**
 * Ensure only 1 job is executed at the same time, by toggling this.
 */
let working = false;

async function start(context: Context, messageHandler = _messageHandler) {
    const command = new ReceiveMessageCommand(
        {
            QueueUrl: context.config.aws.sqs.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        }
    );

    const doWork = async () => {
        if (working) {
            return
        }
        working = true

        try {
            const response = await context.clients.sqs.send(command);
            if (typeof response.Messages !== 'undefined' && typeof response.Messages[0].Body !== "undefined") {
                await messageHandler.handleMessage(context, response.Messages[0].Body);

                if (typeof response.Messages[0].ReceiptHandle !== "undefined") {
                    await deleteMessage(context, response.Messages[0].ReceiptHandle);
                }
            }
        } catch (error) {
            console.warn(error);
        } finally {
            working = false;
        }
    }

    setInterval(doWork, context.config.pollInterval);
}

async function deleteMessage(context: Context, receiptHandle: string) {
    const command = new DeleteMessageCommand({
        QueueUrl: context.config.aws.sqs.queueUrl,
        ReceiptHandle: receiptHandle
    });

    await context.clients.sqs.send(command)
}

export default { start };