import { dictToStr, portSettings, actStrings, getTime } from "util.js"; //Import specific functions from script


export async function main(ns) {
    /**
     * Runs the weak command on target host.
     * 
     * @param  {ns.args[0]}  hostname    This is the target hostname as a string
     * @param  {ns.args[1]}  id          String to identify this process
     * @return {port.Write}              writes to portSettings.weak with the result
     */
    while (true) {
        let result = {
            "targetHost": ns.args[0],
            "runningHost": ns.args[1],
            "id": ns.args[2],
            "act": actStrings.weak,
            "result": await ns.weaken(ns.args[0]),
            "time": getTime()
        };
        let port = ns.getPortHandle(portSettings.weak);
        port.write(dictToStr(result));
    }

}
export function autocomplete(data, args) {
    return [...data.servers];
}