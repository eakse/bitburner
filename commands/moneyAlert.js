/**
* @param {NS} ns
**/
import { pad10, longTime, portSettings } from "./util.js"; //Import specific functions from script


var n = undefined;


function getMoney() {
    return n.getPlayer().money;
}


export async function main(ns) {
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");
    n = ns;
    // let moneyStart = getMoney();
    let timeStart = Date.now();
    let moneyNeeded = ns.args[0];
    var portAver = ns.getPortHandle(portSettings.aver);
    var average = portSettings.portEmptyString;

    while (getMoney() < moneyNeeded) {
        ns.clearLog();
        while (average == portSettings.portEmptyString) {
            await ns.sleep(100);
            average = portAver.peek();
        }
        average = portAver.peek();
        let timeDiff = Date.now() - timeStart;
        let moneyDiff = moneyNeeded - getMoney();
        let eta = String((moneyDiff / average*60000) || 0).split(".")[0];
        // ns.print(eta);
        // ns.print(average);
        ns.print(`ETA: ${pad10(longTime(ns, eta))} | Need: ${pad10(ns.nFormat(moneyNeeded, "(0.000a)"))} | Have: ${pad10(ns.nFormat(getMoney(), "(0.000a)"))} | Diff: ${pad10(ns.nFormat(moneyDiff, "(0.000a)"))} | AVE: ${pad10(ns.nFormat(average, "(0.000a)"))}`);
        await ns.sleep(1000);
    }
    ns.alert(`Reached required amount: ${ns.nFormat(moneyNeeded, "(0.000a)")}`);
}