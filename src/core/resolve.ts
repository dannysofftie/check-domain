import { resolve, resolve4, resolve6, resolveCname, resolveMx, resolveNs, lookup } from 'dns'

export = (chunk: string | Buffer, callback: (data: any) => void) => {
    let domain = JSON.parse(chunk.toString()).domain_name

    async function doResolveAll(param: string) {
        let ifIP: string | object = await checkIP(domain)
        // test validity of the ip to the domain name
        let IPREGEX = new RegExp(/^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/)
        //@ts-ignore
        if (!IPREGEX.test(ifIP))
            return callback('Does not exist')

        let MX = await checkMX(domain)
        let NS = await checkNS(domain)
        return callback({ ipAddress: ifIP, mailX: MX, nameS: NS })
    }

    doResolveAll(domain).then(data => {
        return callback(data)
    }).catch(err => callback(err))
}

function checkIP(param: string) {
    return new Promise((resolve, reject) => {
        lookup(param, 4, (err, address, family) => err ? reject(err.code) : resolve(address))
    })
}

function checkNS(param: string) {
    return new Promise((resolve, reject) => {
        resolveNs(param, (err, address) => err ? reject(err.code) : resolve(address))
    })
}

function checkMX(param: string) {
    return new Promise((resolve, reject) => {
        resolveMx(param, (err, address) => err ? reject(err.code) : resolve(address))
    })
}