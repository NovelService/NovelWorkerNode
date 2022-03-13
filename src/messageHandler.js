import _converter from './converter.js';

function handleMessage(message, converter = _converter) {
    console.log("Parameters are " + message)
    let parameters = JSON.parse(message);
    converter.toEpub(parameters.urls, parameters.options);
}

export default { handleMessage };