/**
* @param {NS} ns
**/
import { pad10, portSettings, strToDict } from "./util.js"; //Import specific functions from script


var n = undefined;


export async function main(ns) {
    ns.disableLog("sleep");
    n = ns;
    var portStat = ns.getPortHandle(portSettings.stat);
    var portAver = ns.getPortHandle(portSettings.aver);

    while (true) {
        ns.clearLog();
        while (portStat.empty()) {
            await ns.sleep(100);
        }
        let data = strToDict(portStat.read());
        portStat.clear();
        portAver.clear();
        portAver.write(data["mAverage"]);
        // ns.print(portAver.read());
        // ns.print(data);
        // ns.print(data["mAverage"]);
        ns.print(`$PM: ${pad10(ns.nFormat(data.mAverage, "(0.000a)"))}`);
        await ns.sleep(1000);
    }
}