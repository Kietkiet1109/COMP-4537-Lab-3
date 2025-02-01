const http = require('http');
const url = require('url');
const fs = require('fs');
const utils = require('./modules/utils.js');
const message = require('./lang/en/en.js');

// ChatGPT use as a reference for idea of Server class
class Server {
    constructor(port) {
        this.port = port;
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    // ChatGPT use as a reference to get this function
    handleRequest(req, res) {
        const q = url.parse(req.url, true).query;
        const name = q.name;

        if (req.method === 'GET' && name) {
            const currentDate = utils.getDate().toString();
            const greeting = `<p style="color: blue; font-weight:bold;">${message.hello.replace('%1', name)} ${currentDate}</p>`;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(greeting);
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`${message.getDateError}`);
        }
    }
}

// ChatGPT use as a reference for idea of Writer class
class Writer {
    constructor(port) {
        this.port = port;
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const queryObject = parsedUrl.query;

        if (req.method === 'GET' && parsedUrl.pathname.includes('writeFile')) {
            this.handleWriteFile(queryObject.text, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(message.writeError);
        }
    }

    // ChatGPT use as a reference for idea of Writer class
    handleWriteFile(text, res) {
        if (text) {
            const filePath = 'file.txt';  
            this.appendToFile(filePath, text, res);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(message.writeError); 
        }
    }

    // ChatGPT use as a reference for idea of Writer class
    appendToFile(filePath, text, res) {
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(message.writeError);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`${message.appended}${text}`);
            }
        });
    }
}

// ChatGPT use as a reference for idea of Reader class
class Reader {
    constructor(port) {
        this.port = port;
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathParts = parsedUrl.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];

        if (req.method === 'GET' && pathParts.includes('readFile')) {
            if (fileName) {
                const filePath = `./${fileName}`;
                this.checkFileAccess(filePath, res);
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(message.readError);
        }
    }

    // ChatGPT use as a reference to get this function
    checkFileAccess(filePath, res) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`${message.notFound} ${filePath}`);
            } else {
                this.readFile(filePath, res);
            }
        });
    }

    // ChatGPT use as a reference to get this function
    readFile(filePath, res) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(message.readError);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    }
}

// ChatGPT use as a reference for running 3 class with 3 parsed URL
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/getDate/') {
        new Server().handleRequest(req, res);
    } else if (parsedUrl.pathname === '/writeFile/') {
        new Writer().handleRequest(req, res);
    } else if (parsedUrl.pathname.startsWith('/readFile/')) {
        new Reader().handleRequest(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(message.urlError);
    }
});

server.listen(8000, () => {
    console.log(message.serverRunning);
});
