/**
* @param {NS} ns
**/
import { logme, getTime, portSettings, dictToStr, actStrings } from "./util.js"; //Import specific functions from script

const moneyThreshMult = 0.75;
var logging = false;


export async function main(ns) {
    ns.disableLog("getServerMinSecurityLevel");
    ns.disableLog("getServerSecurityLevel");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerMoneyAvailable");
    var scriptHost = ns.getRunningScript().server;
    const scriptPID = ns.getRunningScript().pid;
    const scriptFileName = ns.getRunningScript().filename;
    if (logging) {
        ns.tprint(`Running ${scriptFileName} with PID: ${scriptPID} on ${scriptHost}`)
    }
    var targetHost = ns.args[0] || scriptHost;
    const moneyMax = ns.getServerMaxMoney(targetHost);
    const moneyThresh = moneyMax;
    var securityThresh = ns.getServerMinSecurityLevel(targetHost);
    var previousAct = "";
    var previousResult = "";

    const portGrow = ns.getPortHandle(portSettings.grow);
    const portWeak = ns.getPortHandle(portSettings.weak);
    var baseResult = {
        "targetHost": targetHost,
        "runningHost": scriptHost,
        "id": scriptPID,
        "act": actStrings.hack,
        "result": "",
        "time": ""               
    };
    while (true) {
        ns.clearLog();
        ns.print(`File: ${scriptFileName}\n  PID: ${scriptPID}\n  Host: ${scriptHost}`)
        let ssl = ns.getServerSecurityLevel(targetHost);
        let sma = ns.getServerMoneyAvailable(targetHost);
        if (ssl > securityThresh) {
            logme(ns, targetHost, ssl, sma, moneyMax, securityThresh, moneyThresh, actStrings.weak, previousAct, previousResult, logging)
            previousResult = await ns.weaken(targetHost);
            previousAct = actStrings.weak;
            baseResult.act = previousAct;
            baseResult.result = previousResult;
            baseResult.time = getTime();
            portWeak.write(dictToStr(baseResult));
        } else if (sma < moneyThresh) {
            logme(ns, targetHost, ssl, sma, moneyMax, securityThresh, moneyThresh, actStrings.grow, previousAct, previousResult, logging)
            previousResult = await ns.grow(targetHost);
            previousAct = actStrings.grow;
            baseResult.act = previousAct;
            baseResult.result = previousResult;
            baseResult.time = getTime();
            portGrow.write(dictToStr(baseResult));
        } else {
            ns.tprint(`DONE running ${scriptFileName} with PID: ${scriptPID} on ${scriptHost}`);
            ns.exit();
        }
        await ns.sleep(1);
    }
}


export function autocomplete(data, args) {
    return [...data.servers];
}