/** @param {NS} ns **/


export function autocomplete(data, args) {return args[0] in [...data.servers]}


function jsontest(ns) {
    let fileName = "/settings/serverMaster.txt";
    let contents = ns.read(fileName);
    let asJSON = JSON.parse(contents);
    ns.tprint(contents);
    if (typeof(contents) == "string") {
        ns.tprint('yes')
    }
    ns.tprint(typeof(contents))
    ns.tprint(asJSON);
    ns.tprint(typeof(asJSON))
}


export async function main(ns) {
}