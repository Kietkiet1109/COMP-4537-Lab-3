const http = require('http');
const url = require('url');
const fs = require('fs'); 
const message = require('./lang/en/en.js');

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

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

const writer = new Writer(8000);
writer.start();
