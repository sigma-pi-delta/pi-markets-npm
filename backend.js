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
exports.Backend = void 0;
var contracts_1 = require("./contracts");
var Constants = require("./constants");
var wallets_1 = require("./wallets");
var Backend = /** @class */ (function () {
    function Backend(_signer, _network) {
        if (_network === void 0) { _network = 'mainnet'; }
        this.signer = _signer;
        this.network = _network;
        this.contractsService = new contracts_1.Contracts(this.network);
        this.walletsService = new wallets_1.Wallets(this.network);
        if (this.network == 'mainnet') {
            this.controllerAddress = Constants.CONTROLLER_ADDRESS;
        }
        else if (this.network == 'testnet') {
            this.controllerAddress = Constants.CONTROLLER_ADDRESS_TESTNET;
        }
    }
    Backend.prototype.dealOrderTokenDex = function (orderA, orderB, side, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dealOrder(orderA, orderB, side, nonce, "30")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Backend.prototype.dealOrderPackableDex = function (orderA, orderB, side, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dealOrder(orderA, orderB, side, nonce, "31")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Backend.prototype.dealOrder = function (orderA, orderB, side, nonce, contractIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var controllerContract, dexAddress, dex, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controllerContract = this.contractsService.getContractCaller(this.controllerAddress, Constants.CONTROLLER_ABI);
                        return [4 /*yield*/, controllerContract.addresses(contractIndex)];
                    case 1:
                        dexAddress = _a.sent();
                        dex = this.contractsService.getContractSigner(dexAddress, Constants.DEX_ABI, this.signer);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, dex.dealOrder(orderA, orderB, side, { gasPrice: 0, gasLimit: 3000000, nonce: nonce })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 4:
                        error_3 = _a.sent();
                        console.error(error_3);
                        throw new Error(error_3);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Backend;
}());
exports.Backend = Backend;
