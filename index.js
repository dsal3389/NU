(function() {
    const itemContainer = document.getElementById('status');
    const port = chrome.runtime.connect({ name: 'UN' });
    const htmlValues = {}

    createItem = (name) => { // creating cards dynamicliy
        const text = document.createTextNode(name.toUpperCase() + ": ");
        const span = document.createElement('span');
        const para = document.createElement('p');
        const item = document.createElement('li');

        itemContainer.appendChild(item);
        item.appendChild(para);
        para.appendChild(text);
        para.appendChild(span);

        span.classList.add(name);
        return span;
    }

    humanizeData = (bytes) => {
        if (bytes === undefined)
            bytes = 0;

        const thresh = 1000;
        if (Math.abs(bytes) < thresh)
            return bytes + ' B';

        const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const r = 10 ** 1;
        let u = -1;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    handleResponse = (res) => {
        for (let d of Object.keys(res)) {
            const lowd = d.toLowerCase(); // because it used a lot

            if (htmlValues[lowd] === undefined)
                htmlValues[lowd] = createItem(lowd);
            htmlValues[lowd].innerHTML = humanizeData(res[d]);
        }
    }


    port.postMessage({ req: { method: 'get', reqdata: 'all' } });
    window.setInterval(() => {
        port.postMessage({ req: { method: 'get', reqdata: 'all' } });
    }, 1000 * 5); // 5s

    port.onMessage.addListener(message => {
        handleResponse(message.res);
    });
})();