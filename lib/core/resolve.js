"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const dns_1 = require("dns");
function checkIP(param) {
    return new Promise((resolve, reject) => {
        dns_1.lookup(param, 4, (err, address, family) => err ? reject(err.code) : resolve(address));
    });
}
function checkNS(param) {
    return new Promise((resolve, reject) => {
        dns_1.resolveNs(param, (err, address) => err ? reject(err.code) : resolve(address));
    });
}
function checkMX(param) {
    return new Promise((resolve, reject) => {
        dns_1.resolveMx(param, (err, address) => err ? reject(err.code) : resolve(address));
    });
}
module.exports = (chunk, callback) => {
    let domain = JSON.parse(chunk.toString()).domain_name;
    function doResolveAll(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let ifIP = yield checkIP(domain);
            // test validity of the ip to the domain name
            let IPREGEX = new RegExp(/^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/);
            //@ts-ignore
            if (!IPREGEX.test(ifIP))
                return callback('Does not exist');
            let MX = yield checkMX(domain);
            let NS = yield checkNS(domain);
            return callback({ ipAddress: ifIP, mailX: MX, nameS: NS });
        });
    }
    doResolveAll(domain).then(data => {
        return callback(data);
    }).catch(err => callback(err));
};
