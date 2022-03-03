import { pad5, contractSolverScriptInfo } from "./util.js"; //Import specific functions from script


export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Need 2 positional arguments:\n  hostname\n  filename");
    } else {
        ns.tprint(contractSolverScriptInfo(ns));

        let host = ns.args[0];
        let fileName = ns.args[1];
        let inputData = ns.codingcontract.getData(fileName, host);

        let maxTrade = 0;
        let maxStartDay = 0;
        let maxEndDay = 0;
        for (var startDay = 0; startDay < inputData.length - 1; startDay++) {
            for (var endDay = startDay + 1; endDay < inputData.length; endDay++) {
                let currentDif = inputData[endDay] - inputData[startDay];
                if (Math.max(currentDif, maxTrade) > maxTrade) {
                    maxStartDay = startDay;
                    maxEndDay = endDay;
                    maxTrade = Math.max(currentDif, maxTrade);
                }
                // ns.tprint(`  startDay: ${startDay} | endDay: ${endDay} | maxTrade: ${maxTrade}`);
            }
        }
        if (maxTrade != 0) {
            let response = await ns.codingcontract.attempt(maxTrade, fileName, host, {"returnReward": true});
            ns.tprint(`
Max trade found:
  Start: ${pad5(maxStartDay)} | Value: ${pad5(inputData[maxStartDay])}
  End:   ${pad5(maxEndDay)} | Value: ${pad5(inputData[maxEndDay])}
  _________________________
                Trade: ${pad5(maxTrade)}

Response:
  ${response}
`);
        } else {
            ns.tprint("No valid trade found.");
        }
        ns.tprint(`${response}`);

    }

}

export function autocomplete(data, args) {
    return [...data.servers];
}
