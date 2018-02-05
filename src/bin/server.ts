const port = process.env.PORT || 4000
import { readFile, createReadStream, createWriteStream, exists } from 'fs'
import { createServer, IncomingMessage, OutgoingMessage, ClientResponse, ServerResponse } from 'http'
import { parse } from 'url'
import path = require('path')
import domainResolve = require('../core')

createServer((req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url == '/') {
                createReadStream(path.join(__dirname + '/..' + '/..' + '/views/default.html')).pipe(res)
            }
            break
        case "POST":
            if (req.url == "/check_domain") {
                req.on('data', (chunk) => {
                    domainResolve(chunk, (value) => {
                        console.log(value)
                        res.end(JSON.stringify({ value: value }))
                    })
                })
            }
            break
        default:
            createReadStream(path.join(__dirname + '/..' + '/..' + '/views/default.html')).pipe(res)
            break
    }
    serveStatic(req, res)
}).listen(port, () =>
    console.log(`Server listening at port: ${port}`)
    )


function serveStatic(req: IncomingMessage, res: ServerResponse) {
    const mimeType: number | any = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    }
    readFile(path.join(__dirname + '/..' + '/..' + req.url), function (err, file) {
        if (err) {
            res.statusCode = 500
            res.end(`Error getting the file: ${err}.`)
        } else {
            const ext = path.parse(__dirname + '/..' + '/..' + req.url).ext
            res.setHeader('Content-type', mimeType[ext] || 'text/plain')
            res.end(file)
        }
    })
}
