import { Converter } from './converter.js'
import fileHandler from './fileHandler.js'
import statusHandler from './statusHandler.js'
import { Context } from './types/context.js'
import { FileType, Message } from './types/message.js'

async function handleMessage(context: Context, messageString: string, converter = new Converter()) {
    console.log('Parameters are ' + messageString)
    let message: Message = JSON.parse(messageString)

    //backwards compatibility
    if (message.options.fileType == null) {
        message.options.fileType = FileType.EPUB
    }

    let result: {
        filepath: string
        filename: string
    }
    switch (message.options.fileType) {
        case FileType.EPUB:
            result = await converter.toEpub(message.id, message.urls)
            break
        case FileType.PDF:
            result = await converter.toPdf(message.id, message.urls)
            break
    }

    await fileHandler.saveFile(context, result.filepath, result.filename)
    const signedUrl = await fileHandler.createPresignedUrl(context, result.filename)
    await statusHandler.finishItem(context, message.id, signedUrl)
}

export default { handleMessage };