"use strict";
exports.__esModule = true;
exports.Utils = void 0;
var ethers_1 = require("ethers");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.etherStringToWeiBN = function (ether) {
        return ethers_1.ethers.utils.parseEther(ether);
    };
    Utils.prototype.etherStringToWeiString = function (ether) {
        return ethers_1.ethers.utils.parseEther(ether).toString();
    };
    Utils.prototype.weiStringToEtherBN = function (wei) {
        return ethers_1.ethers.utils.bigNumberify(ethers_1.ethers.utils.formatEther(wei));
    };
    Utils.prototype.weiToEtherBN = function (weiBN) {
        return ethers_1.ethers.utils.bigNumberify(ethers_1.ethers.utils.formatEther(weiBN));
    };
    Utils.prototype.weiToEther = function (wei) {
        return ethers_1.ethers.utils.formatEther(wei);
    };
    Utils.prototype.weiBNToEtherString = function (bn) {
        return ethers_1.ethers.utils.formatEther(bn.toString());
    };
    Utils.prototype.BNToString = function (bn) {
        return bn.toString();
    };
    Utils.prototype.stringToBN = function (str) {
        return ethers_1.ethers.utils.bigNumberify(str);
    };
    Utils.prototype.commify = function (ether) {
        return ethers_1.ethers.utils.commify(ether);
    };
    Utils.prototype.commifyBN = function (bn) {
        return ethers_1.ethers.utils.commify(bn.toString());
    };
    return Utils;
}());
exports.Utils = Utils;
