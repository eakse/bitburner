/**
* @param {NS} ns
**/
import { sort_by, serverJSONLine, serverListToJSON, serverToJSON, pp, getTime, getAllServerNames, getServerNamesMaxLength, pad } from "./util.js"; //Import specific functions from script


const logLocal = true;
var nsGlobal = undefined;
var copyList = [
    "/cnc/hackSingle.js",
    "/cnc/hack.js",
    "/cnc/grow.js",
    "/cnc/growSingle.js",
    "/cnc/weak.js",
    "/cnc/weakSingle.js",
    "util.js",
    "y.js"
];
const homeHostname = "home";
var ramReqs = {};
var targetServers = [];
var runningServers = [];
var serverNamesMaxLength = 0;


function getRamReqs(host, fileName) {
    return nsGlobal.getScriptRam(fileName, host)
}


async function copyFiles(sourceHost, targetHost, fileList) {
    let ramReqResults = {}
    for (var fileName of fileList) {
        await nsGlobal.scp(fileName, sourceHost, targetHost);
        ramReqResults[fileName] = getRamReqs(targetHost, fileName);
    };
    return ramReqResults
}


function finalize() {
    nsGlobal.print(`Ended at: ${getTime()}`)
}


export async function main(ns) {
    nsGlobal = ns;
    targetServers = [];
    runningServers = [];
        // ns.atExit(finalize);
    ns.tail()
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.print(`Starting at: ${getTime()}`);
    var targetHost = "42";
    ramReqs = await copyFiles(homeHostname, targetHost, copyList);

    serverNamesMaxLength = getServerNamesMaxLength(ns);
    getAllServerNames(ns).forEach(serverName => {
        let server = ns.getServer(serverName);
        if (server.hasAdminRights && !server.purchasedByPlayer) {
            targetServers.push(serverName);
            // ns.print(`targetServer added:  ${serverName}`);
        }
        if (server.purchasedByPlayer && serverName != homeHostname) {
            runningServers.push(serverName);
            // ns.print(`runningServer added: ${serverName}`);
        }
    });
    ns.print(`
Total target servers:  ${pad(targetServers.length, 3)}
Total running servers: ${pad(runningServers.length, 3)}

`)
    // ${JSON.stringify(serverToJSON(ns, targetServers[0]), null, 4)}

    // ns.tprint(pp(serverToJSON(ns, "rothman-uni")));

    serverListToJSON(ns, targetServers).sort(sort_by("mEff", true, parseInt)).forEach(serverJSON => {
        ns.print(serverJSONLine(ns, serverJSON))
    })


    var testData = serverListToJSON(ns, targetServers);
    // ns.print(pp(testData));
    // ns.print(copyList);
    // ns.print(pp(ramReqs));

    // ns.exit();
    // var runningHost = ns.args[0];
    // var targetHost = "n00dles";
    // var numThreads = 1;
    // await ns.scp("/"+hackPath, "home", runningHost);
    // await ns.scp(utilPath, "home", runningHost);

    // ns.exec(hackPath, runningHost, numThreads, targetHost, runningHost, "123")
    finalize();
}


export function autocomplete(data, args) {
    return [...data.servers];
}