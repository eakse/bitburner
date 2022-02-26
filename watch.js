/**
* @param {NS} ns
**/
import { getTime, infoBlock } from "./util.js"; //Import specific functions from script

const sleepDelay = 1000;

export async function main(ns) {
    ns.tail(ns.getRunningScript())
    ns.disableLog("sleep");
    ns.disableLog("scan");
    const serverName = ns.args[0];
    while (true) {
        ns.clearLog();
        ns.print(getTime())
        ns.print(infoBlock(ns, ns.getServer(serverName)).join("\n"));
        await ns.sleep(sleepDelay);
    }
    
}


export function autocomplete(data, args) {
    return [...data.servers];
}