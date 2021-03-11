import { ethers } from 'ethers';

export function etherStringToWeiBN(ether: string): ethers.utils.BigNumber {
    return ethers.utils.parseEther(ether);
}

export function etherStringToWeiString(ether: string): string {
    return ethers.utils.parseEther(ether).toString();
}

export function weiStringToEtherBN(wei: string): ethers.utils.BigNumber {
    return ethers.utils.bigNumberify(ethers.utils.formatEther(wei));
}

export function weiToEtherBN(weiBN: ethers.utils.BigNumber): ethers.utils.BigNumber {
    return ethers.utils.bigNumberify(ethers.utils.formatEther(weiBN));
}

export function weiToEther(wei: string): string {
    return ethers.utils.formatEther(wei);
}

export function weiBNToEtherString(bn: ethers.utils.BigNumber): string {
    return ethers.utils.formatEther(bn.toString());
}

export function BNToString(bn: ethers.utils.BigNumber): string {
    return bn.toString();
}

export function stringToBN(str: string): ethers.utils.BigNumber {
    return ethers.utils.bigNumberify(str);
}

export function commify(ether: string): string {
    return ethers.utils.commify(ether);
}

export function commifyBN(bn: ethers.utils.BigNumber): string {
    return ethers.utils.commify(bn.toString());
}

export function getDataHash(raw: string) {
    const packed = ethers.utils.solidityPack(['string'], [raw]);
    return ethers.utils.keccak256(packed);
}