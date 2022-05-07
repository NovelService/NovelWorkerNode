import _converter from './converter.js';
import fileHandler from './fileHandler.js'
import statusHandler from './statusHandler.js'
import { Context } from "./types/context.js";
import { Message } from './types/message.js';


async function handleMessage(context: Context, messageString: string, converter = _converter) {
    console.log("Parameters are " + messageString)
    let message: Message = JSON.parse(messageString);
    const filename = await converter.toEpub(message.id, message.urls);

    await fileHandler.saveFile(context, filename);
    const signedUrl = await fileHandler.createPresignedUrl(context, filename)
    await statusHandler.finishItem(context, message.id, signedUrl);
}

export default { handleMessage };