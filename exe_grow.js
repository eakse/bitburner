export async function main(ns) {
    while (true) {
        await ns.grow(ns.args[0]);
        ns.sleep(1);
    }
}

export function autocomplete(data, args) {
    return [...data.servers];
}