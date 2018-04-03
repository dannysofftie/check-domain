"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = require("http");
const path = require("path");
const dResolve = require("../core");
const port = process.env.PORT || 4000;
http_1.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url === '/') {
                fs_1.createReadStream(path.join(__dirname + '/../' + 'views/default.html')).pipe(res);
            }
            serveStaticFiles(req, res);
            break;
        case "POST":
            if (req.url === '/resolve') {
                req.on('data', async (chunk) => {
                    let b = await dResolve(chunk).then(data => data).catch(e => e);
                    res.end(JSON.stringify(b));
                });
            }
            break;
        default:
            fs_1.createReadStream(path.join(__dirname + '/..' + '/views/default.html')).pipe(res);
            break;
    }
}).listen(port, () => console.log(`Server listening at port: ${port}`));
function serveStaticFiles(req, res) {
    let rootPath = path.join('public' + req.url), mimeType = Object.create({
        '.js': 'text/javascript',
        '.css': 'text/css'
    });
    fs_1.existsSync(rootPath) ? (function () {
        // file found, return status 200 plus the file content
        fs_1.readFile(rootPath, (err, data) => {
            err ? (function () {
                res.writeHead(500, 'Internal server error', { 'Content-Type': 'text/plain' });
                res.end();
            })() : (function () {
                res.writeHead(200, { 'Content-Type': mimeType[path.extname(rootPath)] });
                res.end(data);
            })();
        });
    })() : (function () {
        // file not found and thus return 504
        res.writeHead(404, 'Ruquested file not found');
        res.end();
    })();
}
