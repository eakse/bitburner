/**
* @param {NS} ns
**/
import { getServerInfo, getServers, pad20, pad10, pad5, infoBlock, bigInfoBlock, strToDict, dictToStr } from "./util.js"; //Import specific functions from script


export async function main(ns) {
    var targetServer = ns.args[0] || "silver-helix";

    ns.tprint(getServerInfo(ns, targetServer));
    let hl = ns.getHackingLevel();
    ns.tprint(hl);
    var notHacked = new Array();
    var hacked = new Array();
    var notBackdoored = new Array();
    var notBackdooredButHacked = new Array();
    var freeRam = new Array();
    getServers(ns).forEach(server => {
        let realServer = ns.getServer(server.name);
        if ((hl >= realServer.requiredHackingSkill)) { //&& (!realServer.purchasedByPlayer)
            if (!realServer.hasAdminRights) {
                notHacked.push(server.name);
            } else {
                hacked.push(realServer);
            };
            if (!realServer.backdoorInstalled && !realServer.purchasedByPlayer) {
                notBackdoored.push(server.name);
            };
            if (realServer.hasAdminRights && !realServer.backdoorInstalled && !realServer.purchasedByPlayer) {
                notBackdooredButHacked.push(server.name);
            }
            if (realServer.hasAdminRights && realServer.maxRam - realServer.ramUsed > 2) {
                freeRam.push(`${pad20(server.name)} | ${pad10(ns.nFormat(realServer.maxRam - realServer.ramUsed, "0.000"))}`);

            };

            // ns.tprint(`${pad20(server.name)} | ${pad10(realServer.maxRam)} | ${pad10(realServer.ramUsed)} | ${pad10(ns.nFormat(realServer.maxRam - realServer.ramUsed, "0.000"))}`)
        }
    });
    ns.tprint(`
Not Hacked:
 ${notHacked.join('\n ')}
Not Backdoored:
 ${notBackdoored.join('\n ')}
Hacked but not Backdoored:
 ${notBackdooredButHacked.join('\n ')}
RAM > 2GB available:
 ${freeRam.join('\n ')}
`);
    var info = infoBlock(ns, ns.getServer(targetServer));
    ns.tprint(`\n${info.join('\n')}`);
    var bigInfo = bigInfoBlock(ns, hacked);
    ns.tprint("\n"+bigInfo);

    // var testDict = {
    //     "key1": "value1",
    //     "key2": "value2",
    //     "key3": "value3",
    //     "key4": "value4",
    // };

    // ns.tprint(testDict);
    // ns.tprint(dictToStr(testDict));
    // ns.tprint(strToDict(dictToStr(testDict)));

    // ns.purchaseServer("quadros", 1024)
    // notBackdooredButHacked.forEach(serverName => {
    //     // ns.
    // });ns.nFormat(ssl, "0.0")
    //     for (var i = 10; i <= 20; i++) {
    //         ns.tprint(i + " -- " + ns.nFormat(ns.getPurchasedServerCost(Math.pow(2, 10)), "(0.000a)"));
    //     }
}


export function autocomplete(data, args) {
    return [...data.servers];
}