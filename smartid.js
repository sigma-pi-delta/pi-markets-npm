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
exports.SmartIDObject = exports.SmartIDRegistry = exports.SmartIDLogin = exports.SmartID = void 0;
var Constants = require("./constants");
var contracts_1 = require("./contracts");
var wallets_1 = require("./wallets");
var transactions_1 = require("./transactions");
var graph_1 = require("./graph");
var SmartID = /** @class */ (function () {
    function SmartID() {
    }
    return SmartID;
}());
exports.SmartID = SmartID;
var SmartIDLogin = /** @class */ (function () {
    function SmartIDLogin(_url) {
        if (_url === void 0) { _url = 'mainnet'; }
        this.network = _url;
        this.walletsService = new wallets_1.Wallets(this.network);
        this.graph = new graph_1.Graph();
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
                        return [2 /*return*/, new SmartIDObject(nickname, identity, wallet)];
                }
            });
        });
    };
    /***** QUERY */
    SmartIDLogin.prototype.walletToNickname = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallet(id: "' + address + '"){ name { id } } }';
                        query = new graph_1.Query('bank');
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.graph.querySubgraph(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallet.name.id];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.nicknameToWallet = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
                        query = new graph_1.Query('bank');
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.graph.querySubgraph(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets[0].id];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.isNameAvailable = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
                        query = new graph_1.Query('bank');
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.graph.querySubgraph(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets.length == 0];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.isDataHashAvailable = function (dataHash) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id } }';
                        query = new graph_1.Query('bank');
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.graph.querySubgraph(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.identities.length == 0];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.getIdentityByName = function (nickname) {
        return __awaiter(this, void 0, void 0, function () {
            var address, response, error_5;
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
                        error_5 = _a.sent();
                        console.error(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.getIdentityByWallet = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities(where: { wallet: "' + address + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
                        query = new graph_1.Query('bank');
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.graph.querySubgraph(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.identities[0].id];
                    case 3:
                        error_6 = _a.sent();
                        console.error(error_6);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDLogin.prototype.getIdentityByDataHash = function (dataHash) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
                        query = new graph_1.Query('bank');
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.graph.querySubgraph(query)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.identities[0].id];
                    case 3:
                        error_7 = _a.sent();
                        console.error(error_7);
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
            var controllerContract, identityFactoryAddress, signer, identityFactory, response, error_8, receipt, event_1, i, topics, data, _log, receiptError_1;
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
                        error_8 = _a.sent();
                        console.error(error_8);
                        throw new Error(error_8);
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
                        event_1 = _a.sent();
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10:
                        if (event_1 != undefined) {
                            return [2 /*return*/, event_1.wallet];
                        }
                        else {
                            return [2 /*return*/, receipt];
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        receiptError_1 = _a.sent();
                        console.error(receiptError_1);
                        throw new Error(receiptError_1);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SmartIDRegistry.prototype.setNewIdentityDD = function (identity, dataHashDD, signerPrivateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var controllerContract, registryAddress, signer, identityFactory, response, error_9, receipt, receiptError_2;
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
                        error_9 = _a.sent();
                        console.error(error_9);
                        throw new Error(error_9);
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.transactionsService.getReceipt(response)];
                    case 6:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                    case 7:
                        receiptError_2 = _a.sent();
                        console.error(receiptError_2);
                        throw new Error(receiptError_2);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return SmartIDRegistry;
}());
exports.SmartIDRegistry = SmartIDRegistry;
var SmartIDObject = /** @class */ (function () {
    function SmartIDObject(nickname, identity, wallet, signer) {
        this.nickname = nickname;
        this.identity = identity;
        this.wallet = wallet;
        this.signer = signer;
    }
    SmartIDObject.prototype.setSigner = function (signer) {
        this.signer = signer;
    };
    return SmartIDObject;
}());
exports.SmartIDObject = SmartIDObject;
