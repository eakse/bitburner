function myMoney() {
    return getServerMoneyAvailable("home");
}

disableLog("getServerMoneyAvailable");
disableLog("sleep");

var cnt = 8;

for (var i = 0; i < cnt; i++) {
    while (hacknet.getNodeStats(i).ram < 64) {
        var cost = hacknet.getRamUpgradeCost(i, 2);
        while (myMoney() < cost) {
            print("Need $" + cost + " . Have $" + myMoney());
            sleep(3000);
        }
        res = hacknet.upgradeRam(i, 2);
    };
};

print("All nodes upgraded to 64GB RAM");
