export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Need 2 positional arguments:\n  hostname\n  filename");
    } else {

        var host = ns.args[0];
        var fileName = ns.args[1];
        ns.tprint(`Running on ${host} for file: ${fileName}`);

        let ccType = await ns.codingcontract.getContractType(fileName, host);
        let ccDesc = String(await ns.codingcontract.getDescription(fileName, host)).replace(/&nbsp;/g, " ");
        let ccData = JSON.stringify(await ns.codingcontract.getData(fileName, host));
        let ccTrys = await ns.codingcontract.getNumTriesRemaining(fileName, host);
        ns.tprint(`
${host}/${fileName}
Details:
  Type:  ${ccType}
  Desc:  ${ccDesc}
  Data:  ${ccData}
  Tries: ${ccTrys}
`);
    }
    // let done = await ns.codingcontract.attempt("44,31,30,1,2,24,6,39,8", fileName, host, {"returnReward": true});
    // ns.tprint(done)

}

export function autocomplete(data, args) {
    return [...data.servers];
}