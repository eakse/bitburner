/**
* @param {NS} ns
**/
import { getTime } from "./util.js"; //Import specific functions from script

const logLocal = true;
var nsGlobal = undefined;
const yPath = "y.js";
const utilPath = "util.js";
var hackCommandline = "";


export async function main(ns) {
    // ns.tail(ns.getRunningScript())
    ns.disableLog("sleep");
    ns.disableLog("scan");
    // ns.print(getTime())
    nsGlobal = ns;
    var runningHost = ns.args[0];
    await ns.scp(yPath, "home", runningHost);
    await ns.scp(utilPath, "home", runningHost);

}


export function autocomplete(data, args) {
    return [...data.servers];
}