/**
* @param {NS} ns
**/
export async function main(ns) {
    for (let i = 0; i < ns.args[0]; i++) {
        ns.run("y.js", 25, ns.args[1], i);
    }
};


export function autocomplete(data, args) {
    return [...data.servers];
}