"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuctionParams = exports.P2POfferPackable = exports.P2POfferCommodity = exports.P2POffer = exports.TransferNFTRequest = exports.TransferRequest = exports.SmartIDPublic = exports.SmartIDRegistry = exports.SmartIDLogin = exports.SmartID = void 0;
var ethers_1 = require("ethers");
var Constants = require("./constants");
var contracts_1 = require("./contracts");
var wallets_1 = require("./wallets");
var transactions_1 = require("./transactions");
var graph_1 = require("./graph");
var SmartID = /** @class */ (function () {
    function SmartID(signer, identity, wallet, network) {
        if (network === void 0) { network = 'mainnet'; }
        this.signer = signer;
        this.identity = identity;
        this.wallet = wallet;
        this.network = network;
        this.contractsService = new contracts_1.Contracts(this.network);
        this.transactionsService = new transactions_1.Transactions();
    }
    SmartID.prototype.forward = function (destination, data) {
        return __awaiter(this, void 0, void 0, function () {
            var identityContract, response, error_1, receipt, receiptError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identityContract = this.contractsService.getContractSigner(this.identity, Constants.IDENTITY_ABI, this.signer);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, identityContract.forward(destination, data, Constants.OVERRIDES)];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw new Error(error_1);
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.transactionsService.getReceipt(response)];
                    case 5:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                    case 6:
                        receiptError_1 = _a.sent();
                        console.error(receiptError_1);
                        throw new Error(receiptError_1);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /******** TRANSFER */
    SmartID.prototype.transfer = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transfer.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        throw new Error(error_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferSending = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferSending.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        throw new Error(error_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferDomain = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferDomain.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4);
                        throw new Error(error_4);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferDomainSending = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferDomainSending.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_5 = _a.sent();
                        console.error(error_5);
                        throw new Error(error_5);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferNFT = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferNFT.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_6 = _a.sent();
                        console.error(error_6);
                        throw new Error(error_6);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferNFTDomain = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferNFTDomain.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_7 = _a.sent();
                        console.error(error_7);
                        throw new Error(error_7);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferNFTRef = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferNFTRef.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.reference,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_8 = _a.sent();
                        console.error(error_8);
                        throw new Error(error_8);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferNFTRefDomain = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferNFTRefDomain.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.reference,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_9 = _a.sent();
                        console.error(error_9);
                        throw new Error(error_9);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferPNFT = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferPNFT.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.packableId,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_10 = _a.sent();
                        console.error(error_10);
                        throw new Error(error_10);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.transferPNFTDomain = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract, data, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        data = walletContract.interface.functions.transferPNFTDomain.encode([
                            tx.tokenAddress,
                            tx.destination,
                            tx.packableId,
                            tx.amount,
                            tx.data,
                            tx.kind
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_11 = _a.sent();
                        console.error(error_11);
                        throw new Error(error_11);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** P2P */
    // Common for all P2Ps [9-17]
    SmartID.prototype.cancelOffer = function (offerId, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.cancelOffer.encode([
                            offerId
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_12 = _a.sent();
                        console.error(error_12);
                        throw new Error(error_12);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Common for all P2Ps [9-17]
    SmartID.prototype.updateBuyAmount = function (offerId, buyAmount, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.updateBuyAmount.encode([
                            offerId,
                            buyAmount
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_13 = _a.sent();
                        console.error(error_13);
                        throw new Error(error_13);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Common for all P2Ps [9-17]
    SmartID.prototype.voteDeal = function (dealId, vote, // 1 - Confirm | 2 - Cancel
    p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.voteDeal.encode([
                            dealId,
                            vote
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_14 = _a.sent();
                        console.error(error_14);
                        throw new Error(error_14);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Deals where buyer part is Fiat. Common for [9-14] P2Ps 
    SmartID.prototype.deal = function (offerId, buyAmount, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, receipt, event_1, i, topics, data, _log, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.deal.encode([
                            offerId,
                            buyAmount
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3:
                        receipt = _a.sent();
                        if (!(receipt.logs != undefined)) return [3 /*break*/, 7];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < receipt.logs.length)) return [3 /*break*/, 7];
                        if (!(receipt.logs[i].address.toLowerCase() == p2pAddress.toLowerCase())) return [3 /*break*/, 6];
                        if (!(receipt.logs[i].topics[0] == "0x75c48d2c41d94e0ba2f763f7aa64a7cae7a2802b6e471cb4ccff923c99e03977")) return [3 /*break*/, 6];
                        topics = receipt.logs[i].topics;
                        data = receipt.logs[i].data;
                        _log = { topics: topics, data: data };
                        return [4 /*yield*/, this.contractsService.decodeEvent(p2pContract, _log)];
                    case 5:
                        event_1 = _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, [event_1.dealId, receipt.transactionHash]];
                    case 8:
                        error_15 = _a.sent();
                        console.error(error_15);
                        throw new Error(error_15);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // Deals where buyer part is ERC223. Common for [9-15] P2Ps 
    SmartID.prototype.dealToken = function (offerId, buyAmount, buyToken, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.deal.encode([
                            offerId,
                            buyAmount
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            buyToken,
                            buyAmount,
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_16 = _a.sent();
                        console.error(error_16);
                        throw new Error(error_16);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // ERC223 vs ERC223/Fiat. Primary and Secondary [9, 11] 
    SmartID.prototype.offer = function (offerParams, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, receipt, event_2, i, topics, data, _log, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.offer.encode([
                            offerParams.tokens,
                            offerParams.amounts,
                            offerParams.settings,
                            offerParams.limits,
                            offerParams.auditor,
                            offerParams.description,
                            offerParams.metadata
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            offerParams.tokens[0],
                            offerParams.amounts[0],
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3:
                        receipt = _a.sent();
                        if (!(receipt.logs != undefined)) return [3 /*break*/, 7];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < receipt.logs.length)) return [3 /*break*/, 7];
                        if (!(receipt.logs[i].address.toLowerCase() == p2pAddress.toLowerCase())) return [3 /*break*/, 6];
                        topics = receipt.logs[i].topics;
                        data = receipt.logs[i].data;
                        _log = { topics: topics, data: data };
                        return [4 /*yield*/, this.contractsService.decodeEvent(p2pContract, _log)];
                    case 5:
                        event_2 = _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, [event_2.offerId, receipt.transactionHash]];
                    case 8:
                        error_17 = _a.sent();
                        console.error(error_17);
                        throw new Error(error_17);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // NFT vs ERC223/Fiat. Primary and Secondary [10, 12]
    SmartID.prototype.offerCommodity = function (offerParams, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_NFT_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.offer.encode([
                            offerParams.sellToken,
                            offerParams.sellId,
                            offerParams.buyToken,
                            offerParams.buyAmount,
                            offerParams.isBuyFiat,
                            offerParams.minReputation,
                            offerParams.auditor,
                            offerParams.description,
                            offerParams.metadata
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            offerParams.sellToken,
                            offerParams.sellId,
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_18 = _a.sent();
                        console.error(error_18);
                        throw new Error(error_18);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // PNFT vs ERC223/Fiat. Primary and Secondary [13, 14]
    SmartID.prototype.offerPackable = function (offerParams, p2pIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress(p2pIndex)];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_PNFT_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.offer.encode([
                            offerParams.tokens,
                            offerParams.tokenId,
                            offerParams.amounts,
                            offerParams.settings,
                            offerParams.limits,
                            offerParams.auditor,
                            offerParams.description,
                            offerParams.metadata,
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValuePNFT.encode([
                            offerParams.tokens[0],
                            offerParams.tokenId,
                            offerParams.amounts[0],
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_19 = _a.sent();
                        console.error(error_19);
                        throw new Error(error_19);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.offerTokenRequestPackable = function (offerParams) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress("17")];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_PNFT_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.offer.encode([
                            offerParams.tokens,
                            offerParams.tokenId,
                            offerParams.amounts,
                            offerParams.settings,
                            offerParams.limits,
                            offerParams.auditor,
                            offerParams.description,
                            offerParams.metadata,
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            offerParams.tokens[0],
                            offerParams.amounts[0],
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_20 = _a.sent();
                        console.error(error_20);
                        throw new Error(error_20);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.offerFiatRequestPackable = function (offerParams) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress("17")];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_PNFT_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.offer.encode([
                            offerParams.tokens,
                            offerParams.tokenId,
                            offerParams.amounts,
                            offerParams.settings,
                            offerParams.limits,
                            offerParams.auditor,
                            offerParams.description,
                            offerParams.metadata,
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_21 = _a.sent();
                        console.error(error_21);
                        throw new Error(error_21);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.dealPackable = function (offerId, buyAmount, buyToken, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, p2pContract, p2pData, walletContract, walletData, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress("17")];
                    case 1:
                        p2pAddress = _a.sent();
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_PNFT_ABI, this.signer);
                        p2pData = p2pContract.interface.functions.deal.encode([
                            offerId,
                            buyAmount
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValuePNFT.encode([
                            buyToken,
                            tokenId,
                            buyAmount,
                            p2pAddress,
                            p2pData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_22 = _a.sent();
                        console.error(error_22);
                        throw new Error(error_22);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /******** AUCTIONS */
    // WHEN AUCTION TOKEN IS ERC223 OR COLLECTABLE
    SmartID.prototype.deployAuction = function (auction) {
        return __awaiter(this, void 0, void 0, function () {
            var auctionFactoryAddress, auctionFactory, deployAuctionData, walletContract, walletData, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress("20")];
                    case 1:
                        auctionFactoryAddress = _a.sent();
                        auctionFactory = this.contractsService.getContractSigner(auctionFactoryAddress, Constants.AUCTION_FACTORY_ABI, this.signer);
                        deployAuctionData = auctionFactory.interface.functions.deployAuction.encode([
                            auction.auditor,
                            auction.tokens,
                            auction.auctionAmountOrId,
                            auction.auctionTokenId,
                            auction.settings
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            auction.tokens[0],
                            auction.auctionAmountOrId,
                            auctionFactoryAddress,
                            deployAuctionData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_23 = _a.sent();
                        console.error(error_23);
                        throw new Error(error_23);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // WHEN AUCTION TOKEN IS PACKABLE
    SmartID.prototype.deployAuctionPackable = function (auction) {
        return __awaiter(this, void 0, void 0, function () {
            var auctionFactoryAddress, auctionFactory, deployAuctionData, walletContract, walletData, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress("20")];
                    case 1:
                        auctionFactoryAddress = _a.sent();
                        auctionFactory = this.contractsService.getContractSigner(auctionFactoryAddress, Constants.AUCTION_FACTORY_ABI, this.signer);
                        deployAuctionData = auctionFactory.interface.functions.deployAuction.encode([
                            auction.auditor,
                            auction.tokens,
                            auction.auctionAmountOrId,
                            auction.auctionTokenId,
                            auction.settings
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValuePNFT.encode([
                            auction.tokens[0],
                            auction.auctionTokenId,
                            auction.auctionAmountOrId,
                            auctionFactoryAddress,
                            deployAuctionData
                        ]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_24 = _a.sent();
                        console.error(error_24);
                        throw new Error(error_24);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.bid = function (auctionAddress, bidToken, bid, minValue) {
        return __awaiter(this, void 0, void 0, function () {
            var auctionContract, bidData, walletContract, walletData, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auctionContract = this.contractsService.getContractSigner(auctionAddress, Constants.AUCTION_ABI, this.signer);
                        bidData = auctionContract.interface.functions.bid.encode([
                            bid
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            bidToken,
                            minValue,
                            auctionAddress,
                            bidData
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_25 = _a.sent();
                        console.error(error_25);
                        throw new Error(error_25);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.updateBid = function (auctionAddress, bid) {
        return __awaiter(this, void 0, void 0, function () {
            var auctionContract, bidData, walletContract, walletData, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auctionContract = this.contractsService.getContractSigner(auctionAddress, Constants.AUCTION_ABI, this.signer);
                        bidData = auctionContract.interface.functions.updateBid.encode([
                            bid
                        ]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            auctionAddress,
                            bidData
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_26 = _a.sent();
                        console.error(error_26);
                        throw new Error(error_26);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.cancelBid = function (auctionAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var auctionContract, bidData, walletContract, walletData, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auctionContract = this.contractsService.getContractSigner(auctionAddress, Constants.AUCTION_ABI, this.signer);
                        bidData = auctionContract.interface.functions.cancelBid.encode([]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forward.encode([
                            auctionAddress,
                            bidData
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_27 = _a.sent();
                        console.error(error_27);
                        throw new Error(error_27);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartID.prototype.payDeal = function (auctionAddress, bidToken, amountLeft) {
        return __awaiter(this, void 0, void 0, function () {
            var auctionContract, bidData, walletContract, walletData, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auctionContract = this.contractsService.getContractSigner(auctionAddress, Constants.AUCTION_ABI, this.signer);
                        bidData = auctionContract.interface.functions.payDeal.encode([]);
                        walletContract = this.contractsService.getContractSigner(this.wallet, Constants.WALLET_ABI, this.signer);
                        walletData = walletContract.interface.functions.forwardValue.encode([
                            bidToken,
                            amountLeft,
                            auctionAddress,
                            bidData
                        ]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.forward(this.wallet, walletData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_28 = _a.sent();
                        console.error(error_28);
                        throw new Error(error_28);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SmartID;
}());
exports.SmartID = SmartID;
var SmartIDLogin = /** @class */ (function () {
    function SmartIDLogin(_url) {
        if (_url === void 0) { _url = 'mainnet'; }
        this.network = _url;
        this.walletsService = new wallets_1.Wallets(this.network);
    }
    SmartIDLogin.prototype.login = function (password, encryptedWallet) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletsService.createWalletFromEncryptedJson(encryptedWallet, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SmartIDLogin.prototype.firstLogin = function (nickname, encryptedWallet, password) {
        return __awaiter(this, void 0, void 0, function () {
            var signer, digitalIdentity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.login(password, encryptedWallet)];
                    case 1:
                        signer = _a.sent();
                        return [4 /*yield*/, this.getDigitalIdentity(nickname)];
                    case 2:
                        digitalIdentity = _a.sent();
                        digitalIdentity.setSigner(signer);
                        return [2 /*return*/, digitalIdentity];
                }
            });
        });
    };
    SmartIDLogin.prototype.getDigitalIdentity = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, identity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nicknameToWallet(nickname)];
                    case 1:
                        wallet = _a.sent();
                        return [4 /*yield*/, this.getIdentityByWallet(wallet)];
                    case 2:
                        identity = _a.sent();
                        return [2 /*return*/, new SmartIDPublic(nickname, identity, wallet)];
                }
            });
        });
    };
    /***** QUERY */
    SmartIDLogin.prototype.walletToNickname = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallet(id: "' + address + '"){ name { id } } }';
                        query = new graph_1.Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallet.name.id];
                    case 3:
                        error_29 = _a.sent();
                        console.error(error_29);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.nicknameToWallet = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
                        query = new graph_1.Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets[0].id];
                    case 3:
                        error_30 = _a.sent();
                        console.error(error_30);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.isNameAvailable = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
                        query = new graph_1.Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets.length == 0];
                    case 3:
                        error_31 = _a.sent();
                        console.error(error_31);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.isDataHashAvailable = function (dataHash) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id } }';
                        query = new graph_1.Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.identities.length == 0];
                    case 3:
                        error_32 = _a.sent();
                        console.error(error_32);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.getIdentityByName = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var address, response, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.nicknameToWallet(nickname)];
                    case 1:
                        address = _a.sent();
                        return [4 /*yield*/, this.getIdentityByWallet(address)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 3:
                        error_33 = _a.sent();
                        console.error(error_33);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.getIdentityByWallet = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities(where: { wallet: "' + address + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
                        query = new graph_1.Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.identities[0].id];
                    case 3:
                        error_34 = _a.sent();
                        console.error(error_34);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.getIdentityByDataHash = function (dataHash) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
                        query = new graph_1.Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.identities[0].id];
                    case 3:
                        error_35 = _a.sent();
                        console.error(error_35);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SmartIDLogin;
}());
exports.SmartIDLogin = SmartIDLogin;
var SmartIDRegistry = /** @class */ (function () {
    function SmartIDRegistry(_url) {
        if (_url === void 0) { _url = 'mainnet'; }
        this.network = _url;
        this.walletsService = new wallets_1.Wallets(this.network);
        this.contractsService = new contracts_1.Contracts(this.network);
        this.transactionsService = new transactions_1.Transactions();
    }
    SmartIDRegistry.prototype.createWalletPair = function (entropy, password) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, owner, onlyOwner, scryptOptions, encryptedOwner, recovery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wallet = this.walletsService.createWalletFromEntropy(entropy);
                        owner = this.walletsService.createWalletFromMnemonic(wallet.mnemonic, Constants.PATH_0);
                        onlyOwner = this.walletsService.createWalletFromPrivKey(owner.privateKey);
                        scryptOptions = { scrypt: { N: 64 } };
                        return [4 /*yield*/, onlyOwner.encrypt(password, scryptOptions)];
                    case 1:
                        encryptedOwner = _a.sent();
                        recovery = this.walletsService.createWalletFromMnemonic(wallet.mnemonic, Constants.PATH_1);
                        return [2 /*return*/, new wallets_1.WalletPair(owner.address, recovery.address, wallet.mnemonic, encryptedOwner)];
                }
            });
        });
    };
    SmartIDRegistry.prototype.deployIdentity = function (owner, recovery, dataHash, nickname, signerPrivateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var controllerContract, identityFactoryAddress, signer, identityFactory, response, error_36, receipt, event_3, i, topics, data, _log, receiptError_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controllerContract = this.contractsService.getContractCaller(Constants.CONTROLLER_ADDRESS, Constants.CONTROLLER_ABI);
                        return [4 /*yield*/, controllerContract.addresses("2")];
                    case 1:
                        identityFactoryAddress = _a.sent();
                        signer = this.walletsService.createWalletFromPrivKey(signerPrivateKey);
                        identityFactory = this.contractsService.getContractSigner(identityFactoryAddress, Constants.IDENTITY_FACTORY_ABI, signer);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, identityFactory.deployIdentity(owner, recovery, dataHash, nickname, Constants.OVERRIDES_BACKEND)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_36 = _a.sent();
                        console.error(error_36);
                        throw new Error(error_36);
                    case 5:
                        _a.trys.push([5, 11, , 12]);
                        return [4 /*yield*/, this.transactionsService.getReceipt(response)];
                    case 6:
                        receipt = _a.sent();
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < receipt.logs.length)) return [3 /*break*/, 10];
                        if (!(receipt.logs[i].address.toLowerCase() == identityFactoryAddress.toLowerCase())) return [3 /*break*/, 9];
                        topics = receipt.logs[i].topics;
                        data = receipt.logs[i].data;
                        _log = { topics: topics, data: data };
                        return [4 /*yield*/, this.contractsService.decodeEvent(identityFactory, _log)];
                    case 8:
                        event_3 = _a.sent();
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10:
                        if (event_3 != undefined) {
                            return [2 /*return*/, event_3.wallet];
                        }
                        else {
                            return [2 /*return*/, receipt];
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        receiptError_2 = _a.sent();
                        console.error(receiptError_2);
                        throw new Error(receiptError_2);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDRegistry.prototype.setNewIdentityDD = function (identity, dataHashDD, signerPrivateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var controllerContract, registryAddress, signer, identityFactory, response, error_37, receipt, receiptError_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controllerContract = this.contractsService.getContractCaller(Constants.CONTROLLER_ADDRESS, Constants.CONTROLLER_ABI);
                        return [4 /*yield*/, controllerContract.addresses("1")];
                    case 1:
                        registryAddress = _a.sent();
                        signer = this.walletsService.createWalletFromPrivKey(signerPrivateKey);
                        identityFactory = this.contractsService.getContractSigner(registryAddress, Constants.REGISTRY_ABI, signer);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, identityFactory.setNewIdentityDD(identity, dataHashDD, Constants.OVERRIDES_BACKEND)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_37 = _a.sent();
                        console.error(error_37);
                        throw new Error(error_37);
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.transactionsService.getReceipt(response)];
                    case 6:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                    case 7:
                        receiptError_3 = _a.sent();
                        console.error(receiptError_3);
                        throw new Error(receiptError_3);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDRegistry.prototype.updateReputation = function (user, reputation, signerPrivateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var p2pAddress, signer, p2pContract, response, error_38, receipt, receiptError_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contractsService.getControllerAddress("16")];
                    case 1:
                        p2pAddress = _a.sent();
                        signer = this.walletsService.createWalletFromPrivKey(signerPrivateKey);
                        p2pContract = this.contractsService.getContractSigner(p2pAddress, Constants.P2P_ABI, signer);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, p2pContract.updateReputation(user, reputation, Constants.OVERRIDES_BACKEND)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_38 = _a.sent();
                        console.error(error_38);
                        throw new Error(error_38);
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.transactionsService.getReceipt(response)];
                    case 6:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                    case 7:
                        receiptError_4 = _a.sent();
                        console.error(receiptError_4);
                        throw new Error(receiptError_4);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return SmartIDRegistry;
}());
exports.SmartIDRegistry = SmartIDRegistry;
var SmartIDPublic = /** @class */ (function () {
    function SmartIDPublic(nickname, identity, wallet, signer) {
        this.nickname = nickname;
        this.identity = identity;
        this.wallet = wallet;
        this.signer = signer;
    }
    SmartIDPublic.prototype.setSigner = function (signer) {
        this.signer = signer;
    };
    return SmartIDPublic;
}());
exports.SmartIDPublic = SmartIDPublic;
var TransferRequest = /** @class */ (function () {
    function TransferRequest(tokenAddress, destination, //address or nickname
    amount, data, kind, packableId) {
        this.tokenAddress = tokenAddress;
        this.destination = destination;
        this.amount = amount;
        this.data = data;
        this.kind = kind;
        if (packableId != undefined) {
            this.packableId = packableId;
        }
    }
    return TransferRequest;
}());
exports.TransferRequest = TransferRequest;
var TransferNFTRequest = /** @class */ (function () {
    function TransferNFTRequest(tokenAddress, destination, //address or nickname
    reference, data, kind) {
        this.tokenAddress = tokenAddress;
        this.destination = destination;
        this.reference = reference;
        this.data = data;
        this.kind = kind;
    }
    return TransferNFTRequest;
}());
exports.TransferNFTRequest = TransferNFTRequest;
var P2POffer = /** @class */ (function () {
    function P2POffer(sellToken, sellAmount, isPartial, buyToken, buyAmount, isBuyFiat, minDealAmount, maxDealAmount, minReputation, auditor, description, country, payMethods) {
        this.tokens = [];
        this.amounts = [];
        this.settings = [];
        this.limits = [];
        this.metadata = [];
        this.tokens.push(sellToken);
        this.tokens.push(buyToken);
        this.amounts.push(sellAmount);
        this.amounts.push(buyAmount);
        this.settings.push(isPartial);
        this.settings.push(isBuyFiat);
        this.limits.push(minDealAmount);
        this.limits.push(maxDealAmount);
        this.limits.push(minReputation);
        this.auditor = auditor;
        this.description = description;
        var zero = [0];
        var metadata = country.concat(zero).concat(payMethods).concat(zero);
        this.metadata = metadata;
    }
    return P2POffer;
}());
exports.P2POffer = P2POffer;
var P2POfferCommodity = /** @class */ (function () {
    function P2POfferCommodity(sellToken, sellId, buyToken, buyAmount, isBuyFiat, minReputation, auditor, description, country, payMethods) {
        this.metadata = [];
        this.sellToken = sellToken;
        this.sellId = sellId;
        this.buyToken = buyToken;
        this.buyAmount = buyAmount;
        this.isBuyFiat = isBuyFiat;
        this.minReputation = minReputation;
        this.auditor = auditor;
        this.description = description;
        var zero = [0];
        var metadata = country.concat(zero).concat(payMethods).concat(zero);
        this.metadata = metadata;
    }
    return P2POfferCommodity;
}());
exports.P2POfferCommodity = P2POfferCommodity;
var P2POfferPackable = /** @class */ (function () {
    function P2POfferPackable(sellToken, sellAmount, tokenId, isPartial, buyToken, buyAmount, isBuyFiat, minDealAmount, maxDealAmount, minReputation, auditor, description, country, payMethods) {
        this.tokens = [];
        this.amounts = [];
        this.settings = [];
        this.limits = [];
        this.metadata = [];
        this.tokens.push(sellToken);
        this.tokens.push(buyToken);
        this.amounts.push(sellAmount);
        this.amounts.push(buyAmount);
        this.tokenId = tokenId;
        this.settings.push(isPartial);
        this.settings.push(isBuyFiat);
        this.limits.push(minDealAmount);
        this.limits.push(maxDealAmount);
        this.limits.push(minReputation);
        this.auditor = auditor;
        this.description = description;
        var zero = [0];
        var metadata = country.concat(zero).concat(payMethods).concat(zero);
        this.metadata = metadata;
    }
    return P2POfferPackable;
}());
exports.P2POfferPackable = P2POfferPackable;
var AuctionParams = /** @class */ (function () {
    function AuctionParams(auditor, auctionToken, bidToken, auctionAmountOrId, minValue, endTime, auctionTokenId) {
        this.auditor = auditor;
        this.tokens = [];
        this.tokens.push(auctionToken);
        this.tokens.push(bidToken);
        this.auctionAmountOrId = auctionAmountOrId;
        this.settings = [];
        this.settings.push(minValue);
        this.settings.push(endTime);
        if (auctionTokenId == undefined) {
            this.auctionTokenId = ethers_1.ethers.constants.HashZero;
        }
        else {
            this.auctionTokenId = auctionTokenId;
        }
    }
    return AuctionParams;
}());
exports.AuctionParams = AuctionParams;
