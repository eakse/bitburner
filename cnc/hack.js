import { createMessage, dictToStr, portSettings, actStrings } from "util.js"; //Import specific functions from script

/**
 * Runs the Hack command on target host.
 * 
 * @param  {targetHost}   hostname  This is the target hostname as a string
 * @param  {runningHost}  hostname  String to identify this process
 * @param  {runningHost}  id        String to identify this process
 * @return {port.Write}             writes to portSettings.hack with the result
 */
export async function main(ns) {
    while (true) {
        let message = createMessage(
            ns.args[0], 
            ns.args[1], 
            ns.args[2], 
            actStrings.hack,
            await ns.hack(ns.args[0]))
        // {
        //     "targetHost": ns.args[0],
        //     "runningHost": ns.args[1],
        //     "id": ns.args[2],
        //     "act": actStrings.hack,
        //     "result": await ns.hack(ns.args[0]),
        //     "time": getTime()
        // };
        let port = ns.getPortHandle(portSettings.hack);
        port.write(dictToStr(message));
    }
}


export function autocomplete(data, args) {
    return [...data.servers];
}