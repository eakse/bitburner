import { dictToStr, portSettings, actStrings, getTime } from "util.js"; //Import specific functions from script


export async function main(ns) {
    /**
     * Runs the grow command on target host.
     * 
     * @param  {ns.args[0]}  hostname    This is the target hostname as a string
     * @param  {ns.args[1]}  id          String to identify this process
     * @return {port.Write}              writes to portSettings.grow with the result
     */
    while (true) {
        let result = {
            "targetHost": ns.args[0],
            "runningHost": ns.args[1],
            "id": ns.args[2],
            "act": actStrings.grow,
            "result": await ns.grow(ns.args[0]),
            "time": getTime()
        };
        let port = ns.getPortHandle(portSettings.grow);
        port.write(dictToStr(result));
    }

}
export function autocomplete(data, args) {
    return [...data.servers];
}