/**
* @param {NS} ns
**/
import { getTime } from "./util.js"; //Import specific functions from script

const logLocal = true;
var nsGlobal = undefined;
const hackPath = "cnc/hackSingle.js";
const utilPath = "util.js";
var hackCommandline = "";


export async function main(ns) {
    ns.tail(ns.getRunningScript())
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.print(getTime())
    nsGlobal = ns;
    var runningHost = ns.args[0];
    var targetHost = "n00dles";
    var numThreads = 1;
    await ns.scp("/"+hackPath, "home", runningHost);
    await ns.scp(utilPath, "home", runningHost);

    // ns.exec(hackPath, runningHost, numThreads, targetHost, runningHost, "123")
}


export function autocomplete(data, args) {
    return [...data.servers];
}