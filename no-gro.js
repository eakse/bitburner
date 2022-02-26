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
ns.nFormat(ssl, "0.0")
ns.nFormat(securityThresh, "0.0")

function logme(ns, servername, ssl, sma, securityThresh, moneyThresh, currentAct, previousAct, previousResult) {
    ns.tprint(`
${servername}
------------------------------------------------------
SSL: ${pad(ns.nFormat(ssl, "0.0"), defWidth)} | Thresh: ${pad(securityThresh, defWidth)}
SMA: ${pad(ns.nFormat(sma, "($ 0.00 a)"), defWidth)} | Thresh: ${pad(ns.nFormat(moneyThresh, "($ 0.00 a)"), defWidth)}
GRO: ${pad(toFixed(moneyThresh - sma, defPrec), defWidth)} |
RES: ${pad(toFixed(previousResult, defPrec), defWidth)} | ${previousAct}
ACT: ${pad(currentAct, defWidth)} |`)
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
            logme(ns, thisServer, ssl, sma, securityThresh, moneyThresh, "WEAKEN", previousAct, previousResult)
            previousResult = await ns.weaken(thisServer);
            previousAct = "WEAKEN";
            // } else if (sma < moneyThresh) {
            //     logme(ns, thisServer, ssl, sma, securityThresh, moneyThresh, "GROW", previousAct, previousResult)
            //     previousResult = await ns.grow(thisServer);
            //     previousAct = "GROW";
        } else {
            logme(ns, thisServer, ssl, sma, securityThresh, moneyThresh, "HACK", previousAct, previousResult)
            previousResult = await ns.hack(thisServer);
            previousAct = "HACK";
        }
        await ns.sleep(1);
    }
}
