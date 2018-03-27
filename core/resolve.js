"use strict";
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
    async function doResolveAll(param) {
        let ifIP = await checkIP(domain);
        // test validity of the ip to the domain name
        let IPREGEX = new RegExp(/^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/);
        //@ts-ignore
        if (!IPREGEX.test(ifIP))
            return callback('Does not exist');
        let MX = await checkMX(domain);
        let NS = await checkNS(domain);
        return callback({ ipAddress: ifIP, mailX: MX, nameS: NS });
    }
    doResolveAll(domain).then(data => {
        return callback(data);
    }).catch(err => callback(err));
};
