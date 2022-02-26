/**
* @param {NS} ns
**/
import { getAllServerNames, sort_by } from "./util.js"; //Import specific functions from script


function getContractTable(contracts) {
    var result = [];
    var hostnameMax = 0;
    var filenameMax = 0;
    var typeMax = 0;
    contracts.forEach(contract=>{
        hostnameMax = Math.max(hostnameMax, contract.hostname.length);
        filenameMax = Math.max(filenameMax, contract.filename.length);
        typeMax = Math.max(typeMax, contract.type.length);
    });
    result.push(`${"Hostname".padEnd(hostnameMax)} │ ${"Filename".padEnd(filenameMax)} │ ${"Type".padEnd(typeMax)}`);
    result.push(`${"".padEnd(hostnameMax, "─")}─┼─${"".padEnd(filenameMax, "─")}─┼─${"".padEnd(typeMax, "─")}`);
    contracts.forEach(contract=>{
        result.push(`${contract.hostname.padEnd(hostnameMax)} │ ${contract.filename.padEnd(filenameMax)} │ ${contract.type.padEnd(typeMax)}`);
    });
    return result
}


function getContract(ns, hostname, filename) {
    var contract = {
        "hostname": hostname,
        "filename": filename,
        "type": ns.codingcontract.getContractType(filename, hostname)
    };
    return contract
}


function getServerContracts(ns, hostname) {
    var result = [];
    ns.ls(hostname, ".cct").forEach(filename => {
        result.push(getContract(ns, hostname, filename))
    });
    return result
}


export async function main(ns) {
    var contracts = []
    getAllServerNames(ns).forEach(hostname => {
        contracts = contracts.concat(getServerContracts(ns, hostname));
    });
    var contractsString = getContractTable(contracts.sort(sort_by("type", false, (a) =>  a.toUpperCase()))).join('\n');
    ns.tprint(`
Contracts found:

${contractsString}`)
}
