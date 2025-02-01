const http = require('http');
const url = require('url');
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

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

const server = new Server(8000);
server.start();
