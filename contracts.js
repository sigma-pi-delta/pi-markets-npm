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
exports.Contracts = void 0;
var ethers_1 = require("ethers");
var blockchain_1 = require("./blockchain");
var Constants = require("./constants");
var Contracts = /** @class */ (function () {
    function Contracts(_url) {
        if (_url === void 0) { _url = 'mainnet'; }
        this.blockchain = new blockchain_1.Blockchain(_url);
        this.provider = this.blockchain.getProvider();
        if (_url == 'mainnet') {
            this.controller = Constants.CONTROLLER_ADDRESS;
        }
        else if (_url == 'testnet') {
            this.controller = Constants.CONTROLLER_ADDRESS_TESTNET;
        }
    }
    Contracts.prototype.getContractCaller = function (_address, _abi) {
        return new ethers_1.ethers.Contract(_address, _abi, this.provider);
    };
    Contracts.prototype.getContractSigner = function (_address, _abi, _wallet) {
        _wallet = _wallet.connect(this.provider);
        return this.getContractCaller(_address, _abi).connect(_wallet);
    };
    Contracts.prototype.getPastEvents = function (_contract, _filter, _fromBlock, _toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var logsFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logsFilter = {
                            address: _contract.address,
                            fromBlock: _fromBlock,
                            toBlock: _toBlock,
                            topics: _filter.topics
                        };
                        return [4 /*yield*/, this.provider.getLogs(logsFilter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Contracts.prototype.decodeEvent = function (_contract, _log) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _contract.interface.parseLog(_log).values];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Contracts.prototype.getControllerAddress = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var controllerContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controllerContract = this.getContractCaller(this.controller, Constants.CONTROLLER_ABI);
                        return [4 /*yield*/, controllerContract.addresses(index)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Contracts;
}());
exports.Contracts = Contracts;
