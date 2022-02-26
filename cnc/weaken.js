/**
* @param {NS} ns
**/
export async function main(ns) {
    while (true) {
        let result = await ns.weaken(ns.args[0]);
        ns.print(result);
    }
}


export function autocomplete(data, args) {
    return [...data.servers];
}