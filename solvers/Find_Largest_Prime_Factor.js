import { contractSolverScriptInfo, pad10, pad5 } from "./util.js"; //Import specific functions from script


var n = undefined;
var loglocal = true;
var ccData = undefined;


function myprint(text) {
    if (loglocal) {
        n.print(text)
    } else {
        n.tprint(text)
    }
}


function largestPrimeFactor(num) {
    for (let div = 2; div <= Math.sqrt(num); div++) {
        if (num % div != 0) {
            continue;
        }
        num = num / div;
        div = 1;
    }
    return num;
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
        var result = largestPrimeFactor(ccData);
        myprint(result);
        let response = await ns.codingcontract.attempt(String(result), fileName, host, { "returnReward": true });
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
