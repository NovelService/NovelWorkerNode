import { Converter } from './converter.js'
import fileHandler from './fileHandler.js'
import statusHandler from './statusHandler.js'
import { Context } from './types/context.js'
import { Message } from './types/message.js'

async function handleMessage(context: Context, messageString: string, converter = new Converter()) {
    console.log('Parameters are ' + messageString)
    let message: Message = JSON.parse(messageString)
    const {
        filepath,
        filename
    } = await converter.toEpub(message.id, message.urls)

    await fileHandler.saveFile(context, filepath, filename)
    const signedUrl = await fileHandler.createPresignedUrl(context, filename)
    await statusHandler.finishItem(context, message.id, signedUrl)
}

export default { handleMessage };