/**
* @param {NS} ns
**/
// import * as namespace from "script filename"; //Import all functions from script

function myMoney(ns) {
    return ns.getServerMoneyAvailable("home");
}


export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Need 2 positional arguments:\n  hostname\n  RAM");
    } else {
        ns.disableLog("sleep");
        ns.disableLog("getServerMoneyAvailable");
        var hostname = ns.args[0];
        var ram = ns.args[1];
        var cost = ns.getPurchasedServerCost(ram);
        while (myMoney(ns) < cost) {
            ns.tprint(`Need ${ns.nFormat(cost, "(0.00a)")} | Have  ${ns.nFormat(myMoney(ns), "(0.00a)")}`)
            await ns.sleep(5000);
        };
        ns.purchaseServer(hostname, ram);
        ns.tprint(`\nBought server ${hostname} for ${cost}`);;
    }
}