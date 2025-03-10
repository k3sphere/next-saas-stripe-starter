
/**
 * Convert an IP address to a number.
 * @param {string} ip - The IP address.
 * @returns {number} - The numeric representation of the IP address.
 */
function ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

/**
 * Convert a number to an IP address.
 * @param {number} num - The numeric representation of the IP address.
 * @returns {string} - The IP address.
 */
function numberToIp(num: number): string {
    return [
        (num >> 24) & 255,
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255
    ].join('.');
}

/**
 * Get the next IP address from a given CIDR block and a maximum IP address.
 * @param {string} cidr - The CIDR block.
 * @param {string} maxIp - The maximum IP address.
 * @returns {string} - The next IP address.
 */
export function getNextIpFromCidr(cidr: string, maxIp: string): string {
    const [baseIp, prefixLength] = cidr.split('/');
    const baseIpNum = ipToNumber(baseIp);
    const maxIpNum = ipToNumber(maxIp);
    const subnetMask = ~((1 << (32 - parseInt(prefixLength, 10))) - 1);
    const networkAddress = baseIpNum & subnetMask;
    const nextIpNum = maxIpNum + 1;

    if ((nextIpNum & subnetMask) !== networkAddress) {
        throw new Error('Next IP is out of the CIDR block range');
    }

    return numberToIp(nextIpNum);
}

/**
 * Get the start IP address from a given CIDR block.
 * @param {string} cidr - The CIDR block.
 * @returns {string} - The start IP address.
 */
export function getStartIpFromCidr(cidr: string): string {
    const [baseIp, prefixLength] = cidr.split('/');
    const baseIpNum = ipToNumber(baseIp);
    const subnetMask = ~((1 << (32 - parseInt(prefixLength, 10))) - 1);
    const networkAddress = baseIpNum & subnetMask;
    // Add 1 to the network address to get the first usable IP address
    const startIpNum = networkAddress + 1;

    return numberToIp(startIpNum);
}

export function getLastIpFromCidr(cidr: string): string {
    const [baseIp, prefixLength] = cidr.split('/');
    const baseIpNum = ipToNumber(baseIp);
    const subnetMask = ~((1 << (32 - parseInt(prefixLength, 10))) - 1);
    const broadcastAddress = baseIpNum | ~subnetMask;
    // Subtract 1 from the broadcast address to get the last usable IP address
    const lastIpNum = broadcastAddress - 1;

    return numberToIp(lastIpNum);
}

