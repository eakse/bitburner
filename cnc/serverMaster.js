/**
* @param {NS} ns
**/
// import {  } from "../util.js";
import { getTime, loadJSON, strToDict, dictToStr, portSettings, actStrings, getServerNamesMaxLength, tCh, pad, pad10 } from "./util.js"; //Import specific functions from script

const logLocal = true;
var nsGlobal = undefined;
var serverMaxLength = 0;
const actionResultEmpty = {
    "time": "Time    ",
    "targetHost": "targetHost",
    "runningHost": "runningHost",
    "id": "ID",
    "act": "ACT ",
    "result": "Result"
};
var messages = [];
const settingsFile = "/settings/serverMaster.txt";
var settings = {};
var stats = {
    "hack": {
        "max": 0,
        "maxRunningHost": "",
        "maxTargetHost": "",
        "total": 0
    },
    "server": {
        "startTime": getTime(),
        "startTimeUnix": Date.now()
    }
};




function logThis(text) {
    if (logLocal) {
        nsGlobal.print(text);
    } else {
        nsGlobal.tprint(text);
    }
}


function logLine(actionResult) {
    let time = actionResult.time;
    let host = pad(actionResult.runningHost, serverMaxLength);
    let target = pad(actionResult.targetHost, serverMaxLength);
    let act = actionResult.act;
    let res = pad10(actionResult.result);
    if (act == actStrings.hack) {
        res = pad10(nsGlobal.nFormat(actionResult.result, "(0.00a)"));
    } else if (act == actStrings.grow) {
        res = pad10(nsGlobal.nFormat(actionResult.result - 1, "0.00%"))
    }
    return `${time}${tCh.vs}${host}${tCh.vs}${target}${tCh.vs}${act}${tCh.vs}${res}`;
}


function logHeader() {
    return logLine(actionResultEmpty);
}

function logSplitter() {
    let time = Array(actionResultEmpty.time.length + 1).join(tCh.h);
    let host = Array(serverMaxLength).join(tCh.h);
    let target = Array(serverMaxLength).join(tCh.h);
    let act = Array(5).join(tCh.h);
    let res = Array(10).join(tCh.h);
    return `${time}${tCh.cs}${host}${tCh.cs}${target}${tCh.cs}${act}${tCh.cs}${res}`;
}


function logEmpty() {
    let time = Array(actionResultEmpty.time.length + 1).join(" ");
    let host = Array(serverMaxLength).join(" ");
    let target = Array(serverMaxLength).join(" ");
    let act = Array(5).join(" ");
    let res = Array(10).join(" ");
    return `${time}${tCh.vs}${host}${tCh.vs}${target}${tCh.vs}${act}${tCh.vs}${res}`;
}

function drawTable(ns) {
    ns.clearLog();
    let table = [];
    messages.slice(Math.max(messages.length - settings.drawHeight, 0)).forEach(message => {
        table.unshift(logLine(message));
    })
    while (table.length < settings.drawHeight) {
        table.push(logEmpty())
    }
    ns.print(getStatBlock(ns));
    ns.print(logHeader());
    ns.print(logSplitter());
    ns.print(table.join('\n'));
}


function getStatBlock(ns) {
    let average = stats.hack.total / ((Date.now() - stats.server.startTimeUnix) / 60000);
    let runTime = (Date.now() - stats.server.startTimeUnix)/1000;
    return `
START: ${pad10(stats.server.startTime)} | RUNTIME:    ${pad(ns.nFormat(runTime, '00:00:00'), serverMaxLength-5)} | CURRENT: ${pad(getTime(), serverMaxLength-5)}
MAX:   ${pad10(ns.nFormat(stats.hack.max, "(0.000a)"))} | BY:    ${pad(stats.hack.maxRunningHost, serverMaxLength)} | ON: ${pad(stats.hack.maxTargetHost, serverMaxLength)}
TOTAL: ${pad10(ns.nFormat(stats.hack.total, "(0.000a)"))} | PM:    ${pad(ns.nFormat(average, "(0.000a)"), serverMaxLength)} |
`
}



function loadSettings() {
    settings = loadJSON(nsGlobal, settingsFile);
}





function messageFilter(message) {
    // TODO: turn into single OR statement
    let ignore = false;
    if (typeof (message) == "string") {
        message = strToDict(message);
    }
    if (message.act == actStrings.hack) {
        ignore = settings.ignore.hack.all || message.result < settings.ignore.hack.threshhold;
    } else if (message.act == actStrings.grow) {
        ignore = settings.ignore.grow.all || message.result -1 < settings.ignore.grow.threshhold;
    } else if (message.act == actStrings.weak) {
        ignore = settings.ignore.weak.all || message.result < settings.ignore.weak.threshhold;
    }
    // nsGlobal.tprint(settings);
    ignore = ignore || settings.ignore.runningHost.includes(message.runningHost);
    ignore = ignore || settings.ignore.targetHost.includes(message.targetHost);
    ignore = ignore && !settings.ignore.runningWhiteList.includes(message.runningHost);
    ignore = ignore && !settings.ignore.targetWhiteList.includes(message.targetHost);
    return ignore
}


function processHack(message) {
    stats.hack.total += parseInt(message.result);
    // nsGlobal.tprint(`${message.result} | ${stats.hack.total}`);
    if (parseInt(message.result) > parseInt(stats.hack.max)) {
        stats.hack.max = message.result;
        stats.hack.maxRunningHost = message.runningHost;
        stats.hack.maxTargetHost = message.targetHost;
        nsGlobal.toast(`New record --> Amount: ${nsGlobal.nFormat(message.result, "(0.000a)")} by ${message.runningHost} on ${message.targetHost}`, "info", 5000);
    }
}


export async function main(ns) {
    nsGlobal = ns;
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.clearLog();
    loadSettings();
    serverMaxLength = getServerNamesMaxLength(ns);
    var portWeak = ns.getPortHandle(portSettings.weak);
    var portHack = ns.getPortHandle(portSettings.hack);
    var portGrow = ns.getPortHandle(portSettings.grow);

    // portHack.write("testing 123");;


    drawTable(ns);
    let settingsReloadTimer = 0;
    while (true) {
        // reload settings every now and then
        settingsReloadTimer += 1;
        if (settingsReloadTimer > 50) {
            settingsReloadTimer = 0;
            loadSettings();
        }
        let len = messages.length;
        if (!portGrow.empty()) {
            let message = strToDict(portGrow.read());
            if (!messageFilter(message)) {
                messages.push(message)
            }
        }
        if (!portWeak.empty()) {
            let message = strToDict(portWeak.read());
            if (!messageFilter(message)) {
                messages.push(message)
            }
        }
        if (!portHack.empty()) {
            let message = strToDict(portHack.read());
            processHack(message);;
            if (!messageFilter(message)) {
                messages.push(message)
            }
        }
        // if (len != messages.length) {
            drawTable(ns);
        // }
        await ns.sleep(100);
    }

}



// port = getPortHandle(5);
// back = port.data.pop(); //Get and remove last element in port

// //Wait for port data before reading
// while(port.empty()) {
//     sleep(10000);
// }
// res = port.read();

// //Wait for there to be room in a port before writing
// while (!port.tryWrite(5)) {
//     sleep(5000);
// }

// //Successfully wrote to port!