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


// Merge Overlapping Intervals

export function mergeOverlap(intervals) {
    intervals.sort(([minA], [minB]) => minA - minB);
    for (let i = 0; i < intervals.length; i++) {
        for (let j = i + 1; j < intervals.length; j++) {
            const [min, max] = intervals[i];
            const [laterMin, laterMax] = intervals[j];
            if (laterMin <= max) {
                const newMax = laterMax > max ? laterMax : max;
                const newInterval = [min, newMax];
                intervals[i] = newInterval;
                intervals.splice(j, 1);
                j = i;
            }
        }
    }
    return intervals;
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

        result = mergeOverlap(ccData);

        myprint(`\n${JSON.stringify(result)}`)
        let response = await ns.codingcontract.attempt(JSON.stringify(result), fileName, host, {"returnReward": true});
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
