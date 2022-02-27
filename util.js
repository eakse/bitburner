/**
* @param {NS} ns
**/
var defWidth = 10;
var totalWidth = "SSL:  │ Thresh: ".length + (defWidth * 2) - 1;
var splitter = Array(totalWidth).join("─");
const splitChar = ";"; // CSV valid

export const moneyThreshMult = 0.75;

export const tCh = {
    "h": "─",
    "v": "│",
    "vs": " │ ",
    "c": "┼",
    "cs": "─┼─"
}

export const portSettings = {
    "weak": 5,
    "grow": 6,
    "hack": 7
}

export const actStrings = {
    "hack": "HACK",
    "grow": "GROW",
    "weak": "WEAK"
}

export function getTime() {
    return new Date().toLocaleTimeString('en-GB') //24h time format
}

export function pad(str, width) {
    let padstring = Array(width).join(" ");
    if (typeof str === "undefined")
        return padstring;
    return (padstring + str).slice(-padstring.length);
}


export function pad5(str) {
    return pad(str, 5)
}


export function pad10(str) {
    return pad(str, 10)
}


export function pad15(str) {
    return pad(str, 15)
}


export function pad20(str) {
    return pad(str, 20)
}


export function pad60(str) {
    return pad(str, 60)
}


export function shortTime(ns, time) {
    var timeArr = String(ns.nFormat(time / 1000, "00:00")).split(":");
    if (timeArr[1][0] == "0") {
        timeArr[1] = timeArr[1][1]
    }
    return `${timeArr[1]}:${timeArr[2]}`
}


export function strToDict(str) {
    return JSON.parse(str)
    /* OLD FUNCTION
    let result = {};
    let splitStr = str.split(splitChar);
    for (let i = 0; i < splitStr.length; i += 2) {
        result[splitStr[i]] = splitStr[i + 1]
    }
    return result
    */
}

export function pp(obj) {
    return JSON.stringify(obj, null, 4)
}

export function dictToStr(dict) {
    return JSON.stringify(dict)
    /* OLD FUNCTION
    let result = "";
    for (const [key, value] of Object.entries(dict)) {
        result += `${key};${value};`;
    }
    return result
    */
}


export function serverToJSON(ns, serverName) {
    let server = ns.getServer(serverName);
    return {
        "name": String(serverName),
        "tGrow": Number(ns.getGrowTime(serverName)),
        "tHack": Number(ns.getHackTime(serverName)),
        "tWeak": Number(ns.getWeakenTime(serverName)),
        "mAvail": Number(server.moneyAvailable),
        "mMax": Number(server.moneyMax),
        "mThresh": Number(server.moneyMax * moneyThreshMult),
        "mGrowth": Number(server.serverGrowth),
        "mEff": Number(server.moneyMax/ns.getHackTime(serverName)),
        "rFree": Number(server.maxRam - server.ramUsed),
        "rMax": Number(server.maxRam),
        "rUsed": Number(server.ramUsed),
        "sMin": Number(server.minDifficulty),
        "sCurr": Number(server.hackDifficulty)
    }
}


/** 
 * 
 * @param {bitburner ns} ns              Needed as it calls function within this NS
 * @param {list}         serverNameList  A list of server names
 * @returns {list}                       A list of servers as JSON
 */
export function serverListToJSON(ns, serverNameList) {
    let result = [];
    serverNameList.forEach(serverName => {
        result.push(serverToJSON(ns, serverName))
    })
    return result
}


