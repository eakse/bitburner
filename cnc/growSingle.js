/**
* @param {NS} ns
**/

import { dictToStr, portSettings } from "./util.js"; //Import specific functions from script


export async function main(ns) {
/**
 * Runs the Grow command on target host.
 * 
 * @param  {ns.args[0]}  hostname    This is the target hostname as a string
 * @param  {ns.args[2]}  id          String to identify this process
 * @return {port.Write}              writes to portSettings.grow with the result
 */
    let result = {
        "targetHost": ns.args[0],
        "runningHost": ns.args[1],
        "id": ns.args[2],
        "result": await ns.grow(ns.args[0])
    };
    let port = ns.getPortHandle(portSettings.grow);
    port.write(dictToStr(result));
}


export function autocomplete(data, args) {
    return [...data.servers];
}