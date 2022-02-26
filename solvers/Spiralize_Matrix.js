import { contractSolverScriptInfo } from "./util.js"; //Import specific functions from script


export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Need 2 positional arguments:\n  hostname\n  filename");
    } else {
        ns.tprint(contractSolverScriptInfo(ns));

        let host = ns.args[0];
        let fileName = ns.args[1];

    }
}


export function autocomplete(data, args) {
    return [...data.servers];
}
