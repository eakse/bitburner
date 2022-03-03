import { contractSolverScriptInfo, pad10, pad5 } from "./util.js"; //Import specific functions from script


var n = undefined;
var loglocal = true;
var result = [];
var ccData = undefined;



function myprint(text) {
    if (loglocal) {
        n.print(text)
    } else {
        n.tprint(text)
    }
}


// Generate IP Addresses

function generateIps(num) {
    num = num.toString();

    const length = num.length;

    const ips = [];

    for (let i = 1; i < length - 2; i++) {
        for (let j = i + 1; j < length - 1; j++) {
            for (let k = j + 1; k < length; k++) {
                const ip = [
                    num.slice(0, i),
                    num.slice(i, j),
                    num.slice(j, k),
                    num.slice(k, num.length)
                ];
                let isValid = true;

                ip.forEach(seg => {
                    isValid = isValid && isValidIpSegment(seg);
                });

                if (isValid) ips.push(ip.join("."));

            }

        }
    }

    return ips;


}

function isValidIpSegment(segment) {
    if (segment[0] == "0" && segment != "0") return false;
    segment = Number(segment);
    if (segment < 0 || segment > 255) return false;
    return true;
} 

export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Need 2 positional arguments:\n  hostname\n  filename");
    } else {
        n = ns;
        // loglocal = false;
        myprint(contractSolverScriptInfo(ns));

        var host = ns.args[0];
        var fileName = ns.args[1];
        ccData = ns.codingcontract.getData(fileName, host);

        result = generateIps(ccData);

        myprint(`\n${JSON.stringify(result)}`)
        let response = await ns.codingcontract.attempt(result, fileName, host, {"returnReward": true});
        myprint(`
Response:
${response}
`);
        ns.tprint(`${response}`);
    }

}


export function autocomplete(data, args) {
    return [...data.servers];
}
