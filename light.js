export async function main(ns) {
    var target = ns.getHostname();
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    while(true) {
        let ssl = ns.getServerSecurityLevel(target);
        let sma = ns.getServerMoneyAvailable(target);
        ns.tprint(target + " | SSL: " + ssl + " | Thresh: " + securityThresh);
        ns.tprint(target + " | SMA: " + sma + " | Thresh: " + moneyThresh);
       if (ssl > securityThresh) {
            ns.tprint(target + " | ACTION: WEAKEN")
            ns.tprint(target + " | " + await ns.weaken(target));
        } else if (sma < moneyThresh) {
            ns.tprint(target + " | ACTION: GROW")
            ns.tprint(target + " | " + await ns.grow(target));
        } else {
            ns.tprint(target + " | ACTION: HACK")
            ns.tprint(target + " | " + await ns.hack(target));
        }
        await ns.sleep(1);
    }
}