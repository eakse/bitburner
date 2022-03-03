import { contractSolverScriptInfo, pad10, pad5 } from "./util.js"; //Import specific functions from script


var mode = ["top", "right", "bottom", "left"]
var currentMode = 0;
var n = undefined;
var loglocal = true;
var result = [];
var ccData = undefined;


function nextMode() {
    currentMode += 1;
    if (currentMode > mode.length - 1) {
        currentMode = 0
    }
    myprint(`Mode switched to ${getMode()}`)
}


function getMode() {
    return mode[currentMode]
}


function myprint(text) {
    if (loglocal) {
        n.print(text)
    } else {
        n.tprint(text)
    }
}


function modeTop() {
    myprint(`Running mode TOP on: ${JSON.stringify(ccData)}`)
    for (let index = 0; index < ccData[0].length; index++) {
        result.push(ccData[0][index]);
    }
    ccData.shift();
}


function modeRight() {
    myprint(`Running mode RIGHT on: ${JSON.stringify(ccData)}`)
    for (let index = 0; index < ccData.length; index++) {
        result.push(ccData[index].pop());
    }
}


function modeBottom() {
    myprint(`Running mode BOTTOM on: ${JSON.stringify(ccData)}`)
    for (let index = ccData[ccData.length - 1].length - 1; index >= 0; index--) {
        result.push(ccData[ccData.length - 1][index]);
    }
    ccData.pop();
}


function modeLeft() {
    myprint(`Running mode LEFT on: ${JSON.stringify(ccData)}`)
    for (let index = ccData.length - 1; index >= 0; index--) {
        result.push(ccData[index].shift());
    }
}


function sanitize(){
    let tmp = [];
    for (let index = 0; index < ccData.length; index++) {
        if (ccData[index].length > 0) {
            tmp.push(ccData[index])
        }
    }
    ccData = tmp;
}

// Spiralize Matrix

function spiral(arr, accum = []) {
    if (arr.length === 0 || arr[0].length === 0) {
      return accum;
    }
    accum = accum.concat(arr.shift());
    if (arr.length === 0 || arr[0].length === 0) {
      return accum;
    }
    accum = accum.concat(column(arr, arr[0].length - 1));
    if (arr.length === 0 || arr[0].length === 0) {
      return accum;
    }
    accum = accum.concat(arr.pop().reverse());
    if (arr.length === 0 || arr[0].length === 0) {
      return accum;
    }
    accum = accum.concat(column(arr, 0).reverse());
    if (arr.length === 0 || arr[0].length === 0) {
      return accum;
    }
    return spiral(arr, accum);
  }
  
  function column(arr, index) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      const elm = arr[i].splice(index, 1)[0];
      if (elm) {
        res.push(elm);
      }
    }
    return res;
  }
  
  

export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Need 2 positional arguments:\n  hostname\n  filename");
    } else {
        n = ns;
        // loglocal = false;
        myprint(contractSolverScriptInfo(ns));
        currentMode = 0;

        var host = ns.args[0];
        var fileName = ns.args[1];
        ccData = ns.codingcontract.getData(fileName, host);
        var safetyCounter = 0;
        var safetyMax = 50;
        var notdone = true;

        notdone = false;
        result = spiral(ccData);

        while (notdone) {
            let currentMode = getMode();
            safetyCounter++;
            myprint(`loop: ${pad10(safetyCounter + "/" + safetyMax)} | mode: ${pad10(currentMode)}`);
            if (safetyCounter > safetyMax) {
                notdone = false;
            }
            switch (currentMode) {
                case "top":
                    modeTop();
                    break;
                case "right":
                    modeRight();
                    break;
                case "bottom":
                    modeBottom();
                    break;
                case "left":
                    modeLeft();
                    break;
                default:
                    notdone = false;
                    break;
            }
            nextMode();
            sanitize();
            if (!ccData.length) {
                notdone = false;
            }
        }
        myprint(`\n${JSON.stringify(result)}`)
        let response = await ns.codingcontract.attempt(JSON.stringify(result), fileName, host, {"returnReward": true});
        myprint(`
Response:
${response}
`);
        ns.tprint(`${response}`);
    }

}


export function autocomplete(data, args) {
    return [...data.servers];
}
