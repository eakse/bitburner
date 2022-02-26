/**
* @param {NS} ns
**/

import { dictToStr, portSettings, actStrings, getTime } from "util.js"; //Import specific functions from script


export async function main(ns) {
    let hostname = ns.args[0];
    let memNeeded = ns.args[1] || 2.7;
    let server = ns.getServer(hostname);
    let memMax = server.maxRam;
    let memUsed = server.ramUsed;
    let memFree = memMax - memUsed;
    let maxThreads = ns.nFormat(memFree / memNeeded, "0.00");

    ns.tprint(`${getTime()} - ${hostname}
Max: ${memMax} - Used: ${memUsed} - Free: ${memFree}
Threads available: ${maxThreads}`);

//     let port = ns.getPortHandle(portSettings.hack);
//     port.write(dictToStr(result));
}


export function autocomplete(data, args) {
    return [...data.servers];
}