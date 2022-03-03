/**
* @param {NS} ns
**/

import { dictToStr, portSettings } from "./util.js"; //Import specific functions from script


export async function main(ns) {
    let message = createMessage(
        ns.args[0], 
        ns.args[1], 
        ns.args[2], 
        actStrings.grow,
        await ns.hack(ns.args[0]))
    let port = ns.getPortHandle(portSettings.grow);
    port.write(dictToStr(message));
}


export function autocomplete(data, args) {
    return [...data.servers];
}