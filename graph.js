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
            else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH;
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
            else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH_TESTNET;
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
                        return [2 /*return*/, response.name.wallet.id];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        throw new Error(error_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getOwnerByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_4;
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
                        return [2 /*return*/, response.name.wallet.identity.owner];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4);
                        throw new Error(error_4);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsByName = function (name, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_5;
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
                        return [2 /*return*/, response.name.wallet.transactions];
                    case 3:
                        error_5 = _a.sent();
                        console.error(error_5);
                        throw new Error(error_5);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsByNameByTokens = function (name, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_6;
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
                        return [2 /*return*/, response.name.wallet.transactions];
                    case 3:
                        error_6 = _a.sent();
                        console.error(error_6);
                        throw new Error(error_6);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsFromNameByTokens = function (name, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var from, customQuery, query, response, error_7;
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
                        return [2 /*return*/, response.name.wallet.transactions];
                    case 4:
                        error_7 = _a.sent();
                        console.error(error_7);
                        throw new Error(error_7);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsToNameByTokens = function (name, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var to, customQuery, query, response, error_8;
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
                        return [2 /*return*/, response.name.wallet.transactions];
                    case 4:
                        error_8 = _a.sent();
                        console.error(error_8);
                        throw new Error(error_8);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsFromNameToNameByTokens = function (nameFrom, nameTo, orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var from, to, customQuery, query, response, error_9;
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
                        return [2 /*return*/, response.name.wallet.transactions];
                    case 5:
                        error_9 = _a.sent();
                        console.error(error_9);
                        throw new Error(error_9);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getBalancesByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_10;
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
                        return [2 /*return*/, response.wallet.balances];
                    case 3:
                        error_10 = _a.sent();
                        console.error(error_10);
                        throw new Error(error_10);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getBalancesByNameByTokens = function (name, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_11;
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
                        return [2 /*return*/, response.wallet.balances];
                    case 3:
                        error_11 = _a.sent();
                        console.error(error_11);
                        throw new Error(error_11);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTokens = function (tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_12;
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
                        return [2 /*return*/, response.tokens];
                    case 3:
                        error_12 = _a.sent();
                        console.error(error_12);
                        throw new Error(error_12);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTransactionsByTokens = function (orderBy, orderDirection, first, skip, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_13;
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
                        return [2 /*return*/, response.transactions];
                    case 3:
                        error_13 = _a.sent();
                        console.error(error_13);
                        throw new Error(error_13);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getTokenHolders = function (orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ tokenBalances(where:{token:' + token + ', balance_gt: 0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { token { id tokenSymbol } balance wallet { id name { id } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.tokenBalances];
                    case 3:
                        error_14 = _a.sent();
                        console.error(error_14);
                        throw new Error(error_14);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getNFTHolders = function (orderBy, orderDirection, first, skip, token) {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '{ tokenBalances(where:{token:' + token + ', balance_gt: 0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { token { id tokenSymbol } balance commodities { tokenId reference metadata } wallet { id name { id } } } }';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets[0].id];
                    case 3:
                        error_15 = _a.sent();
                        console.error(error_15);
                        throw new Error(error_15);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.getPackableHolders = function (tokenAddress, packableId, orderBy, orderDirection, first, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenPackableId, customQuery, query, response, error_16;
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
                        return [2 /*return*/, response.packableBalances];
                    case 3:
                        error_16 = _a.sent();
                        console.error(error_16);
                        throw new Error(error_16);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueryTemplates.prototype.name = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '';
                        query = new Query('bank', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets[0].id];
                    case 3:
                        error_17 = _a.sent();
                        console.error(error_17);
                        throw new Error(error_17);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** P2P */
    QueryTemplates.prototype.name2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '';
                        query = new Query('p2p', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets[0].id];
                    case 3:
                        error_18 = _a.sent();
                        console.error(error_18);
                        throw new Error(error_18);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /******** MARKET */
    QueryTemplates.prototype.name3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customQuery, query, response, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customQuery = '';
                        query = new Query('market', this.network);
                        query.setCustomQuery(customQuery);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.request()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.wallets[0].id];
                    case 3:
                        error_19 = _a.sent();
                        console.error(error_19);
                        throw new Error(error_19);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return QueryTemplates;
}());
exports.QueryTemplates = QueryTemplates;
