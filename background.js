/*
    this background script is like the "backend", it will never send
    data by it self only serve requests, so all incoming requests are
    requests, outgoing messages are responses to the request
*/
const inMemory = {}; // where all the data is stored

chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name == 'UN');
    port.onMessage.addListener((message) => {
        port.postMessage({ res: inMemory })
    });
});

chrome.webRequest.onCompleted.addListener((res) => {
    const headers = res.responseHeaders;
    const lengthHeader = headers.find(header => header.name === "content-length");

    if (lengthHeader) {
        const length = +lengthHeader.value;

        if (inMemory[res.method] === undefined)
            inMemory[res.method] = 0;
        inMemory[res.method] += length;
    }
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);