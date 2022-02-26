/** @param {NS} ns **/
 var thisServer = undefined;
 var npd = "NULL PORT DATA";
 var comPort = 19;


export async function main(ns) {
    thisServer = ns.getServer();
    ns.tprint("Running on: " + thisServer["hostname"]);
    while (true) {
        let data = await ns.readPort(comPort);
        ns.tprint(data);
        if (data != npd) {
            ns.tprint(data);
        } else {
            ns.sleep(1000);
        }
        ns.sleep(1)
    }
}