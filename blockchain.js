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
exports.Blockchain = void 0;
var ethers_1 = require("ethers");
var Constants = require("./constants");
var Blockchain = /** @class */ (function () {
    function Blockchain(_url) {
        if (_url === void 0) { _url = 'mainnet'; }
        if (_url == 'mainnet') {
            this.url = Constants.RPC_URL;
            this.name = _url;
        }
        else if (_url == 'testnet') {
            this.url = Constants.RPC_URL_TESTNET;
            this.name = _url;
        }
        else {
            this.url = _url;
            this.name = 'custom';
        }
    }
    Blockchain.prototype.getProvider = function () {
        return new ethers_1.ethers.providers.JsonRpcProvider(this.url);
    };
    Blockchain.prototype.getNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getNetwork()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getCode = function (_address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getCode(_address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getStorageAt = function (_address, _position) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getStorageAt(_address, _position)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getBlockNumber()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getBlock = function (_blockHashOrBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getBlock(_blockHashOrBlockNumber)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getTransaction = function (_txHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getTransaction(_txHash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getTransactionReceipt = function (_txHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getTransactionReceipt(_txHash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getBalance = function (_address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getBalance(_address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Blockchain.prototype.getNonce = function (_address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProvider().getTransactionCount(_address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
