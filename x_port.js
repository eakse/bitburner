function pad(str, width) {
    let padstring = Array(width).join(' ');
    if (typeof str === 'undefined')
        return padstring;
    return (padstring + str).slice(-padstring.length);
}


function toFixed(value, precision) {
    var precision = precision || 0,
        power = Math.pow(10, precision),
        absValue = Math.abs(Math.round(value * power)),
        result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

    if (precision > 0) {
        var fraction = String(absValue % power),
            padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
        result += '.' + padding + fraction;
    }
    return result;
}

var defPrec = 3;
var defWidth = 20;
var comPort = 19;


async function logme(ns, servername, ssl, sma, securityThresh, moneyThresh, currentAct, previousAct, previousResult) {
    let msg =`
${servername}
------------------------------------------------------
SSL: ${pad(toFixed(ssl, defPrec), defWidth)} | Thresh: ${pad(securityThresh, defWidth)}
SMA: ${pad(toFixed(sma, defPrec), defWidth)} | Thresh: ${pad(moneyThresh, defWidth)}
GRO: ${pad(toFixed(moneyThresh - sma, defPrec), defWidth)} |
RES: ${pad(toFixed(previousResult, defPrec), defWidth)} | ${previousAct}
ACT: ${pad(currentAct, defWidth)} |`;
    let success = await ns.tryWritePort(comPort, msg);
}


export async function main(ns) {
    var thisServer = ns.getHostname();
    var moneyThresh = ns.getServerMaxMoney(thisServer) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(thisServer) + 5;
    var previousAct = "";
    var previousResult = "";
    while (true) {
        let ssl = ns.getServerSecurityLevel(thisServer);
        let sma = ns.getServerMoneyAvailable(thisServer);
        if (ssl > securityThresh) {
            await logme(ns, thisServer, ssl, sma, securityThresh, moneyThresh, "WEAKEN", previousAct, previousResult)
            previousResult = await ns.weaken(thisServer);
            previousAct = "WEAKEN";
        } else if (sma < moneyThresh) {
            await logme(ns, thisServer, ssl, sma, securityThresh, moneyThresh, "GROW", previousAct, previousResult)
            previousResult = await ns.grow(thisServer);
            previousAct = "GROW";
        } else {
            await logme(ns, thisServer, ssl, sma, securityThresh, moneyThresh, "HACK", previousAct, previousResult)
            previousResult = await ns.hack(thisServer);
            previousAct = "HACK";
        }
        await ns.sleep(1);
    }
}
