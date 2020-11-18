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
exports.HoldersReportData = exports.DealsReportData = exports.Report = void 0;
//import ExcelJS from 'exceljs';
var ExcelJS = require('exceljs');
var graph_1 = require("./graph");
var utils_1 = require("./utils");
var FileSaver = require('file-saver');
var Report = /** @class */ (function () {
    function Report(url) {
        if (url === void 0) { url = 'mainnet'; }
        this.url = url;
    }
    Report.prototype.getTransactionReport = function (timeLow, timeHigh, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, i, sheet, transactions, rows, j, array, tableName, error_1, buffer, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokensArray.length)) return [3 /*break*/, 4];
                        sheet = workbook.addWorksheet(tokensArray[i].symbol);
                        return [4 /*yield*/, getTransactions(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 2:
                        transactions = _a.sent();
                        if (transactions.length > 0) {
                            rows = [];
                            for (j = 0; j < transactions.length; j++) {
                                array = [];
                                array.push(new Date(transactions[j].timestamp * 1000));
                                array.push(transactions[j].currency.tokenSymbol);
                                array.push(transactions[j].from.id);
                                if (transactions[j].from.name == null) {
                                    array.push("");
                                }
                                else {
                                    array.push(transactions[j].from.name.id);
                                }
                                array.push(transactions[j].to.id);
                                if (transactions[j].to.name == null) {
                                    array.push("");
                                }
                                else {
                                    array.push(transactions[j].to.name.id);
                                }
                                array.push(parseFloat(utils_1.weiToEther(transactions[j].amount)));
                                rows.push(array);
                            }
                            tableName = 'Tabla' + tokensArray[i].symbol;
                            addTable(sheet, tableName, 'B2', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Divisa' },
                                { name: 'Origen (wallet)' },
                                { name: 'Origen (usuario)', filterButton: true },
                                { name: 'Destino (wallet)' },
                                { name: 'Destino (usuario)', filterButton: true },
                                { name: 'Monto', totalsRowFunction: 'sum' }
                            ], rows);
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _a.trys.push([4, 6, , 12]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsTransactionsReport.xlsx')];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 6:
                        error_1 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 7:
                        buffer = _a.sent();
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTransactionsReport.xlsx')];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTokenHoldersReport = function (orderBy, orderDirection, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var first, skip, queryTemplates, workbook, i, response, loopresponse, sheet, rows, j, array, tableName, skipOffers, offers, loopOffers, rows2, k, array2, tableName2, error_2, buffer, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        first = 1000;
                        skip = 0;
                        queryTemplates = new graph_1.QueryTemplates(this.url);
                        workbook = new ExcelJS.Workbook();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokensArray.length)) return [3 /*break*/, 13];
                        return [4 /*yield*/, queryTemplates.getTokenHolders(orderBy, orderDirection, first, skip, tokensArray[i].address)];
                    case 2:
                        response = _a.sent();
                        loopresponse = response;
                        _a.label = 3;
                    case 3:
                        if (!(loopresponse.length >= 1000)) return [3 /*break*/, 5];
                        skip = response.length;
                        return [4 /*yield*/, queryTemplates.getTokenHolders(orderBy, orderDirection, first, skip, tokensArray[i].address)];
                    case 4:
                        response = _a.sent();
                        response = response.concat(loopresponse);
                        return [3 /*break*/, 3];
                    case 5:
                        sheet = workbook.addWorksheet(tokensArray[i].symbol);
                        sheet.getCell('B2').value = 'TOKEN';
                        sheet.getCell('B3').value = 'FECHA';
                        sheet.getCell('B2').font = { bold: true };
                        sheet.getCell('B3').font = { bold: true };
                        sheet.getCell('C2').value = tokensArray[i].symbol;
                        sheet.getCell('C3').value = getTime();
                        sheet.getCell('C6').value = 'HOLDERS';
                        sheet.getCell('C6').font = { bold: true };
                        rows = [];
                        for (j = 0; j < response.length; j++) {
                            array = [];
                            if (response[j].wallet.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(response[j].wallet.name.id);
                            }
                            array.push(response[j].wallet.id);
                            array.push(parseFloat(utils_1.weiToEther(response[j].balance)));
                            rows.push(array);
                        }
                        tableName = 'Tabla' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'B7', [
                                { name: 'Nombre', filterButton: true },
                                { name: 'Wallet' },
                                { name: 'Saldo', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 6:
                        _a.sent();
                        skipOffers = 0;
                        return [4 /*yield*/, queryTemplates.getOffers('sellToken: "' + tokensArray[i].address + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 7:
                        offers = _a.sent();
                        loopOffers = offers;
                        _a.label = 8;
                    case 8:
                        if (!(loopOffers.length >= 1000)) return [3 /*break*/, 10];
                        skipOffers = offers.length;
                        return [4 /*yield*/, queryTemplates.getOffers('sellToken: "' + tokensArray[i].address + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 9:
                        offers = _a.sent();
                        offers = offers.concat(loopOffers);
                        return [3 /*break*/, 8];
                    case 10:
                        if (!(offers.length > 0)) return [3 /*break*/, 12];
                        sheet.getCell('G6').value = 'OFERTAS P2P';
                        sheet.getCell('G6').font = { bold: true };
                        rows2 = [];
                        for (k = 0; k < offers.length; k++) {
                            array2 = [];
                            array2.push(offers[k].owner.name);
                            array2.push(offers[k].owner.id);
                            array2.push(parseFloat(utils_1.weiToEther(offers[k].sellAmount)));
                            rows2.push(array2);
                        }
                        tableName2 = 'P2P' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName2, 'F7', [
                                { name: 'Dueño de la oferta', filterButton: true },
                                { name: 'Wallet' },
                                { name: 'Cantidad ofertada', totalsRowFunction: 'sum' }
                            ], rows2)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 1];
                    case 13:
                        _a.trys.push([13, 15, , 21]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsTokenHoldersReport.xlsx')];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 21];
                    case 15:
                        error_2 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 16:
                        buffer = _a.sent();
                        _a.label = 17;
                    case 17:
                        _a.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenHoldersReport.xlsx')];
                    case 18:
                        _a.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getPackableHoldersReport = function (orderBy, orderDirection, tokensArray, expiries) {
        return __awaiter(this, void 0, void 0, function () {
            var first, skip, queryTemplates, workbook, i, response, loopresponse, sheet, rows, j, array, tableName, skipOffers, offers, loopOffers, rows2, k, array2, tableName2, error_3, buffer, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        first = 1000;
                        skip = 0;
                        queryTemplates = new graph_1.QueryTemplates(this.url);
                        workbook = new ExcelJS.Workbook();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokensArray.length)) return [3 /*break*/, 13];
                        return [4 /*yield*/, queryTemplates.getPackableHolders(tokensArray[i].address, expiries[i][1], orderBy, orderDirection, first, skip)];
                    case 2:
                        response = _a.sent();
                        loopresponse = response;
                        _a.label = 3;
                    case 3:
                        if (!(loopresponse.length >= 1000)) return [3 /*break*/, 5];
                        skip = response.length;
                        return [4 /*yield*/, queryTemplates.getPackableHolders(tokensArray[i].address, expiries[i][1], orderBy, orderDirection, first, skip)];
                    case 4:
                        response = _a.sent();
                        response = response.concat(loopresponse);
                        return [3 /*break*/, 3];
                    case 5:
                        sheet = workbook.addWorksheet(tokensArray[i].symbol + '-' + expiries[i][0]);
                        sheet.getCell('B2').value = 'TOKEN';
                        sheet.getCell('B3').value = 'VENCIMIENTO';
                        sheet.getCell('B4').value = 'FECHA';
                        sheet.getCell('B2').font = { bold: true };
                        sheet.getCell('B3').font = { bold: true };
                        sheet.getCell('B4').font = { bold: true };
                        sheet.getCell('C2').value = tokensArray[i].symbol;
                        sheet.getCell('C3').value = expiries[i][0];
                        sheet.getCell('C4').value = getTime();
                        sheet.getCell('C6').value = 'HOLDERS';
                        sheet.getCell('C6').font = { bold: true };
                        rows = [];
                        for (j = 0; j < response.length; j++) {
                            array = [];
                            if (response[j].wallet.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(response[j].wallet.name.id);
                            }
                            array.push(response[j].wallet.id);
                            array.push(parseInt(utils_1.weiToEther(response[j].balance)));
                            rows.push(array);
                        }
                        tableName = 'Tabla' + tokensArray[i].symbol + expiries[i][0];
                        return [4 /*yield*/, addTable(sheet, tableName, 'B7', [
                                { name: 'Nombre', filterButton: true },
                                { name: 'Wallet' },
                                { name: 'Saldo', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 6:
                        _a.sent();
                        skipOffers = 0;
                        return [4 /*yield*/, queryTemplates.getPackableOffers('sellToken: "' + tokensArray[i].address + '", sellId: "' + expiries[i][1] + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 7:
                        offers = _a.sent();
                        loopOffers = offers;
                        _a.label = 8;
                    case 8:
                        if (!(loopOffers.length >= 1000)) return [3 /*break*/, 10];
                        skipOffers = offers.length;
                        return [4 /*yield*/, queryTemplates.getPackableOffers('sellToken: "' + tokensArray[i].address + '", sellId: "' + expiries[i][1] + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 9:
                        offers = _a.sent();
                        offers = offers.concat(loopOffers);
                        return [3 /*break*/, 8];
                    case 10:
                        if (!(offers.length > 0)) return [3 /*break*/, 12];
                        sheet.getCell('F6').value = 'NOTA: Si no coincide el saldo de Mercado P2P con el total ofertado hay que ver pactos pendientes';
                        sheet.getCell('F6').font = { color: { argb: "ff0000" } };
                        sheet.getCell('G5').value = 'OFERTAS P2P';
                        sheet.getCell('G5').font = { bold: true };
                        rows2 = [];
                        for (k = 0; k < offers.length; k++) {
                            array2 = [];
                            array2.push(offers[k].owner.name);
                            array2.push(offers[k].owner.id);
                            array2.push(parseInt(utils_1.weiToEther(offers[k].sellAmount)));
                            rows2.push(array2);
                        }
                        tableName2 = 'P2P' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName2, 'F7', [
                                { name: 'Dueño de la oferta', filterButton: true },
                                { name: 'Wallet' },
                                { name: 'Cantidad ofertada', totalsRowFunction: 'sum' }
                            ], rows2)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 1];
                    case 13:
                        _a.trys.push([13, 15, , 21]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsPackableHoldersReport.xlsx')];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 21];
                    case 15:
                        error_3 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 16:
                        buffer = _a.sent();
                        _a.label = 17;
                    case 17:
                        _a.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableHoldersReport.xlsx')];
                    case 18:
                        _a.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getCollectableHoldersReport = function (orderBy, orderDirection, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var first, skip, queryTemplates, workbook, i, response, loopresponse, sheet, rows, j, array, tableName, skipOffers, offers, loopOffers, rows2, k, array2, tableName2, error_4, buffer, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        first = 1000;
                        skip = 0;
                        queryTemplates = new graph_1.QueryTemplates(this.url);
                        workbook = new ExcelJS.Workbook();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokensArray.length)) return [3 /*break*/, 13];
                        return [4 /*yield*/, queryTemplates.getNFTHolders(orderBy, orderDirection, first, skip, tokensArray[i].address)];
                    case 2:
                        response = _a.sent();
                        loopresponse = response;
                        _a.label = 3;
                    case 3:
                        if (!(loopresponse.length >= 1000)) return [3 /*break*/, 5];
                        skip = response.length;
                        return [4 /*yield*/, queryTemplates.getNFTHolders(orderBy, orderDirection, first, skip, tokensArray[i].address)];
                    case 4:
                        response = _a.sent();
                        response = response.concat(loopresponse);
                        return [3 /*break*/, 3];
                    case 5:
                        sheet = workbook.addWorksheet(tokensArray[i].symbol);
                        sheet.getCell('B2').value = 'TOKEN';
                        sheet.getCell('B3').value = 'FECHA';
                        sheet.getCell('B2').font = { bold: true };
                        sheet.getCell('B3').font = { bold: true };
                        sheet.getCell('C2').value = tokensArray[i].symbol;
                        sheet.getCell('C3').value = getTime();
                        sheet.getCell('C6').value = 'HOLDERS';
                        sheet.getCell('C6').font = { bold: true };
                        rows = [];
                        for (j = 0; j < response.length; j++) {
                            array = [];
                            if (response[j].wallet.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(response[j].wallet.name.id);
                            }
                            array.push(response[j].wallet.id);
                            array.push(parseFloat(utils_1.weiToEther(response[j].balance)));
                            rows.push(array);
                        }
                        tableName = 'Tabla' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'B7', [
                                { name: 'Nombre', filterButton: true },
                                { name: 'Wallet' },
                                { name: 'Saldo', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 6:
                        _a.sent();
                        skipOffers = 0;
                        return [4 /*yield*/, queryTemplates.getNFTOffers('sellToken: "' + tokensArray[i].address + '", isOpen: true', 'timestamp', 'desc', 1000, skipOffers)];
                    case 7:
                        offers = _a.sent();
                        loopOffers = offers;
                        _a.label = 8;
                    case 8:
                        if (!(loopOffers.length >= 1000)) return [3 /*break*/, 10];
                        skipOffers = offers.length;
                        return [4 /*yield*/, queryTemplates.getNFTOffers('sellToken: "' + tokensArray[i].address + '", isOpen: true', 'timestamp', 'desc', 1000, skipOffers)];
                    case 9:
                        offers = _a.sent();
                        offers = offers.concat(loopOffers);
                        return [3 /*break*/, 8];
                    case 10:
                        if (!(offers.length > 0)) return [3 /*break*/, 12];
                        sheet.getCell('G6').value = 'OFERTAS P2P';
                        sheet.getCell('G6').font = { bold: true };
                        rows2 = [];
                        for (k = 0; k < offers.length; k++) {
                            array2 = [];
                            array2.push(offers[k].owner.name);
                            array2.push(offers[k].owner.id);
                            array2.push(parseInt(utils_1.weiToEther(offers[k].sellAmount)));
                            rows2.push(array2);
                        }
                        tableName2 = 'P2P' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName2, 'F7', [
                                { name: 'Dueño de la oferta', filterButton: true },
                                { name: 'Wallet' },
                                { name: 'Cantidad ofertada', totalsRowFunction: 'sum' }
                            ], rows2)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 1];
                    case 13:
                        _a.trys.push([13, 15, , 21]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsCollectableHoldersReport.xlsx')];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 21];
                    case 15:
                        error_4 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 16:
                        buffer = _a.sent();
                        _a.label = 17;
                    case 17:
                        _a.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsCollectableHoldersReport.xlsx')];
                    case 18:
                        _a.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTokenDealsReport = function (timeLow, timeHigh, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, i, sheet, sheet2, offers, offersPrimary, requests, requestsPrimary, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, error_5, buffer, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokensArray.length)) return [3 /*break*/, 22];
                        sheet = void 0;
                        sheet2 = void 0;
                        return [4 /*yield*/, getOffers(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 2:
                        offers = _a.sent();
                        return [4 /*yield*/, getOffersPrimary(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 3:
                        offersPrimary = _a.sent();
                        return [4 /*yield*/, getRequests(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 4:
                        requests = _a.sent();
                        return [4 /*yield*/, getRequestsPrimary(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 5:
                        requestsPrimary = _a.sent();
                        if ((offers.length > 0) || (requests.length > 0)) {
                            sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
                            sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
                            sheet.getCell('C1').font = { bold: true };
                        }
                        if ((offersPrimary.length > 0) || (requestsPrimary.length > 0)) {
                            sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
                            sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
                            sheet2.getCell('C1').font = { bold: true };
                        }
                        if (!(offers.length > 0)) return [3 /*break*/, 9];
                        rows = [];
                        j = 0;
                        _a.label = 6;
                    case 6:
                        if (!(j < offers.length)) return [3 /*break*/, 9];
                        if (!(offers[j].deals.length > 0)) return [3 /*break*/, 8];
                        deals = offers[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseFloat(utils_1.weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(utils_1.weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }
                        sheet.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet.getCell('B2').font = { bold: true };
                        tableName = 'Tabla' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'B3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        j++;
                        return [3 /*break*/, 6];
                    case 9:
                        if (!(requests.length > 0)) return [3 /*break*/, 13];
                        rows = [];
                        j = 0;
                        _a.label = 10;
                    case 10:
                        if (!(j < requests.length)) return [3 /*break*/, 13];
                        if (!(requests[j].deals.length > 0)) return [3 /*break*/, 12];
                        deals = requests[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseFloat(utils_1.weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(utils_1.weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }
                        sheet.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('I2').font = { bold: true };
                        tableName = 'Tabla2' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'I3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        j++;
                        return [3 /*break*/, 10];
                    case 13:
                        if (!(offersPrimary.length > 0)) return [3 /*break*/, 17];
                        rows = [];
                        j = 0;
                        _a.label = 14;
                    case 14:
                        if (!(j < offersPrimary.length)) return [3 /*break*/, 17];
                        if (!(offersPrimary[j].deals.length > 0)) return [3 /*break*/, 16];
                        deals = offersPrimary[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseFloat(utils_1.weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(utils_1.weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }
                        sheet2.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet2.getCell('B2').font = { bold: true };
                        tableName = 'TablaPrimario' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet2, tableName, 'B3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16:
                        j++;
                        return [3 /*break*/, 14];
                    case 17:
                        if (!(requestsPrimary.length > 0)) return [3 /*break*/, 21];
                        rows = [];
                        j = 0;
                        _a.label = 18;
                    case 18:
                        if (!(j < requestsPrimary.length)) return [3 /*break*/, 21];
                        if (!(requestsPrimary[j].deals.length > 0)) return [3 /*break*/, 20];
                        deals = requestsPrimary[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseFloat(utils_1.weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(utils_1.weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }
                        sheet2.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('I2').font = { bold: true };
                        tableName = 'TablaPrimario' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet2, tableName, 'I3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20:
                        j++;
                        return [3 /*break*/, 18];
                    case 21:
                        i++;
                        return [3 /*break*/, 1];
                    case 22:
                        _a.trys.push([22, 24, , 30]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsTokenDealsReport.xlsx')];
                    case 23:
                        _a.sent();
                        return [3 /*break*/, 30];
                    case 24:
                        error_5 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 25:
                        buffer = _a.sent();
                        _a.label = 26;
                    case 26:
                        _a.trys.push([26, 28, , 29]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenDealsReport.xlsx')];
                    case 27:
                        _a.sent();
                        return [3 /*break*/, 29];
                    case 28:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [3 /*break*/, 29];
                    case 29: return [3 /*break*/, 30];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getPackableDealsReport = function (timeLow, timeHigh, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, i, sheet, sheet2, offers, offersPrimary, requests, requestsPrimary, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, error_6, buffer, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokensArray.length)) return [3 /*break*/, 22];
                        sheet = void 0;
                        sheet2 = void 0;
                        return [4 /*yield*/, getPackableOffers(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 2:
                        offers = _a.sent();
                        return [4 /*yield*/, getPackableOffersPrimary(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 3:
                        offersPrimary = _a.sent();
                        return [4 /*yield*/, getPackableRequests(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 4:
                        requests = _a.sent();
                        return [4 /*yield*/, getPackableRequestsPrimary(timeLow, timeHigh, tokensArray[i].address, this.url)];
                    case 5:
                        requestsPrimary = _a.sent();
                        if ((offers.length > 0) || (requests.length > 0)) {
                            sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
                            sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
                            sheet.getCell('C1').font = { bold: true };
                        }
                        if ((offersPrimary.length > 0) || (requestsPrimary.length > 0)) {
                            sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
                            sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
                            sheet2.getCell('C1').font = { bold: true };
                        }
                        if (!(offers.length > 0)) return [3 /*break*/, 9];
                        rows = [];
                        j = 0;
                        _a.label = 6;
                    case 6:
                        if (!(j < offers.length)) return [3 /*break*/, 9];
                        if (!(offers[j].deals.length > 0)) return [3 /*break*/, 8];
                        deals = offers[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseInt(utils_1.weiToEther(deals[k].sellAmount)));
                            array.push(parseInt(utils_1.weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }
                        sheet.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet.getCell('B2').font = { bold: true };
                        tableName = 'Tabla' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'B3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        j++;
                        return [3 /*break*/, 6];
                    case 9:
                        if (!(requests.length > 0)) return [3 /*break*/, 13];
                        rows = [];
                        j = 0;
                        _a.label = 10;
                    case 10:
                        if (!(j < requests.length)) return [3 /*break*/, 13];
                        if (!(requests[j].deals.length > 0)) return [3 /*break*/, 12];
                        deals = requests[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseInt(utils_1.weiToEther(deals[k].buyAmount)));
                            array.push(parseInt(utils_1.weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }
                        sheet.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('I2').font = { bold: true };
                        tableName = 'Tabla2' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'I3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        j++;
                        return [3 /*break*/, 10];
                    case 13:
                        if (!(offersPrimary.length > 0)) return [3 /*break*/, 17];
                        rows = [];
                        j = 0;
                        _a.label = 14;
                    case 14:
                        if (!(j < offersPrimary.length)) return [3 /*break*/, 17];
                        if (!(offersPrimary[j].deals.length > 0)) return [3 /*break*/, 16];
                        deals = offersPrimary[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseInt(utils_1.weiToEther(deals[k].sellAmount)));
                            array.push(parseInt(utils_1.weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }
                        sheet2.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet2.getCell('B2').font = { bold: true };
                        tableName = 'TablaPrimario' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet2, tableName, 'B3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16:
                        j++;
                        return [3 /*break*/, 14];
                    case 17:
                        if (!(requestsPrimary.length > 0)) return [3 /*break*/, 21];
                        rows = [];
                        j = 0;
                        _a.label = 18;
                    case 18:
                        if (!(j < requestsPrimary.length)) return [3 /*break*/, 21];
                        if (!(requestsPrimary[j].deals.length > 0)) return [3 /*break*/, 20];
                        deals = requestsPrimary[j].deals;
                        for (k = 0; k < deals.length; k++) {
                            array = [];
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
                            if (deals[k].seller.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].seller.name);
                            }
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            }
                            else {
                                array.push(deals[k].buyer.name);
                            }
                            array.push(parseInt(utils_1.weiToEther(deals[k].buyAmount)));
                            array.push(parseInt(utils_1.weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }
                        sheet2.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('I2').font = { bold: true };
                        tableName = 'TablaPrimario' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet2, tableName, 'I3', [
                                { name: 'Fecha', filterButton: true },
                                { name: 'Contrapartida', filterButton: true },
                                { name: 'Vendedor (usuario)', filterButton: true },
                                { name: 'Comprador (usuario)', filterButton: true },
                                { name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum' },
                                { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                            ], rows)];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20:
                        j++;
                        return [3 /*break*/, 18];
                    case 21:
                        i++;
                        return [3 /*break*/, 1];
                    case 22:
                        _a.trys.push([22, 24, , 30]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsPackableDealsReport.xlsx')];
                    case 23:
                        _a.sent();
                        return [3 /*break*/, 30];
                    case 24:
                        error_6 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 25:
                        buffer = _a.sent();
                        _a.label = 26;
                    case 26:
                        _a.trys.push([26, 28, , 29]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableDealsReport.xlsx')];
                    case 27:
                        _a.sent();
                        return [3 /*break*/, 29];
                    case 28:
                        err_6 = _a.sent();
                        console.error(err_6);
                        return [3 /*break*/, 29];
                    case 29: return [3 /*break*/, 30];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTransactionsData = function (timeLow, timeHigh, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTransactions(timeLow, timeHigh, token.address, this.url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Report.prototype.getDealsData = function (timeLow, timeHigh, token, market) {
        if (market === void 0) { market = "secondary"; }
        return __awaiter(this, void 0, void 0, function () {
            var offers, requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offers = [];
                        requests = [];
                        if (!(token.category == 1)) return [3 /*break*/, 7];
                        if (!(market == "secondary")) return [3 /*break*/, 3];
                        return [4 /*yield*/, getOffers(timeLow, timeHigh, token.address, this.url)];
                    case 1:
                        offers = _a.sent();
                        return [4 /*yield*/, getRequests(timeLow, timeHigh, token.address, this.url)];
                    case 2:
                        requests = _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(market == "primary")) return [3 /*break*/, 6];
                        return [4 /*yield*/, getOffersPrimary(timeLow, timeHigh, token.address, this.url)];
                    case 4:
                        offers = _a.sent();
                        return [4 /*yield*/, getRequestsPrimary(timeLow, timeHigh, token.address, this.url)];
                    case 5:
                        requests = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 18];
                    case 7:
                        if (!(token.category == 2)) return [3 /*break*/, 12];
                        if (!(market == "secondary")) return [3 /*break*/, 9];
                        return [4 /*yield*/, getCollectableOffers(timeLow, timeHigh, token.address, this.url)];
                    case 8:
                        offers = _a.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        if (!(market == "primary")) return [3 /*break*/, 11];
                        return [4 /*yield*/, getCollectableOffersPrimary(timeLow, timeHigh, token.address, this.url)];
                    case 10:
                        offers = _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 18];
                    case 12:
                        if (!(token.category == 3)) return [3 /*break*/, 18];
                        if (!(market == "secondary")) return [3 /*break*/, 15];
                        return [4 /*yield*/, getPackableOffers(timeLow, timeHigh, token.address, this.url)];
                    case 13:
                        offers = _a.sent();
                        return [4 /*yield*/, getPackableRequests(timeLow, timeHigh, token.address, this.url)];
                    case 14:
                        requests = _a.sent();
                        return [3 /*break*/, 18];
                    case 15:
                        if (!(market == "primary")) return [3 /*break*/, 18];
                        return [4 /*yield*/, getPackableOffersPrimary(timeLow, timeHigh, token.address, this.url)];
                    case 16:
                        offers = _a.sent();
                        return [4 /*yield*/, getPackableRequestsPrimary(timeLow, timeHigh, token.address, this.url)];
                    case 17:
                        requests = _a.sent();
                        _a.label = 18;
                    case 18:
                        offers = cleanEmptyDeals(offers);
                        requests = cleanEmptyDeals(requests);
                        return [2 /*return*/, new DealsReportData(token.address, token.symbol, offers, requests)];
                }
            });
        });
    };
    Report.prototype.getHoldersData = function (token, expiry) {
        return __awaiter(this, void 0, void 0, function () {
            var first, orderBy, orderDirection, queryTemplates, skip, holders, offers, loopresponse, skipOffers, loopOffers, loopresponse, skipOffers, loopOffers, loopresponse, skipOffers, loopOffers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        first = 1000;
                        orderBy = "balance";
                        orderDirection = "desc";
                        queryTemplates = new graph_1.QueryTemplates(this.url);
                        skip = 0;
                        holders = [];
                        offers = [];
                        if (!(token.category == 1)) return [3 /*break*/, 9];
                        return [4 /*yield*/, queryTemplates.getTokenHolders(orderBy, orderDirection, first, skip, token.address)];
                    case 1:
                        holders = _a.sent();
                        loopresponse = holders;
                        _a.label = 2;
                    case 2:
                        if (!(loopresponse.length >= 1000)) return [3 /*break*/, 4];
                        skip = holders.length;
                        return [4 /*yield*/, queryTemplates.getTokenHolders(orderBy, orderDirection, first, skip, token.address)];
                    case 3:
                        holders = _a.sent();
                        holders = holders.concat(loopresponse);
                        return [3 /*break*/, 2];
                    case 4:
                        skipOffers = 0;
                        return [4 /*yield*/, queryTemplates.getOffers('sellToken: "' + token.address + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 5:
                        offers = _a.sent();
                        loopOffers = offers;
                        _a.label = 6;
                    case 6:
                        if (!(loopOffers.length >= 1000)) return [3 /*break*/, 8];
                        skipOffers = offers.length;
                        return [4 /*yield*/, queryTemplates.getOffers('sellToken: "' + token.address + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 7:
                        offers = _a.sent();
                        offers = offers.concat(loopOffers);
                        return [3 /*break*/, 6];
                    case 8: return [3 /*break*/, 26];
                    case 9:
                        if (!(token.category == 2)) return [3 /*break*/, 18];
                        return [4 /*yield*/, queryTemplates.getNFTHolders(orderBy, orderDirection, first, skip, token.address)];
                    case 10:
                        holders = _a.sent();
                        loopresponse = holders;
                        _a.label = 11;
                    case 11:
                        if (!(loopresponse.length >= 1000)) return [3 /*break*/, 13];
                        skip = holders.length;
                        return [4 /*yield*/, queryTemplates.getNFTHolders(orderBy, orderDirection, first, skip, token.address)];
                    case 12:
                        holders = _a.sent();
                        holders = holders.concat(loopresponse);
                        return [3 /*break*/, 11];
                    case 13:
                        skipOffers = 0;
                        return [4 /*yield*/, queryTemplates.getNFTOffers('sellToken: "' + token.address + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 14:
                        offers = _a.sent();
                        loopOffers = offers;
                        _a.label = 15;
                    case 15:
                        if (!(loopOffers.length >= 1000)) return [3 /*break*/, 17];
                        skipOffers = offers.length;
                        return [4 /*yield*/, queryTemplates.getNFTOffers('sellToken: "' + token.address + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 16:
                        offers = _a.sent();
                        offers = offers.concat(loopOffers);
                        return [3 /*break*/, 15];
                    case 17: return [3 /*break*/, 26];
                    case 18:
                        if (!(token.category == 3)) return [3 /*break*/, 26];
                        return [4 /*yield*/, queryTemplates.getPackableHolders(token.address, expiry[1], orderBy, orderDirection, first, skip)];
                    case 19:
                        holders = _a.sent();
                        loopresponse = holders;
                        _a.label = 20;
                    case 20:
                        if (!(loopresponse.length >= 1000)) return [3 /*break*/, 22];
                        skip = holders.length;
                        return [4 /*yield*/, queryTemplates.getPackableHolders(token.address, expiry[1], orderBy, orderDirection, first, skip)];
                    case 21:
                        holders = _a.sent();
                        holders = holders.concat(loopresponse);
                        return [3 /*break*/, 20];
                    case 22:
                        skipOffers = 0;
                        return [4 /*yield*/, queryTemplates.getPackableOffers('sellToken: "' + token.address + '", sellId: "' + expiry[1] + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 23:
                        offers = _a.sent();
                        loopOffers = offers;
                        _a.label = 24;
                    case 24:
                        if (!(loopOffers.length >= 1000)) return [3 /*break*/, 26];
                        skipOffers = offers.length;
                        return [4 /*yield*/, queryTemplates.getPackableOffers('sellToken: "' + token.address + '", sellId: "' + expiry[1] + '", isOpen: true', 'sellAmount', 'desc', 1000, skipOffers)];
                    case 25:
                        offers = _a.sent();
                        offers = offers.concat(loopOffers);
                        return [3 /*break*/, 24];
                    case 26: return [2 /*return*/, new HoldersReportData(token.address, token.symbol, holders, offers, expiry)];
                }
            });
        });
    };
    return Report;
}());
exports.Report = Report;
function getTransactions(_timeLow, _timeHigh, _tokenAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryTransactions, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ transactions(first: 1000, skip: ' + skip + ', where: {timestamp_gte: ' + _timeLow + ', timestamp_lte: ' + _timeHigh + ', currency:"' + _tokenAddress + '"}, orderBy: timestamp, orderDirection: desc) { from { id name { id } } to { id name { id } } currency { tokenSymbol } amount timestamp } }';
                    queryService = new graph_1.Query('bank', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryTransactions = response.transactions;
                    transactions = queryTransactions;
                    _a.label = 2;
                case 2:
                    if (!(queryTransactions.length >= 1000)) return [3 /*break*/, 4];
                    skip = transactions.length;
                    query = '{ transactions(first: 1000, skip: ' + skip + ', where: {timestamp_gte: ' + _timeLow + ', timestamp_lte: ' + _timeHigh + ', currency:"' + _tokenAddress + '"}, orderBy: timestamp, orderDirection: desc) { from { id name { id } } to { id name { id } } currency { tokenSymbol } amount timestamp } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryTransactions = response.transactions;
                    transactions = transactions.concat(queryTransactions);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, transactions];
            }
        });
    });
}
function getOffers(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getRequests(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getOffersPrimary(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p-primary', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getRequestsPrimary(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p-primary', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offers;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getCollectableOffers(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getCollectableOffersPrimary(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p-primary', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getPackableOffers(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getPackableRequests(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getPackableOffersPrimary(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p-primary', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function getPackableRequestsPrimary(_timeLow, _timeHigh, _tokensAddress, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryOffers, offers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService = new graph_1.Query('p2p-primary', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = queryOffers;
                    _a.label = 2;
                case 2:
                    if (!(queryOffers.length >= 1000)) return [3 /*break*/, 4];
                    skip = offers.length;
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryOffers = response.offerPackables;
                    offers = offers.concat(queryOffers);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, offers];
            }
        });
    });
}
function addTable(sheet, tableName, tablePosition, columns, rows) {
    sheet.addTable({
        name: tableName,
        ref: tablePosition,
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium1',
            showRowStripes: true
        },
        columns: columns,
        rows: rows
    });
}
function getTime() {
    return timeConverter(Date.now() / 1000);
}
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
function cleanEmptyDeals(array) {
    var cleanArray = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].deals.length > 0) {
            cleanArray.push(array[i]);
        }
    }
    return cleanArray;
}
var DealsReportData = /** @class */ (function () {
    function DealsReportData(tokenAddress, tokenSymbol, offers, requests) {
        this.tokenAddress = tokenAddress;
        this.tokenSymbol = tokenSymbol;
        this.offers = offers;
        this.requests = requests;
    }
    return DealsReportData;
}());
exports.DealsReportData = DealsReportData;
var HoldersReportData = /** @class */ (function () {
    function HoldersReportData(tokenAddress, tokenSymbol, holders, offers, expiry) {
        this.tokenAddress = tokenAddress;
        this.tokenSymbol = tokenSymbol;
        this.holders = holders;
        this.offers = offers;
        this.timestamp = getTime();
        if (expiry != undefined) {
            this.expiry = expiry;
        }
    }
    return HoldersReportData;
}());
exports.HoldersReportData = HoldersReportData;
