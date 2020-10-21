"use strict";
exports.__esModule = true;
exports.commifyBN = exports.commify = exports.stringToBN = exports.BNToString = exports.weiBNToEtherString = exports.weiToEther = exports.weiToEtherBN = exports.weiStringToEtherBN = exports.etherStringToWeiString = exports.etherStringToWeiBN = void 0;
var ethers_1 = require("ethers");
function etherStringToWeiBN(ether) {
    return ethers_1.ethers.utils.parseEther(ether);
}
exports.etherStringToWeiBN = etherStringToWeiBN;
function etherStringToWeiString(ether) {
    return ethers_1.ethers.utils.parseEther(ether).toString();
}
exports.etherStringToWeiString = etherStringToWeiString;
function weiStringToEtherBN(wei) {
    return ethers_1.ethers.utils.bigNumberify(ethers_1.ethers.utils.formatEther(wei));
}
exports.weiStringToEtherBN = weiStringToEtherBN;
function weiToEtherBN(weiBN) {
    return ethers_1.ethers.utils.bigNumberify(ethers_1.ethers.utils.formatEther(weiBN));
}
exports.weiToEtherBN = weiToEtherBN;
function weiToEther(wei) {
    return ethers_1.ethers.utils.formatEther(wei);
}
exports.weiToEther = weiToEther;
function weiBNToEtherString(bn) {
    return ethers_1.ethers.utils.formatEther(bn.toString());
}
exports.weiBNToEtherString = weiBNToEtherString;
function BNToString(bn) {
    return bn.toString();
}
exports.BNToString = BNToString;
function stringToBN(str) {
    return ethers_1.ethers.utils.bigNumberify(str);
}
exports.stringToBN = stringToBN;
function commify(ether) {
    return ethers_1.ethers.utils.commify(ether);
}
exports.commify = commify;
function commifyBN(bn) {
    return ethers_1.ethers.utils.commify(bn.toString());
}
exports.commifyBN = commifyBN;