export function serverJSONLine(ns, serverJSON) {
    let width = getServerNamesMaxLength(ns);
    let result = `${pad(serverJSON.name, width)}`;
    result += `${tCh.vs}${pad10(ns.nFormat(serverJSON.mAvail, "0.0a"))}`;
    result += `${tCh.vs}${pad10(ns.nFormat(serverJSON.mThresh, "0.0a"))}`;
    result += `${tCh.vs}${pad10(ns.nFormat(serverJSON.mMax, "0.0a"))}`;
    result += `${tCh.vs}${pad5(serverJSON.mGrowth)}`;
    result += `${tCh.vs}${pad(shortTime(ns, serverJSON.tHack), 6)}`;
    result += `${tCh.vs}${pad(shortTime(ns, serverJSON.tGrow), 6)}`;
    result += `${tCh.vs}${pad(shortTime(ns, serverJSON.tWeak), 6)}`;
    result += `${tCh.vs}${pad(ns.nFormat(serverJSON.sMin, "0.0"), 6)}`;
    result += `${tCh.vs}${pad(ns.nFormat(serverJSON.sCurr, "0.0"), 6)}`;
    result += `${tCh.vs}${pad(ns.nFormat(serverJSON.rMax, "0.0"), 6)}`;
    result += `${tCh.vs}${pad(ns.nFormat(serverJSON.rUsed, "0.0"), 6)}`;
    result += `${tCh.vs}${pad(ns.nFormat(serverJSON.rFree, "0.0"), 6)}`;
    result += `${tCh.vs}${pad(ns.nFormat(serverJSON.mEff, "0.0"), 10)}`;

    return result
}


export function contractSolverScriptInfo(ns) {
    let runningScript = ns.getRunningScript();
    let host = ns.args[0];
    let fileName = ns.args[1];
    let ccType = ns.codingcontract.getContractType(fileName, host);
    let ccData = ns.codingcontract.getData(fileName, host);
    let ccTrys = ns.codingcontract.getNumTriesRemaining(fileName, host);
    let result = `
${Array(200).join("─")}
Run Details:
  Script name:         ${runningScript.filename}
  Script PID:          ${runningScript.pid}
  Host running script: ${runningScript.server}

  Target host:         ${host}
  Target filename:     ${fileName}
  Target type:         ${ccType}
  Tries remaining:     ${ccTrys}
  Input Data:
    ${ccData}
${Array(200).join("─")}
`;
    return result
}


export function infoBlock(ns, server) {
    let hostName = server.hostname;
    let hackDifficulty = server.hackDifficulty;
    let securityThresh = server.minDifficulty + 5;
    let moneyAvailable = server.moneyAvailable;
    let moneyThresh = server.moneyMax * moneyThreshMult;
    let serverGrowth = server.serverGrowth;
    let maxRam = server.maxRam;
    let freeRam = ns.nFormat(server.maxRam - server.ramUsed, "0.0")
    var result = new Array();
    result.push(pad(hostName, totalWidth));
    result.push(splitter);
    result.push(`SSL: ${pad(ns.nFormat(hackDifficulty, "0.0"), defWidth)} │ Thresh: ${pad(securityThresh, defWidth)}`);
    result.push(`SMA: ${pad(ns.nFormat(moneyAvailable, "(0.0a)"), defWidth)} │ Thresh: ${pad(ns.nFormat(moneyThresh, "(0.0a)"), defWidth)}`);
    result.push(`GRO: ${pad(ns.nFormat(moneyThresh - moneyAvailable, "(0.0a)"), defWidth)} │ Growth: ${pad(ns.nFormat(serverGrowth, "0.0"), defWidth)}`);
    result.push(`RAM: ${pad(maxRam + "GB", defWidth)} │ Free RAM: ${pad(freeRam + "GB", defWidth - 2)}`);
    return result
}


var maxBigBlockWidth = 180;
export function bigInfoBlock(ns, serverList) {
    let home = infoBlock(ns, ns.getServer('home'));
    let blockWidth = home[0].length;
    let columns = Math.floor(maxBigBlockWidth / blockWidth);
    let blockHeight = home.length;
    let rows = Math.ceil(serverList.length / columns)
    // let size = `${columns*blockWidth} x ${rows*blockHeight}`
    // ns.tprint(columns + " " + rows);
    // ns.tprint(serverList.length/nrOfBlocks)
    var infoBlocks = new Array();

    serverList.forEach(server => {
        let info = infoBlock(ns, server);
        infoBlocks.push(info)
    })
    while (infoBlocks.length < rows * columns) {
        //  fill the block as I'm lazy
        infoBlocks.push(new Array(blockHeight).fill(""));
    }
    var result = new Array();
    for (var cBase = 0; cBase < serverList.length; cBase += columns) {
        for (var cline = 0; cline < blockHeight; cline++) {

            let currLine = "";
            for (var cCurr = 0; cCurr < columns; cCurr++) {
                currLine += infoBlocks[cBase + cCurr][cline] + "   "
            }
            // ns.tprint(currLine)
            result.push(currLine);
        };
        result.push("");
        // result.push("═══════════════════════════════════╬════════════════════════════════════╬════════════════════════════════════╬════════════════════════════════════╬════════════════════════════════════╣");
    }
    // ns.tprint(infoBlocks[1][1])
    return result.join("\n")
}


