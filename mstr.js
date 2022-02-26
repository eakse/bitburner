export async function main(ns) {
    let thisServer = ns.getServer()["hostname"];
    var target = ns.args[0];
    var scriptID = thisServer + " | " + target;
    ns.tprint("Current target: " + target)
    if (target == undefined) {
        target = thisServer;
        ns.tprint("Current target: " + target)
    };

    while(true) {
        let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
        let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
        let ssl = ns.getServerSecurityLevel(target);
        let sma = ns.getServerMoneyAvailable(target);
        ns.tprint(scriptID + " - SSL: " + ssl + " secThresh: " + securityThresh);
        ns.tprint(scriptID + " - SMA: " + sma + " $$$Thresh: " + moneyThresh);
        await ns.sleep(5000);
    }
}