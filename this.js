export async function main(ns) {
    let thisServer = ns.getServer()["hostname"];
    var target = ns.args[0];
    var scriptID = thisServer + " | " + target;
    ns.tprint("Current target: " + target)
    if (target == undefined) {
        target = thisServer;
        ns.tprint("Current target: " + target)
    };

    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    var earnedMoney = 0;
    var ssl = 0;
    var sma = 0;

    while(true) {
        ssl = ns.getServerSecurityLevel(target);
        sma = ns.getServerMoneyAvailable(target);
        ns.tprint(scriptID + " - SSL: " + ssl);
        ns.tprint(scriptID + " - SMA: " + sma);
        if (ssl > securityThresh) {
            ns.tprint(scriptID + " - Action: weaken");
            await ns.weaken(target);
        } else if (sma < moneyThresh) {
            ns.tprint(scriptID + " - Action: grow");
            await ns.grow(target);
        } else {
            ns.tprint(scriptID + " - Action: hack");
            let currMoney = await ns.hack(target);
            earnedMoney += currMoney;
            ns.tprint(scriptID + " - Current hack: " + currMoney);
            ns.tprint(scriptID + " - Total money: " + earnedMoney);

        }
        await ns.sleep(100);
    }
}