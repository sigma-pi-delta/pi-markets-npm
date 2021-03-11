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
exports.QueryTemplates = exports.Query = exports.Graph = void 0;
var Constants = require("./constants");
var node_fetch_1 = require("node-fetch");
var Utils = require("./utils");
var Graph = /** @class */ (function () {
    function Graph() {
    }
    Graph.prototype.querySubgraph = function (_query) {
        return __awaiter(this, void 0, void 0, function () {
            var response, responseData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, node_fetch_1["default"](_query.url + _query.subgraph, {
                                "method": 'POST',
                                "headers": {
                                    "Accept": 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                "body": JSON.stringify({
                                    query: _query.query
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseData = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, responseData.data];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Graph;
}());
exports.Graph = Graph;
var Query = /** @class */ (function () {
    function Query(subgraph, url) {
        if (url === void 0) { url = 'mainnet'; }
        this.query = '{ <entity> ( where:{ <filter> } first: 1000 skip: 0 <order> ) { <property> }}';
        this.first = 1000;
        this.skip = 0;
        this.isClean = false;
        if (url == 'mainnet') {
            this.url = Constants.GRAPH_URL;
            if (subgraph == 'bank') {
                this.subgraph = Constants.BANK_SUBGRAPH;
            }
            else if (subgraph == 'p2p') {
                this.subgraph = Constants.P2P_SUBGRAPH;
            }
            else if (subgraph == 'p2p-primary') {
                this.subgraph = Constants.P2P_PRIMARY_SUBGRAPH;
            }
            else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH;
            }
            else if (subgraph == 'auction') {
                this.subgraph = Constants.AUCTION_SUBGRAPH;
            }
            else if (subgraph == 'piprice') {
                this.subgraph = Constants.PIPRICE_SUBGRAPH;
            }
            else if (subgraph == 'dividend') {
                this.subgraph = Constants.DIVIDENDS_SUBGRAPH;
            }
            else if (subgraph == 'dex') {
                this.subgraph = Constants.DEX_SUBGRAPH;
            }
            else if (subgraph == 'dex-bicentenario') {
                this.subgraph = Constants.DEX_BICENTENARIO_SUBGRAPH;
            }
            else if (subgraph == 'registry') {
                this.subgraph = Constants.REGISTRY_SUBGRAPH;
            }
            else {
                this.subgraph = subgraph;
            }
        }
        else if (url == 'testnet') {
            this.url = Constants.GRAPH_URL_TESTNET;
            if (subgraph == 'bank') {
                this.subgraph = Constants.BANK_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'p2p') {
                this.subgraph = Constants.P2P_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'p2p-primary') {
                this.subgraph = Constants.P2P_PRIMARY_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'auction') {
                this.subgraph = Constants.AUCTION_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'piprice') {
                this.subgraph = Constants.PIPRICE_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'dividend') {
                this.subgraph = Constants.DIVIDENDS_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'dex') {
                this.subgraph = Constants.DEX_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'dex-bicentenario') {
                this.subgraph = Constants.DEX_BICENTENARIO_SUBGRAPH_TESTNET;
            }
            else if (subgraph == 'registry') {
                this.subgraph = Constants.REGISTRY_SUBGRAPH_TESTNET;
            }
            else {
                this.subgraph = subgraph;
            }
        }
        else {
            this.url = url;
            this.subgraph = subgraph;
        }
    }
    Query.prototype.buildRequest = function (entity, filter, pagination, order, props) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.build(entity, filter, pagination, order, props);
                        return [4 /*yield*/, this.request()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Query.prototype.build = function (entity, filter, pagination, order, props) {
        //TODO: validar todo
        this.setEntity(entity);
        this.setFilter(filter);
        this.setPagination(pagination[0], pagination[1]);
        if (order[1] == 'asc') {
            this.setOrder(order[0], 'asc');
        }
        else if (order[1] == 'desc') {
            this.setOrder(order[0], 'desc');
        }
        for (var i = 0; i < props[0].length; i++) {
            this.setProperty(props[0][i]);
        }
        for (var j = 1; j < props.length; j++) {
            for (var k = 1; k < props[j].length; k++) {
                this.setSubproperty(props[j][0], props[j][k]);
            }
        }
        this.clean();
    };
    Query.prototype.request = function () {
        return __awaiter(this, void 0, void 0, function () {
            var graph, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        graph = new Graph();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, graph.querySubgraph(this)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        throw new Error(error_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Query.prototype.setCustomQuery = function (query) {
        this.query = query;
    };
    Query.prototype.setEntity = function (entity) {
        if (!this.isClean) {
            var newQuery = this.query.replace("<entity>", entity);
            this.query = newQuery;
        }
        else {
            throw new Error('Query is built and clean, create a new one');
        }
    };
    Query.prototype.setPagination = function (first, skip) {
        var searchString = 'first: ' + this.first + ' skip: ' + this.skip;
        var pagination = 'first: ' + first + ' skip: ' + skip;
        var newQuery = this.query.replace(searchString, pagination);
        this.query = newQuery;
        this.first = first;
        this.skip = skip;
    };
    Query.prototype.setOrder = function (orderBy, orderDirection) {
        if (!this.isClean) {
            var order = 'orderBy: ' + orderBy + ' orderDirection: ' + orderDirection;
            var newQuery = this.query.replace("<order>", order);
            this.query = newQuery;
        }
        else {
            throw new Error('Query is built and clean, create a new one');
        }
    };
    Query.prototype.setProperty = function (property) {
        if (!this.isClean) {
            var newProperty = property + ' { <subproperty> } <property>';
            var newQuery = this.query.replace("<property>", newProperty);
            this.query = newQuery;
        }
        else {
            throw new Error('Query is built and clean, create a new one');
        }
    };
    Query.prototype.setSubproperty = function (property, subproperty) {
        if (!this.isClean) {
            var searchString = property + ' { <subproperty> ';
            var replaceString = void 0;
            if (this.query.indexOf(searchString) == -1) {
                if (this.query.indexOf(property) !== -1) {
                    searchString = property;
                }
            }
            replaceString = searchString + subproperty + ' { <subproperty> } ';
            var newQuery = this.query.replace(searchString, replaceString);
            this.query = newQuery;
        }
        else {
            throw new Error('Query is built and clean, create a new one');
        }
    };
    Query.prototype.setFilter = function (filter) {
        if (!this.isClean) {
            var searchString = 'where: { <filter> ';
            var replaceString = searchString + filter;
            var newQuery = this.query.replace(searchString, replaceString);
            this.query = newQuery;
        }
        else {
            throw new Error('Query is built and clean, create a new one');
        }
    };
    Query.prototype.clean = function () {
        var regexp1 = /<property>/gi;
        var regexp2 = /<subproperty>/gi;
        var regexp3 = /<order>/gi;
        var regexp4 = /<filter>/gi;
        var regexp5 = /where:{ }/gi;
        var regexp6 = /{ }/gi;
        var empty = "";
        var noProperty = this.query.replace(regexp1, empty);
        var noSubproperty = noProperty.replace(regexp2, empty);
        var noOrder = noSubproperty.replace(regexp3, empty);
        var noFilter = noOrder.replace(regexp4, empty);
        var noSpaces = noFilter.replace(/ +(?= )/g, '');
        var noEmptyWhere = noSpaces.replace(regexp5, empty);
        var noEmptyBraces = noEmptyWhere.replace(regexp6, empty);
        var noDuplicateSpaces = noEmptyBraces.replace(/ +(?= )/g, '');
        this.query = noDuplicateSpaces;
        this.isClean = true;
    };
    return Query;
}());
exports.Query = Query;
var QueryTemplates = /** @class */ (function () {
    function QueryTemplates(network) {
        if (network === void 0) { network = 'mainnet'; }
        this.network = network;
    }
    /******** BANK */
    QueryTemplates.prototype.getWalletByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { id } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.id];
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        throw new Error(error_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getNameByWallet = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ wallet(id:"' + name.toLowerCase() + '") { name { id } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.wallet.name.id];
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4);
                        throw new Error(error_4);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getAddressesByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { id identity { id owner } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if ((response != undefined) && (response.name != null)) {
                            return [2 /*return*/, [response.name.wallet.id, response.name.wallet.identity.id, response.name.wallet.identity.owner]];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error(error_5);
                        throw new Error(error_5);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getOwnerByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { identity { owner } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.identity.owner];
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error(error_6);
                        throw new Error(error_6);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getSmartIDs = function (skip) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ identities (first:1000, skip: ' + skip + ', orderBy:timestamp, orderDirection:asc) { identity hashDD } }';
                        query = new Query('registry', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.identities];
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.error(error_7);
                        throw new Error(error_7);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getNamesByIdentityArray = function (identitiesArray, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var stringArray, customQuery, query, response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stringArray = identitiesArray.join('", "');
                        customQuery = '{ identities(first: 1000, skip: ' + skip + ' where:{id_in:["' + stringArray + '"]}) {id wallet { id name { id } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.identities];
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error(error_8);
                        throw new Error(error_8);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsByName = function (name, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { transactions (orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.transactions];
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _a.sent();
                        console.error(error_9);
                        throw new Error(error_9);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsByNameByTokens = function (name, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{currency: ' + token + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.transactions];
                        return [3 /*break*/, 4];
                    case 3:
                        error_10 = _a.sent();
                        console.error(error_10);
                        throw new Error(error_10);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsFromNameByTokens = function (name, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var from, customQuery, query, response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWalletByName(name)];
                    case 1:
                        from = _a.sent();
                        customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{from: ' + from + ', currency: ' + token + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, query.request()];
                    case 3:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.transactions];
                        return [3 /*break*/, 5];
                    case 4:
                        error_11 = _a.sent();
                        console.error(error_11);
                        throw new Error(error_11);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsToNameByTokens = function (name, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var to, customQuery, query, response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWalletByName(name)];
                    case 1:
                        to = _a.sent();
                        customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{to: ' + to + ', currency: ' + token + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, query.request()];
                    case 3:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.transactions];
                        return [3 /*break*/, 5];
                    case 4:
                        error_12 = _a.sent();
                        console.error(error_12);
                        throw new Error(error_12);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsFromNameToNameByTokens = function (nameFrom, nameTo, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var from, to, customQuery, query, response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWalletByName(nameFrom)];
                    case 1:
                        from = _a.sent();
                        return [4 /*yield*/, this.getWalletByName(nameTo)];
                    case 2:
                        to = _a.sent();
                        customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{from: ' + from + ', to: ' + to + ', currency: ' + token + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, query.request()];
                    case 4:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.transactions];
                        return [3 /*break*/, 6];
                    case 5:
                        error_13 = _a.sent();
                        console.error(error_13);
                        throw new Error(error_13);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getBalancesByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { balances { token { id tokenSymbol tokenKind } balance packables { balances { balance packableId { id } } } commodities { tokenId reference metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.balances];
                        return [3 /*break*/, 4];
                    case 3:
                        error_14 = _a.sent();
                        console.error(error_14);
                        throw new Error(error_14);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getBalancesByNameByTokens = function (name, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ name(id:"' + name + '") { wallet { balances (where:{token_in:' + tokensArray + '}) { token { id tokenSymbol tokenKind } balance packables { balances { balance packableId { id } } } commodities { tokenId reference metadata } } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.name.wallet.balances];
                        return [3 /*break*/, 4];
                    case 3:
                        error_15 = _a.sent();
                        console.error(error_15);
                        throw new Error(error_15);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTokens = function (tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ tokens (where:{id_in:' + tokensArray + '}) { id tokenSymbol tokenName tokenKind } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.tokens];
                        return [3 /*break*/, 4];
                    case 3:
                        error_16 = _a.sent();
                        console.error(error_16);
                        throw new Error(error_16);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsByTokens = function (orderBy, orderDirection, first, skip, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ transactions ( where:{currency_in:' + tokensArray + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.transactions];
                        return [3 /*break*/, 4];
                    case 3:
                        error_17 = _a.sent();
                        console.error(error_17);
                        throw new Error(error_17);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTokenHolders = function (orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ tokenBalances(where:{token:"' + token + '", balance_gt: 0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { token { id tokenSymbol } balance wallet { id name { id } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.tokenBalances];
                        return [3 /*break*/, 4];
                    case 3:
                        error_18 = _a.sent();
                        console.error(error_18);
                        throw new Error(error_18);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getNFTHolders = function (orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ tokenBalances(where:{token:"' + token + '", balance_gt: 0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { token { id tokenSymbol } balance commodities { tokenId reference metadata } wallet { id name { id } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.tokenBalances];
                        return [3 /*break*/, 4];
                    case 3:
                        error_19 = _a.sent();
                        console.error(error_19);
                        throw new Error(error_19);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getPackableHolders = function (tokenAddress, packableId, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenPackableId, customQuery, query, response, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenPackableId = tokenAddress + "-" + packableId;
                        customQuery = '{ packableBalances (where: {packableId:"' + tokenPackableId + '", balance_gt:0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { packableId { id } balance wallet { id name { id } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.packableBalances];
                        return [3 /*break*/, 4];
                    case 3:
                        error_20 = _a.sent();
                        console.error(error_20);
                        throw new Error(error_20);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** P2P */
    QueryTemplates.prototype.getOffers = function (filter, orderBy, orderDirection, first, skip, market) {
        if (market === void 0) { market = "p2p"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ offers(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation } sellToken { id tokenSymbol } initialSellAmount sellAmount buyToken { id tokenSymbol } sellAmount price isPartial isBuyFiat isSellFiat minDealAmount maxDealAmount minReputation isOpen auditor description country payMethod payAccount timestamp deals { id } } }';
                        query = new Query(market, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.offers];
                        return [3 /*break*/, 4];
                    case 3:
                        error_21 = _a.sent();
                        console.error(error_21);
                        throw new Error(error_21);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getPackableOffers = function (filter, orderBy, orderDirection, first, skip, market) {
        if (market === void 0) { market = "p2p"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ offerPackables(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation } sellToken { id tokenSymbol } initialSellAmount sellAmount sellId { tokenId metadata } buyToken { id tokenSymbol } sellAmount price price_per_unit isPartial isBuyFiat isSellFiat minDealAmount maxDealAmount minReputation isOpen auditor description country payMethod payAccount timestamp deals { id } } }';
                        query = new Query(market, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.offerPackables];
                        return [3 /*break*/, 4];
                    case 3:
                        error_22 = _a.sent();
                        console.error(error_22);
                        throw new Error(error_22);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getNFTOffers = function (filter, orderBy, orderDirection, first, skip, market) {
        if (market === void 0) { market = "p2p"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ offerCommodities(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation } sellToken { id tokenSymbol } sellId { tokenId metadata reference } buyToken { id tokenSymbol } price isBuyFiat minReputation isOpen auditor description country payMethod payAccount timestamp deals { id } } }';
                        query = new Query(market, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.offerCommodities];
                        return [3 /*break*/, 4];
                    case 3:
                        error_23 = _a.sent();
                        console.error(error_23);
                        throw new Error(error_23);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getDeals = function (filter, orderBy, orderDirection, first, skip, market) {
        if (market === void 0) { market = "p2p"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ deals(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id offer { id sellToken { id tokenSymbol } buyToken { id tokenSymbol } } seller { id name offchainReputation } buyer { id offchainReputation } sellAmount buyAmount sellerVote buyerVote auditorVote isPending isSuccess executor timestamp } }';
                        query = new Query(market, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.deals];
                        return [3 /*break*/, 4];
                    case 3:
                        error_24 = _a.sent();
                        console.error(error_24);
                        throw new Error(error_24);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getPackableDeals = function (filter, orderBy, orderDirection, first, skip, market) {
        if (market === void 0) { market = "p2p"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ dealPackables(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id offer { id sellToken { id tokenSymbol } buyToken { id tokenSymbol } sellId { tokenId metadata } } seller { id name offchainReputation } buyer { id offchainReputation } sellAmount buyAmount sellerVote buyerVote auditorVote isPending isSuccess executor timestamp } }';
                        query = new Query(market, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.dealPackables];
                        return [3 /*break*/, 4];
                    case 3:
                        error_25 = _a.sent();
                        console.error(error_25);
                        throw new Error(error_25);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getNFTDeals = function (filter, orderBy, orderDirection, first, skip, market) {
        if (market === void 0) { market = "p2p"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ dealCommodities(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id offer { id sellToken { id tokenSymbol } buyToken { id tokenSymbol } sellId { tokenId metadata reference } } seller { id name offchainReputation } buyer { id offchainReputation } buyAmount sellerVote buyerVote auditorVote isPending isSuccess executor timestamp } }';
                        query = new Query(market, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.dealPackables];
                        return [3 /*break*/, 4];
                    case 3:
                        error_26 = _a.sent();
                        console.error(error_26);
                        throw new Error(error_26);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** MARKET */
    QueryTemplates.prototype.getTransfersCommission = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ controllers { commission } }';
                        query = new Query('market', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.controllers[0].commission];
                        return [3 /*break*/, 4];
                    case 3:
                        error_27 = _a.sent();
                        console.error(error_27);
                        throw new Error(error_27);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** AUCTIONS */
    QueryTemplates.prototype.getAuctions = function (filter, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ auctions (where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } auctionToken { id tokenSymbol } auctionAmount auctionCollectable { tokenId metadata reference } auctionPackable { tokenId metadata } bidToken { id tokenSymbol } bidPrice minValue maxBid maxBidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } startTime endTime auditor category bids (orderBy:bid, orderDirection:desc) { bid bidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } bidEntity { isCancel } timestamp } isOpen isClose isDealPaid isDealCancelled isKillable isKilled } }';
                        query = new Query("auction", this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.auctions];
                        return [3 /*break*/, 4];
                    case 3:
                        error_28 = _a.sent();
                        console.error(error_28);
                        throw new Error(error_28);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getBids = function (filter, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ bids (where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { bid bidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } timestamp isCancel auctionToken { id tokenSymbol } bidToken { id tokenSymbol } auction { id owner { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } auctionToken { id tokenSymbol } auctionAmount auctionCollectable { tokenId metadata reference } auctionPackable { tokenId metadata } bidToken { id tokenSymbol } bidPrice minValue maxBid maxBidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } startTime endTime auditor category bids (orderBy:bid, orderDirection:desc) { bid bidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } bidEntity { isCancel } timestamp } isOpen isClose isDealPaid isDealCancelled isKillable isKilled } } }';
                        query = new Query("auction", this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.bids];
                        return [3 /*break*/, 4];
                    case 3:
                        error_29 = _a.sent();
                        console.error(error_29);
                        throw new Error(error_29);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getAuctionsUserStats = function (filter, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ users (where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } }';
                        query = new Query("auction", this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.users];
                        return [3 /*break*/, 4];
                    case 3:
                        error_30 = _a.sent();
                        console.error(error_30);
                        throw new Error(error_30);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getAuctionsCommission = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ factories { commission } }';
                        query = new Query("auction", this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, Utils.weiToEther(response.factories[0].commission)];
                        return [3 /*break*/, 4];
                    case 3:
                        error_31 = _a.sent();
                        console.error(error_31);
                        throw new Error(error_31);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** DEX */
    QueryTemplates.prototype.getOrdersSkip = function (skip, dex) {
        if (dex === void 0) { dex = "dex"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, queryOrders, orders, _skip, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
                        query = new Query(dex, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (!(response != undefined)) return [3 /*break*/, 6];
                        queryOrders = response.orders;
                        orders = queryOrders;
                        _skip = skip;
                        _a.label = 3;
                    case 3:
                        if (!(queryOrders.length >= 1000)) return [3 /*break*/, 5];
                        skip = orders.length + _skip;
                        customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
                        query.setCustomQuery(customQuery);
                        return [4 /*yield*/, query.request()];
                    case 4:
                        response = _a.sent();
                        if (response != undefined) {
                            queryOrders = response.orders;
                            orders = orders.concat(queryOrders);
                        }
                        else {
                            queryOrders = [];
                        }
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, orders];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_32 = _a.sent();
                        console.error(error_32);
                        throw new Error(error_32);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getOpenOrdersNotInArray = function (ordersArray, dex) {
        if (dex === void 0) { dex = "dex"; }
        return __awaiter(this, void 0, void 0, function () {
            var skip, stringArray, customQuery, query, response, queryOrders, orders, _skip, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = 0;
                        stringArray = ordersArray.join('", "');
                        customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true, id_not_in:["' + stringArray + '"]}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
                        query = new Query(dex, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (!(response != undefined)) return [3 /*break*/, 6];
                        queryOrders = response.orders;
                        orders = queryOrders;
                        _skip = skip;
                        _a.label = 3;
                    case 3:
                        if (!(queryOrders.length >= 1000)) return [3 /*break*/, 5];
                        skip = orders.length + _skip;
                        customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true, id_not_in:["' + stringArray + '"]}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
                        query.setCustomQuery(customQuery);
                        return [4 /*yield*/, query.request()];
                    case 4:
                        response = _a.sent();
                        if (response != undefined) {
                            queryOrders = response.orders;
                            orders = orders.concat(queryOrders);
                        }
                        else {
                            queryOrders = [];
                        }
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, orders];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_33 = _a.sent();
                        console.error(error_33);
                        throw new Error(error_33);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getCancelationsSkip = function (skip, dex) {
        if (dex === void 0) { dex = "dex"; }
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, queryOrders, orders, _skip, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ cancelations(first:1000, skip:' + skip + ', orderBy: blockNumber, orderDirection:asc) { id order { owner { id name } } timestamp blockNumber } }';
                        query = new Query(dex, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (!(response != undefined)) return [3 /*break*/, 6];
                        queryOrders = response.cancelations;
                        orders = queryOrders;
                        _skip = skip;
                        _a.label = 3;
                    case 3:
                        if (!(queryOrders.length >= 1000)) return [3 /*break*/, 5];
                        skip = orders.length + _skip;
                        customQuery = '{ cancelations(first:1000, skip:' + skip + ', orderBy: blockNumber, orderDirection:asc) { id order { owner { id name } } timestamp blockNumber } }';
                        query.setCustomQuery(customQuery);
                        return [4 /*yield*/, query.request()];
                    case 4:
                        response = _a.sent();
                        if (response != undefined) {
                            queryOrders = response.cancelations;
                            orders = orders.concat(queryOrders);
                        }
                        else {
                            queryOrders = [];
                        }
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, orders];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_34 = _a.sent();
                        console.error(error_34);
                        throw new Error(error_34);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getInstrumentOrderbook = function (token, baseToken, dex) {
        if (dex === void 0) { dex = "dex"; }
        return __awaiter(this, void 0, void 0, function () {
            var skip, array, stringArray, customQuery, query, response, queryOrders, orders, buyAmountByPrice, sellAmountByPrice, sellPrices, buyPrices, i, order, price, amount, error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = 0;
                        array = [];
                        array.push(token);
                        array.push(baseToken);
                        stringArray = array.join('", "');
                        customQuery = '{ orders(skip: ' + skip + ' where:{sellToken_in:["' + stringArray + '"], buyToken_in:["' + stringArray + '"], open:true}, first:1000, orderBy: price, orderDirection:asc) { amount side price buyToken {id} sellToken {id} } }';
                        query = new Query(dex, this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (!(response != undefined)) return [3 /*break*/, 6];
                        queryOrders = response.orders;
                        orders = queryOrders;
                        _a.label = 3;
                    case 3:
                        if (!(queryOrders.length >= 1000)) return [3 /*break*/, 5];
                        skip = orders.length;
                        customQuery = '{ orders(skip: ' + skip + ' where:{sellToken_in:["' + stringArray + '"], buyToken_in:["' + stringArray + '"], open:true}, first:1000, orderBy: price, orderDirection:asc) { amount side price buyToken {id} sellToken {id} } }';
                        query.setCustomQuery(customQuery);
                        return [4 /*yield*/, query.request()];
                    case 4:
                        response = _a.sent();
                        if (response != undefined) {
                            queryOrders = response.orders;
                            orders = orders.concat(queryOrders);
                        }
                        else {
                            queryOrders = [];
                        }
                        return [3 /*break*/, 3];
                    case 5:
                        buyAmountByPrice = {};
                        sellAmountByPrice = {};
                        sellPrices = [];
                        buyPrices = [];
                        for (i = 0; i < orders.length; i++) {
                            order = orders[i];
                            price = parseFloat(Utils.weiBNToEtherString(order.price));
                            amount = parseFloat(Utils.weiBNToEtherString(order.amount));
                            if ((order.side == 1) &&
                                (order.sellToken.id == baseToken) &&
                                (order.buyToken.id == token)) {
                                //SELL
                                if (!sellPrices.includes(price))
                                    sellPrices.push(price);
                                if (sellAmountByPrice[price] != undefined) {
                                    sellAmountByPrice[price] = sellAmountByPrice[price] + amount;
                                }
                                else {
                                    sellAmountByPrice[price] = amount;
                                }
                            }
                            else if ((order.side == 2) &&
                                (order.sellToken.id == token) &&
                                (order.buyToken.id == baseToken)) {
                                //BUY
                                if (!buyPrices.includes(price))
                                    buyPrices.push(price);
                                amount = amount / price;
                                if (buyAmountByPrice[price] != undefined) {
                                    buyAmountByPrice[price] = buyAmountByPrice[price] + amount;
                                }
                                else {
                                    buyAmountByPrice[price] = amount;
                                }
                            }
                        }
                        return [2 /*return*/, [sellAmountByPrice, buyAmountByPrice]];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_35 = _a.sent();
                        console.error(error_35);
                        throw new Error(error_35);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.isBicentenarioAllowed = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ user(id:"' + wallet.toLowerCase() + '") { allowed allowedPackable } }';
                        query = new Query('dex-bicentenario', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        if (response != undefined)
                            return [2 /*return*/, response.user];
                        return [3 /*break*/, 4];
                    case 3:
                        error_36 = _a.sent();
                        console.error(error_36);
                        throw new Error(error_36);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return QueryTemplates;
}());
exports.QueryTemplates = QueryTemplates;