export function logme(ns, servername, ssl, sma, smm, securityThresh, moneyThresh, currentAct, previousAct, previousResult, terminalOutput) {
    if (previousAct == "HACK") {
        previousResult = ns.nFormat(previousResult, "(0.000a)")
    } else {
        previousResult = ns.nFormat(previousResult, "0.00")
    }
    var output = `
${pad(servername, totalWidth)}
${splitter}
SSL: ${pad(ns.nFormat(ssl, "0.0"), defWidth)} │ Thresh: ${pad(securityThresh, defWidth)}
SMA: ${pad(ns.nFormat(sma, "(0.000a)"), defWidth)} │ Thresh: ${pad(ns.nFormat(moneyThresh, "(0.000a)"), defWidth)}
GRO: ${pad(ns.nFormat(moneyThresh - sma, "(0.000a)"), defWidth)} │ Max:    ${pad(ns.nFormat(smm, "(0.000a)"), defWidth)}
RES: ${pad(previousResult, defWidth)} │         ${pad(previousAct, defWidth)}
ACT: ${pad(getTime(), defWidth)} │         ${pad(currentAct, defWidth)}`
    if (terminalOutput) {
        ns.tprint(output)
    }
    else {
        ns.print(output)
    }
}


let svObj = (name = "home", depth = 0) => ({ name: name, depth: depth });
export function getServers(ns) {
    let result = [];
    let visited = { "home": 0 };
    let queue = Object.keys(visited);
    let name;
    while ((name = queue.pop())) {
        let depth = visited[name];
        result.push(svObj(name, depth));
        let scanRes = ns.scan(name);
        for (let i = scanRes.length; i >= 0; i--) {
            if (visited[scanRes[i]] === undefined) {
                queue.push(scanRes[i]);
                visited[scanRes[i]] = depth + 1;
            }
        }
    }
    return result;
}


export function getAllServerNames(ns) {
    var result = [];
    getServers(ns).forEach(server => {
        result.push(server.name)
    })
    return result
}


export function getServerNamesMaxLength(ns) {
    let result = 0;
    getAllServerNames(ns).forEach(serverName => {
        result = Math.max(result, serverName.length)
    })
    return result
}

export function getServerInfo(ns, host) {
    let hackTime = ns.getHackTime(host)
    let growTime = ns.getGrowTime(host)
    let weakTime = ns.getWeakenTime(host)
    let server = ns.getServer(host)


    return String(`
${pad(host, "═══════════════════════════════════════════════════".length + 1)}
═══════════════════════════════════════════════════
HACK: ${pad10(server.hasAdminRights)} │ BKDR: ${pad10(server.backdoorInstalled)}
NOW$: ${pad10(ns.nFormat(server.moneyAvailable, "(0.00a)"))} │ MAX$: ${pad10(ns.nFormat(server.moneyMax, "(0.00a)"))}
THCK: ${pad10(shortTime(ns, hackTime))} │ TGRO: ${pad10(shortTime(ns, growTime))} │ TWKN: ${pad10(shortTime(ns, weakTime))}
`)
}


export const sort_by = (field, reverse, primer) => {
    /**
     * Shamelessly stolen from:
     * https://stackoverflow.com/a/979325/9267296
     */
    const key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

export function loadJSON(ns, fileName) {
    let contents = ns.read(fileName);
    let asJSON = JSON.parse(contents);
    return asJSON;
}