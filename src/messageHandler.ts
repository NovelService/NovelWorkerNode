import _converter from './converter.js';

async function handleMessage(message: string, converter = _converter) {
    console.log("Parameters are " + message)
    let parameters = JSON.parse(message);
    await converter.toEpub(parameters.urls, parameters.options);
}

export default { handleMessage };