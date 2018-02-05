"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const port = process.env.PORT || 4000;
const fs_1 = require("fs");
const http_1 = require("http");
const path = require("path");
const domainResolve = require("../core");
http_1.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url == '/') {
                fs_1.createReadStream(path.join(__dirname + '/..' + '/..' + '/views/default.html')).pipe(res);
            }
            break;
        case "POST":
            if (req.url == "/check_domain") {
                req.on('data', (chunk) => {
                    domainResolve(chunk, (value) => {
                        console.log(value);
                        res.end(JSON.stringify({ value: value }));
                    });
                });
            }
            break;
        default:
            fs_1.createReadStream(path.join(__dirname + '/..' + '/..' + '/views/default.html')).pipe(res);
            break;
    }
    serveStatic(req, res);
}).listen(port, () => console.log(`Server listening at port: ${port}`));
function serveStatic(req, res) {
    const mimeType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };
    fs_1.readFile(path.join(__dirname + '/..' + '/..' + req.url), function (err, file) {
        if (err) {
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
        }
        else {
            const ext = path.parse(__dirname + '/..' + '/..' + req.url).ext;
            res.setHeader('Content-type', mimeType[ext] || 'text/plain');
            res.end(file);
        }
    });
}
