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
var Constants = require("./constants");
var graph_1 = require("./graph");
var utils_1 = require("./utils");
var node_fetch_1 = require("node-fetch");
var FileSaver = require('file-saver');
var ONE_UTC_DAY = 86400;
var Report = /** @class */ (function () {
    function Report(url) {
        if (url === void 0) { url = 'mainnet'; }
        this.url = url;
    }
    Report.prototype.getTransactionReportV2 = function (monthIndex, year, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, toYear, toMonthIndex, timeLow, timeHigh, promises, i, sheet, error_1, buffer, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        toYear = year;
                        toMonthIndex = monthIndex + 1;
                        if (monthIndex == 12) {
                            toYear = year + 1;
                            toMonthIndex = 1;
                        }
                        timeLow = getUtcTimeFromDate(year, monthIndex, 1);
                        timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);
                        promises = [];
                        for (i = 0; i < tokensArray.length; i++) {
                            sheet = workbook.addWorksheet(tokensArray[i].symbol);
                            promises.push(setTransactionSheet(sheet, timeLow, timeHigh, monthIndex, year, toMonthIndex, toYear, this.url, tokensArray[i]));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 10]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsTransactionsReportV2.xlsx')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        error_1 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 5:
                        buffer = _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTransactionsReportV2.xlsx')];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTransactionReport = function (timeLow, timeHigh, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, i, sheet, transactions, rows, j, array, tableName, error_2, buffer, err_2;
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
                        error_2 = _a.sent();
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
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTokenHoldersReport = function (orderBy, orderDirection, tokensArray) {
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
                        error_3 = _a.sent();
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
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getPackableHoldersReport = function (orderBy, orderDirection, tokensArray, expiries) {
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
                        error_4 = _a.sent();
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
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getCollectableHoldersReport = function (orderBy, orderDirection, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var first, skip, queryTemplates, workbook, i, response, loopresponse, sheet, rows, j, array, tableName, skipOffers, offers, loopOffers, rows2, k, array2, tableName2, error_5, buffer, err_5;
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
                        error_5 = _a.sent();
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
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTokenDealsReportV2 = function (monthIndex, year, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, toYear, toMonthIndex, timeLow, timeHigh, promises, i, sheet, sheet2, error_6, buffer, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        toYear = year;
                        toMonthIndex = monthIndex + 1;
                        if (monthIndex == 12) {
                            toYear = year + 1;
                            toMonthIndex = 1;
                        }
                        timeLow = getUtcTimeFromDate(year, monthIndex, 1);
                        timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);
                        promises = [];
                        for (i = 0; i < tokensArray.length; i++) {
                            sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
                            sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
                            promises.push(setTokenDealsSheet(sheet, timeLow, timeHigh, monthIndex, year, toMonthIndex, toYear, this.url, tokensArray[i]));
                            promises.push(setPrimaryTokenDealsSheet(sheet2, timeLow, timeHigh, monthIndex, year, toMonthIndex, toYear, this.url, tokensArray[i]));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 10]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsTokenDealsReportV2.xlsx')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        error_6 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 5:
                        buffer = _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenDealsReportV2.xlsx')];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_6 = _a.sent();
                        console.error(err_6);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getTokenDealsReport = function (timeLow, timeHigh, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, i, sheet, sheet2, offers, offersPrimary, requests, requestsPrimary, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, error_7, buffer, err_7;
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                        sheet.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('K2').font = { bold: true };
                        tableName = 'Tabla2' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'K3', [
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                        sheet2.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('K2').font = { bold: true };
                        tableName = 'TablaPrimario' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet2, tableName, 'K3', [
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                        error_7 = _a.sent();
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
                        err_7 = _a.sent();
                        console.error(err_7);
                        return [3 /*break*/, 29];
                    case 29: return [3 /*break*/, 30];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getPackableDealsReportV2 = function (monthIndex, year, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, toYear, toMonthIndex, timeLow, timeHigh, promises, i, sheet, sheet2, error_8, buffer, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        toYear = year;
                        toMonthIndex = monthIndex + 1;
                        if (monthIndex == 12) {
                            toYear = year + 1;
                            toMonthIndex = 1;
                        }
                        timeLow = getUtcTimeFromDate(year, monthIndex, 1);
                        timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);
                        promises = [];
                        for (i = 0; i < tokensArray.length; i++) {
                            sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
                            sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
                            promises.push(setPackableDealsSheet(sheet, timeLow, timeHigh, this.url, tokensArray[i]));
                            promises.push(setPrimaryPackableDealsSheet(sheet2, timeLow, timeHigh, this.url, tokensArray[i]));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 10]);
                        return [4 /*yield*/, workbook.xlsx.writeFile('PiMarketsPackableDealsReportV2.xlsx')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        error_8 = _a.sent();
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 5:
                        buffer = _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableDealsReportV2.xlsx')];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_8 = _a.sent();
                        console.error(err_8);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Report.prototype.getPackableDealsReport = function (timeLow, timeHigh, tokensArray) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, i, sheet, sheet2, offers, offersPrimary, requests, requestsPrimary, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, rows, j, deals, k, array, tableName, error_9, buffer, err_9;
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                        sheet.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('K2').font = { bold: true };
                        tableName = 'Tabla2' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet, tableName, 'K3', [
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
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
                        sheet2.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('K2').font = { bold: true };
                        tableName = 'TablaPrimario' + tokensArray[i].symbol;
                        return [4 /*yield*/, addTable(sheet2, tableName, 'K3', [
                                { name: 'Fecha (pacto)', filterButton: true },
                                { name: 'Hora (oferta)' },
                                { name: 'Hora (pacto)' },
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
                        error_9 = _a.sent();
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
                        err_9 = _a.sent();
                        console.error(err_9);
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
function setTransactionSheet(sheet, timeLow, timeHigh, monthIndex, year, toMonthIndex, toYear, url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var day, week, month, dayCounter, weekCounter, weekRates, monthCounter, monthRates, weekZeros, monthZeros, _timeLow, _timeHigh, dayRows, weekRows, monthRows, txRows, rates, transactions, nextTx, nextTimestamp, txDayRow, amount, weekRow_1, dayRow, weekRow, monthRow, tableDay, tableWeek, tableMonth, tableName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = 1;
                    week = 1;
                    month = 1;
                    dayCounter = 0;
                    weekCounter = 0;
                    weekRates = 0;
                    monthCounter = 0;
                    monthRates = 0;
                    weekZeros = 0;
                    monthZeros = 0;
                    _timeLow = timeLow;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    dayRows = [];
                    weekRows = [];
                    monthRows = [];
                    txRows = [];
                    return [4 /*yield*/, getDayRate(year, monthIndex, toYear, toMonthIndex, token.address, token.category)];
                case 1:
                    rates = _a.sent();
                    return [4 /*yield*/, try_getTransactions(timeLow, timeHigh, token.address, url)];
                case 2:
                    transactions = _a.sent();
                    if (transactions.length > 0) {
                        nextTx = transactions.pop();
                        nextTimestamp = nextTx.timestamp;
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    while (_timeHigh <= timeHigh) {
                        while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                            txDayRow = [];
                            amount = parseFloat(utils_1.weiToEther(nextTx.amount));
                            dayCounter = dayCounter + amount;
                            weekCounter = weekCounter + amount;
                            monthCounter = monthCounter + amount;
                            //TXs Table
                            txDayRow.push(new Date(nextTx.timestamp * 1000));
                            txDayRow.push(nextTx.currency.tokenSymbol);
                            txDayRow.push(nextTx.from.id);
                            if (nextTx.from.name == null) {
                                txDayRow.push("");
                            }
                            else {
                                txDayRow.push(nextTx.from.name.id);
                            }
                            txDayRow.push(nextTx.to.id);
                            if (nextTx.to.name == null) {
                                txDayRow.push("");
                            }
                            else {
                                txDayRow.push(nextTx.to.name.id);
                            }
                            txDayRow.push(parseFloat(utils_1.weiToEther(nextTx.amount)));
                            txRows.push(txDayRow);
                            //pop new tx
                            if (transactions.length > 0) {
                                nextTx = transactions.pop();
                                nextTimestamp = nextTx.timestamp;
                            }
                            else {
                                nextTimestamp = 0;
                            }
                        }
                        //update week and month rate counters
                        weekRates = weekRates + rates[day - 1];
                        monthRates = monthRates + rates[day - 1];
                        if (rates[day - 1] == 0) {
                            weekZeros++;
                            monthZeros++;
                        }
                        //compute week
                        if (day == 7 * week) {
                            //calc this week rate
                            if ((7 - weekZeros) == 0) {
                                weekRates = 0;
                            }
                            else {
                                weekRates = weekRates / (7 - weekZeros);
                            }
                            weekRow_1 = [];
                            weekRow_1.push(week);
                            weekRow_1.push(weekCounter);
                            weekRow_1.push(weekCounter * weekRates);
                            weekRow_1.push(weekRates);
                            weekRows.push(weekRow_1);
                            //reset and update counters
                            week++;
                            weekCounter = 0;
                            weekRates = 0;
                            weekZeros = 0;
                        }
                        dayRow = [];
                        dayRow.push(day);
                        dayRow.push(dayCounter);
                        dayRow.push(dayCounter * rates[day - 1]);
                        dayRow.push(rates[day - 1]);
                        dayRows.push(dayRow);
                        //update and reset day counters
                        day++;
                        dayCounter = 0;
                        _timeLow = _timeHigh;
                        _timeHigh = _timeLow + ONE_UTC_DAY;
                    }
                    weekRow = [];
                    //calc 5th week rate
                    if ((day - 29 - weekZeros) == 0) {
                        weekRates = 0;
                    }
                    else {
                        weekRates = weekRates / (day - 29 - weekZeros);
                    }
                    //update week arrays
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    monthRow = [];
                    //calc month rate
                    if ((day - 1 - monthZeros) == 0) {
                        monthRates = 0;
                    }
                    else {
                        monthRates = monthRates / (day - 1 - monthZeros);
                    }
                    //update month arrays
                    monthRow.push(month);
                    monthRow.push(monthCounter);
                    monthRow.push(monthCounter * monthRates);
                    monthRow.push(monthRates);
                    monthRows.push(monthRow);
                    tableDay = 'TablaDay' + token.symbol;
                    tableWeek = 'TablaWeek' + token.symbol;
                    tableMonth = 'TablaMonth' + token.symbol;
                    addTable(sheet, tableDay, 'B2', [
                        { name: 'Día', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], dayRows);
                    addTable(sheet, tableWeek, 'G2', [
                        { name: 'Semana', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], weekRows);
                    addTable(sheet, tableMonth, 'L2', [
                        { name: 'Mes', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], monthRows);
                    tableName = 'Tabla' + token.symbol;
                    if (txRows.length == 0) {
                        txRows = getEmptyTransaction();
                    }
                    addTable(sheet, tableName, 'B36', [
                        { name: 'Fecha', filterButton: true },
                        { name: 'Divisa' },
                        { name: 'Origen (wallet)' },
                        { name: 'Origen (usuario)', filterButton: true },
                        { name: 'Destino (wallet)' },
                        { name: 'Destino (usuario)', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' }
                    ], txRows);
                    //CELL LABELS
                    sheet.getCell('B35').value = 'TRANSFERENCIAS';
                    sheet.getCell('B35').font = { bold: true };
                    sheet.getCell('B1').value = 'TOTAL (diario)';
                    sheet.getCell('B1').font = { bold: true };
                    sheet.getCell('G1').value = 'TOTAL (semanal)';
                    sheet.getCell('G1').font = { bold: true };
                    sheet.getCell('L1').value = 'TOTAL (mensual)';
                    sheet.getCell('L1').font = { bold: true };
                    return [2 /*return*/];
            }
        });
    });
}
function setTokenDealsSheet(sheet, timeLow, timeHigh, monthIndex, year, toMonthIndex, toYear, url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var day, week, month, dayCounter, weekCounter, monthCounter, weekRates, monthRates, weekZeros, monthZeros, _timeLow, _timeHigh, dayRows, weekRows, monthRows, offersRows, requestsRows, dayOffers, dayRequests, rates, nextOffer, nextTimestamp, nextIsOffer, nextOfferTimestamp, nextRequestTimestamp, deals, q, amount, array, deals, q, amount, array, nextOfferTimestamp, nextRequestTimestamp, weekRow_2, dayRow, weekRow, monthRow, tableDay, tableWeek, tableMonth, tableName, tableName2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = 1;
                    week = 1;
                    month = 1;
                    dayCounter = 0;
                    weekCounter = 0;
                    monthCounter = 0;
                    weekRates = 0;
                    monthRates = 0;
                    weekZeros = 0;
                    monthZeros = 0;
                    _timeLow = timeLow;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    dayRows = [];
                    weekRows = [];
                    monthRows = [];
                    offersRows = [];
                    requestsRows = [];
                    return [4 /*yield*/, try_getOffers(timeLow, timeHigh, token.address, url)];
                case 1:
                    dayOffers = _a.sent();
                    return [4 /*yield*/, try_getRequests(timeLow, timeHigh, token.address, url)];
                case 2:
                    dayRequests = _a.sent();
                    return [4 /*yield*/, getDayRate(year, monthIndex, toYear, toMonthIndex, token.address, token.category)];
                case 3:
                    rates = _a.sent();
                    if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                    else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    }
                    else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                        nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                        nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                        if (nextOfferTimestamp < nextRequestTimestamp) {
                            nextOffer = dayOffers.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = true;
                        }
                        else {
                            nextOffer = dayRequests.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = false;
                        }
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    while (_timeHigh <= timeHigh) {
                        while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                            //compute offer
                            if (nextOffer.deals.length > 0) {
                                if (nextIsOffer) {
                                    deals = nextOffer.deals;
                                    for (q = 0; q < deals.length; q++) {
                                        amount = parseFloat(utils_1.weiToEther(deals[q].sellAmount));
                                        dayCounter = dayCounter + amount;
                                        weekCounter = weekCounter + amount;
                                        monthCounter = monthCounter + amount;
                                        array = [];
                                        array.push(new Date(deals[q].timestamp * 1000));
                                        array.push(timeConverter(deals[q].offer.timestamp));
                                        array.push(timeConverter(deals[q].timestamp));
                                        array.push(deals[q].offer.buyToken.tokenSymbol);
                                        if (deals[q].seller.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].seller.name);
                                        }
                                        if (deals[q].buyer.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].buyer.name);
                                        }
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                                        offersRows.push(array);
                                        //1 DEAL per iteration
                                    }
                                }
                                else {
                                    deals = nextOffer.deals;
                                    for (q = 0; q < deals.length; q++) {
                                        amount = parseFloat(utils_1.weiToEther(deals[q].buyAmount));
                                        dayCounter = dayCounter + amount;
                                        weekCounter = weekCounter + amount;
                                        monthCounter = monthCounter + amount;
                                        array = [];
                                        array.push(new Date(deals[q].timestamp * 1000));
                                        array.push(timeConverter(deals[q].offer.timestamp));
                                        array.push(timeConverter(deals[q].timestamp));
                                        array.push(deals[q].offer.sellToken.tokenSymbol);
                                        if (deals[q].seller.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].seller.name);
                                        }
                                        if (deals[q].buyer.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].buyer.name);
                                        }
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                                        requestsRows.push(array);
                                        //1 DEAL per iteration
                                    }
                                }
                            }
                            //pop new offer
                            if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                                nextOffer = dayRequests.pop();
                                nextTimestamp = nextOffer.timestamp;
                                nextIsOffer = false;
                            }
                            else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                                nextOffer = dayOffers.pop();
                                nextTimestamp = nextOffer.timestamp;
                                nextIsOffer = true;
                            }
                            else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                                nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                                nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                                if (nextOfferTimestamp < nextRequestTimestamp) {
                                    nextOffer = dayOffers.pop();
                                    nextTimestamp = nextOffer.timestamp;
                                    nextIsOffer = true;
                                }
                                else {
                                    nextOffer = dayRequests.pop();
                                    nextTimestamp = nextOffer.timestamp;
                                    nextIsOffer = false;
                                }
                            }
                            else {
                                nextTimestamp = 0;
                            }
                        }
                        //update week and month rates
                        weekRates = weekRates + rates[day - 1];
                        monthRates = monthRates + rates[day - 1];
                        if (rates[day - 1] == 0) {
                            weekZeros++;
                            monthZeros++;
                        }
                        //compute week
                        if (day == 7 * week) {
                            //WEEK
                            //calc week rate
                            if ((7 - weekZeros) == 0) {
                                weekRates = 0;
                            }
                            else {
                                weekRates = weekRates / (7 - weekZeros);
                            }
                            weekRow_2 = [];
                            weekRow_2.push(week);
                            weekRow_2.push(weekCounter);
                            weekRow_2.push(weekCounter * weekRates);
                            weekRow_2.push(weekRates);
                            weekRows.push(weekRow_2);
                            weekCounter = 0;
                            weekRates = 0;
                            weekZeros = 0;
                            week++;
                        }
                        dayRow = [];
                        dayRow.push(day);
                        dayRow.push(dayCounter);
                        dayRow.push(dayCounter * rates[day - 1]);
                        dayRow.push(rates[day - 1]);
                        dayRows.push(dayRow);
                        dayCounter = 0;
                        day++;
                        _timeLow = _timeHigh;
                        _timeHigh = _timeLow + ONE_UTC_DAY;
                    }
                    weekRow = [];
                    //calc 5th week rates
                    if ((day - 29 - weekZeros) == 0) {
                        weekRates = 0;
                    }
                    else {
                        weekRates = weekRates / (day - 29 - weekZeros);
                    }
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    monthRow = [];
                    if ((day - 1 - monthZeros) == 0) {
                        monthRates = 0;
                    }
                    else {
                        monthRates = monthRates / (day - 1 - monthZeros);
                    }
                    monthRow.push(month);
                    monthRow.push(monthCounter);
                    monthRow.push(monthCounter * monthRates);
                    monthRow.push(monthRates);
                    monthRows.push(monthRow);
                    tableDay = 'TablaDay' + token.symbol;
                    tableWeek = 'TablaWeek' + token.symbol;
                    tableMonth = 'TablaMonth' + token.symbol;
                    addTable(sheet, tableDay, 'B3', [
                        { name: 'Día', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], dayRows);
                    addTable(sheet, tableWeek, 'G3', [
                        { name: 'Semana', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], weekRows);
                    addTable(sheet, tableMonth, 'L3', [
                        { name: 'Mes', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], monthRows);
                    sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
                    sheet.getCell('B36').font = { bold: true };
                    tableName = 'Tabla' + token.symbol;
                    if (offersRows.length == 0) {
                        offersRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName, 'B37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], offersRows);
                    sheet.getCell('K36').value = 'PACTOS (' + token.symbol + ' DEMANDADO)';
                    sheet.getCell('K36').font = { bold: true };
                    tableName2 = 'Tabla2' + token.symbol;
                    if (requestsRows.length == 0) {
                        requestsRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName2, 'K37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], requestsRows);
                    sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
                    sheet.getCell('C1').font = { bold: true };
                    sheet.getCell('B2').value = 'TOTAL (diario)';
                    sheet.getCell('B2').font = { bold: true };
                    sheet.getCell('G2').value = 'TOTAL (semanal)';
                    sheet.getCell('G2').font = { bold: true };
                    sheet.getCell('L2').value = 'TOTAL (mensual)';
                    sheet.getCell('L2').font = { bold: true };
                    return [2 /*return*/];
            }
        });
    });
}
function setPrimaryTokenDealsSheet(sheet, timeLow, timeHigh, monthIndex, year, toMonthIndex, toYear, url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var day, week, month, dayCounter, weekCounter, monthCounter, weekRates, monthRates, weekZeros, monthZeros, _timeLow, _timeHigh, dayRows, weekRows, monthRows, offersRows, requestsRows, dayOffers, dayRequests, rates, nextOffer, nextTimestamp, nextIsOffer, nextOfferTimestamp, nextRequestTimestamp, deals, q, amount, array, deals, q, amount, array, nextOfferTimestamp, nextRequestTimestamp, weekRow_3, dayRow, weekRow, monthRow, tableDayPrimary, tableWeekPrimary, tableMonthPrimary, tableName3, tableName4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = 1;
                    week = 1;
                    month = 1;
                    dayCounter = 0;
                    weekCounter = 0;
                    monthCounter = 0;
                    weekRates = 0;
                    monthRates = 0;
                    weekZeros = 0;
                    monthZeros = 0;
                    _timeLow = timeLow;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    dayRows = [];
                    weekRows = [];
                    monthRows = [];
                    offersRows = [];
                    requestsRows = [];
                    return [4 /*yield*/, try_getOffersPrimary(timeLow, timeHigh, token.address, url)];
                case 1:
                    dayOffers = _a.sent();
                    return [4 /*yield*/, try_getRequestsPrimary(timeLow, timeHigh, token.address, url)];
                case 2:
                    dayRequests = _a.sent();
                    return [4 /*yield*/, getDayRate(year, monthIndex, toYear, toMonthIndex, token.address, token.category)];
                case 3:
                    rates = _a.sent();
                    if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                    else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    }
                    else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                        nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                        nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                        if (nextOfferTimestamp < nextRequestTimestamp) {
                            nextOffer = dayOffers.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = true;
                        }
                        else {
                            nextOffer = dayRequests.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = false;
                        }
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    while (_timeHigh <= timeHigh) {
                        while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                            //compute offer
                            if (nextOffer.deals.length > 0) {
                                if (nextIsOffer) {
                                    deals = nextOffer.deals;
                                    for (q = 0; q < deals.length; q++) {
                                        amount = parseFloat(utils_1.weiToEther(deals[q].sellAmount));
                                        dayCounter = dayCounter + amount;
                                        weekCounter = weekCounter + amount;
                                        monthCounter = monthCounter + amount;
                                        array = [];
                                        array.push(new Date(deals[q].timestamp * 1000));
                                        array.push(timeConverter(deals[q].offer.timestamp));
                                        array.push(timeConverter(deals[q].timestamp));
                                        array.push(deals[q].offer.buyToken.tokenSymbol);
                                        if (deals[q].seller.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].seller.name);
                                        }
                                        if (deals[q].buyer.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].buyer.name);
                                        }
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                                        offersRows.push(array);
                                        //1 DEAL per iteration
                                    }
                                }
                                else {
                                    deals = nextOffer.deals;
                                    for (q = 0; q < deals.length; q++) {
                                        amount = parseFloat(utils_1.weiToEther(deals[q].buyAmount));
                                        dayCounter = dayCounter + amount;
                                        weekCounter = weekCounter + amount;
                                        monthCounter = monthCounter + amount;
                                        array = [];
                                        array.push(new Date(deals[q].timestamp * 1000));
                                        array.push(timeConverter(deals[q].offer.timestamp));
                                        array.push(timeConverter(deals[q].timestamp));
                                        array.push(deals[q].offer.sellToken.tokenSymbol);
                                        if (deals[q].seller.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].seller.name);
                                        }
                                        if (deals[q].buyer.name == null) {
                                            array.push("");
                                        }
                                        else {
                                            array.push(deals[q].buyer.name);
                                        }
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                                        array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                                        requestsRows.push(array);
                                        //1 DEAL per iteration
                                    }
                                }
                            }
                            //pop new offer
                            if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                                nextOffer = dayRequests.pop();
                                nextTimestamp = nextOffer.timestamp;
                                nextIsOffer = false;
                            }
                            else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                                nextOffer = dayOffers.pop();
                                nextTimestamp = nextOffer.timestamp;
                                nextIsOffer = true;
                            }
                            else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                                nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                                nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                                if (nextOfferTimestamp < nextRequestTimestamp) {
                                    nextOffer = dayOffers.pop();
                                    nextTimestamp = nextOffer.timestamp;
                                    nextIsOffer = true;
                                }
                                else {
                                    nextOffer = dayRequests.pop();
                                    nextTimestamp = nextOffer.timestamp;
                                    nextIsOffer = false;
                                }
                            }
                            else {
                                nextTimestamp = 0;
                            }
                        }
                        //update week and month rates
                        weekRates = weekRates + rates[day - 1];
                        monthRates = monthRates + rates[day - 1];
                        if (rates[day - 1] == 0) {
                            weekZeros++;
                            monthZeros++;
                        }
                        //compute week
                        if (day == 7 * week) {
                            //WEEK
                            //calc week rate
                            if ((7 - weekZeros) == 0) {
                                weekRates = 0;
                            }
                            else {
                                weekRates = weekRates / (7 - weekZeros);
                            }
                            weekRow_3 = [];
                            weekRow_3.push(week);
                            weekRow_3.push(weekCounter);
                            weekRow_3.push(weekCounter * weekRates);
                            weekRow_3.push(weekRates);
                            weekRows.push(weekRow_3);
                            weekCounter = 0;
                            weekRates = 0;
                            weekZeros = 0;
                            week++;
                        }
                        dayRow = [];
                        dayRow.push(day);
                        dayRow.push(dayCounter);
                        dayRow.push(dayCounter * rates[day - 1]);
                        dayRow.push(rates[day - 1]);
                        dayRows.push(dayRow);
                        dayCounter = 0;
                        day++;
                        _timeLow = _timeHigh;
                        _timeHigh = _timeLow + ONE_UTC_DAY;
                    }
                    weekRow = [];
                    //calc 5th week rates
                    if ((day - 29 - weekZeros) == 0) {
                        weekRates = 0;
                    }
                    else {
                        weekRates = weekRates / (day - 29 - weekZeros);
                    }
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    monthRow = [];
                    if ((day - 1 - monthZeros) == 0) {
                        monthRates = 0;
                    }
                    else {
                        monthRates = monthRates / (day - 1 - monthZeros);
                    }
                    monthRow.push(month);
                    monthRow.push(monthCounter);
                    monthRow.push(monthCounter * monthRates);
                    monthRow.push(monthRates);
                    monthRows.push(monthRow);
                    tableDayPrimary = 'TablaDayPrimary' + token.symbol;
                    tableWeekPrimary = 'TablaWeekPrimary' + token.symbol;
                    tableMonthPrimary = 'TablaMonthPrimary' + token.symbol;
                    addTable(sheet, tableDayPrimary, 'B3', [
                        { name: 'Día', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], dayRows);
                    addTable(sheet, tableWeekPrimary, 'G3', [
                        { name: 'Semana', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], weekRows);
                    addTable(sheet, tableMonthPrimary, 'L3', [
                        { name: 'Mes', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], monthRows);
                    sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
                    sheet.getCell('B36').font = { bold: true };
                    tableName3 = 'TablaPrimario' + token.symbol;
                    if (offersRows.length == 0) {
                        offersRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName3, 'B37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], offersRows);
                    sheet.getCell('K36').value = token.symbol + ' DEMANDADO';
                    sheet.getCell('K36').font = { bold: true };
                    tableName4 = 'TablaPrimario2' + token.symbol;
                    if (requestsRows.length == 0) {
                        requestsRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName4, 'K37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], requestsRows);
                    sheet.getCell('C1').value = 'Mercado P2P (Primario)';
                    sheet.getCell('C1').font = { bold: true };
                    sheet.getCell('B2').value = 'TOTAL (diario)';
                    sheet.getCell('B2').font = { bold: true };
                    sheet.getCell('G2').value = 'TOTAL (semanal)';
                    sheet.getCell('G2').font = { bold: true };
                    sheet.getCell('L2').value = 'TOTAL (mensual)';
                    sheet.getCell('L2').font = { bold: true };
                    return [2 /*return*/];
            }
        });
    });
}
function setPackableDealsSheet(sheet, timeLow, timeHigh, url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var day, week, month, dayCounter, weekCounter, monthCounter, dayCounterUsd, weekCounterUsd, monthCounterUsd, _timeLow, _timeHigh, dayRows, weekRows, monthRows, offersRows, requestsRows, dayOffers, dayRequests, nextOffer, nextTimestamp, nextIsOffer, nextOfferTimestamp, nextRequestTimestamp, deals, q, amount, buyAmount, usdAmount, array, deals, q, amount, sellAmount, usdAmount, array, nextOfferTimestamp, nextRequestTimestamp, weekRow_4, dayRow, weekRow, monthRow, tableDay, tableWeek, tableMonth, tableName, tableName2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = 1;
                    week = 1;
                    month = 1;
                    dayCounter = 0;
                    weekCounter = 0;
                    monthCounter = 0;
                    dayCounterUsd = 0;
                    weekCounterUsd = 0;
                    monthCounterUsd = 0;
                    _timeLow = timeLow;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    dayRows = [];
                    weekRows = [];
                    monthRows = [];
                    offersRows = [];
                    requestsRows = [];
                    return [4 /*yield*/, try_getPackableOffers(timeLow, timeHigh, token.address, url)];
                case 1:
                    dayOffers = _a.sent();
                    return [4 /*yield*/, try_getPackableRequests(timeLow, timeHigh, token.address, url)];
                case 2:
                    dayRequests = _a.sent();
                    if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                    else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    }
                    else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                        nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                        nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                        if (nextOfferTimestamp < nextRequestTimestamp) {
                            nextOffer = dayOffers.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = true;
                        }
                        else {
                            nextOffer = dayRequests.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = false;
                        }
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    _a.label = 3;
                case 3:
                    if (!(_timeHigh <= timeHigh)) return [3 /*break*/, 19];
                    _a.label = 4;
                case 4:
                    if (!((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh))) return [3 /*break*/, 18];
                    if (!(nextOffer.deals.length > 0)) return [3 /*break*/, 17];
                    if (!nextIsOffer) return [3 /*break*/, 11];
                    deals = nextOffer.deals;
                    q = 0;
                    _a.label = 5;
                case 5:
                    if (!(q < deals.length)) return [3 /*break*/, 10];
                    amount = parseFloat(utils_1.weiToEther(deals[q].sellAmount));
                    buyAmount = parseFloat(utils_1.weiToEther(deals[q].buyAmount));
                    dayCounter = dayCounter + amount;
                    weekCounter = weekCounter + amount;
                    monthCounter = monthCounter + amount;
                    usdAmount = 0;
                    if (!((deals[q].offer.buyToken.id == Constants.USD.address) ||
                        (deals[q].offer.buyToken.id == Constants.USC.address) ||
                        (deals[q].offer.buyToken.id == Constants.PEL.address))) return [3 /*break*/, 6];
                    usdAmount = buyAmount;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, convertToUsd(buyAmount, deals[q].offer.buyToken.id, deals[q].timestamp)];
                case 7:
                    usdAmount = _a.sent();
                    _a.label = 8;
                case 8:
                    dayCounterUsd = dayCounterUsd + usdAmount;
                    weekCounterUsd = weekCounterUsd + usdAmount;
                    monthCounterUsd = monthCounterUsd + usdAmount;
                    array = [];
                    array.push(new Date(deals[q].timestamp * 1000));
                    array.push(timeConverter(deals[q].offer.timestamp));
                    array.push(timeConverter(deals[q].timestamp));
                    array.push(deals[q].offer.buyToken.tokenSymbol);
                    if (deals[q].seller.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].seller.name);
                    }
                    if (deals[q].buyer.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].buyer.name);
                    }
                    array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                    array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                    offersRows.push(array);
                    _a.label = 9;
                case 9:
                    q++;
                    return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 17];
                case 11:
                    deals = nextOffer.deals;
                    q = 0;
                    _a.label = 12;
                case 12:
                    if (!(q < deals.length)) return [3 /*break*/, 17];
                    amount = parseFloat(utils_1.weiToEther(deals[q].buyAmount));
                    sellAmount = parseFloat(utils_1.weiToEther(deals[q].sellAmount));
                    dayCounter = dayCounter + amount;
                    weekCounter = weekCounter + amount;
                    monthCounter = monthCounter + amount;
                    usdAmount = 0;
                    if (!((deals[q].offer.sellToken.id == Constants.USD.address) ||
                        (deals[q].offer.sellToken.id == Constants.USC.address) ||
                        (deals[q].offer.sellToken.id == Constants.PEL.address))) return [3 /*break*/, 13];
                    usdAmount = sellAmount;
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, convertToUsd(sellAmount, deals[q].offer.sellToken.id, deals[q].timestamp)];
                case 14:
                    usdAmount = _a.sent();
                    _a.label = 15;
                case 15:
                    dayCounterUsd = dayCounterUsd + usdAmount;
                    weekCounterUsd = weekCounterUsd + usdAmount;
                    monthCounterUsd = monthCounterUsd + usdAmount;
                    array = [];
                    array.push(new Date(deals[q].timestamp * 1000));
                    array.push(timeConverter(deals[q].offer.timestamp));
                    array.push(timeConverter(deals[q].timestamp));
                    array.push(deals[q].offer.sellToken.tokenSymbol);
                    if (deals[q].seller.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].seller.name);
                    }
                    if (deals[q].buyer.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].buyer.name);
                    }
                    array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                    array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                    requestsRows.push(array);
                    _a.label = 16;
                case 16:
                    q++;
                    return [3 /*break*/, 12];
                case 17:
                    //pop new offer
                    if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                    else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    }
                    else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                        nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                        nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                        if (nextOfferTimestamp < nextRequestTimestamp) {
                            nextOffer = dayOffers.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = true;
                        }
                        else {
                            nextOffer = dayRequests.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = false;
                        }
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    return [3 /*break*/, 4];
                case 18:
                    //compute week
                    if (day == 7 * week) {
                        weekRow_4 = [];
                        //secondary
                        weekRow_4.push(week);
                        weekRow_4.push(weekCounter);
                        weekRow_4.push(weekCounterUsd);
                        if (weekCounter == 0)
                            weekCounter = 1;
                        weekRow_4.push(weekCounterUsd / weekCounter);
                        weekRows.push(weekRow_4);
                        weekCounter = 0;
                        weekCounterUsd = 0;
                        week++;
                    }
                    dayRow = [];
                    dayRow.push(day);
                    dayRow.push(dayCounter);
                    dayRow.push(dayCounterUsd);
                    if (dayCounter == 0)
                        dayCounter = 1;
                    dayRow.push(dayCounterUsd / dayCounter);
                    dayRows.push(dayRow);
                    dayCounter = 0;
                    dayCounterUsd = 0;
                    day++;
                    _timeLow = _timeHigh;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    return [3 /*break*/, 3];
                case 19:
                    weekRow = [];
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounterUsd);
                    if (weekCounter == 0)
                        weekCounter = 1;
                    weekRow.push(weekCounterUsd / weekCounter);
                    weekRows.push(weekRow);
                    monthRow = [];
                    monthRow.push(month);
                    monthRow.push(monthCounter);
                    monthRow.push(monthCounterUsd);
                    if (monthCounter == 0)
                        monthCounter = 1;
                    monthRow.push(monthCounterUsd / monthCounter);
                    monthRows.push(monthRow);
                    tableDay = 'TablaDay' + token.symbol;
                    tableWeek = 'TablaWeek' + token.symbol;
                    tableMonth = 'TablaMonth' + token.symbol;
                    addTable(sheet, tableDay, 'B3', [
                        { name: 'Día', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], dayRows);
                    addTable(sheet, tableWeek, 'G3', [
                        { name: 'Semana', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], weekRows);
                    addTable(sheet, tableMonth, 'L3', [
                        { name: 'Mes', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], monthRows);
                    sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
                    sheet.getCell('B36').font = { bold: true };
                    tableName = 'Tabla' + token.symbol;
                    if (offersRows.length == 0) {
                        offersRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName, 'B37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], offersRows);
                    sheet.getCell('K36').value = 'PACTOS (' + token.symbol + ' DEMANDADO)';
                    sheet.getCell('K36').font = { bold: true };
                    tableName2 = 'Tabla2' + token.symbol;
                    if (requestsRows.length == 0) {
                        requestsRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName2, 'K37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], requestsRows);
                    sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
                    sheet.getCell('C1').font = { bold: true };
                    sheet.getCell('B2').value = 'TOTAL (diario)';
                    sheet.getCell('B2').font = { bold: true };
                    sheet.getCell('G2').value = 'TOTAL (semanal)';
                    sheet.getCell('G2').font = { bold: true };
                    sheet.getCell('L2').value = 'TOTAL (mensual)';
                    sheet.getCell('L2').font = { bold: true };
                    return [2 /*return*/];
            }
        });
    });
}
function setPrimaryPackableDealsSheet(sheet, timeLow, timeHigh, url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var day, week, month, dayCounter, weekCounter, monthCounter, dayCounterUsd, weekCounterUsd, monthCounterUsd, _timeLow, _timeHigh, dayRows, weekRows, monthRows, offersRows, requestsRows, dayOffers, dayRequests, nextOffer, nextTimestamp, nextIsOffer, nextOfferTimestamp, nextRequestTimestamp, deals, q, amount, buyAmount, usdAmount, array, deals, q, amount, sellAmount, usdAmount, array, nextOfferTimestamp, nextRequestTimestamp, weekRow_5, dayRow, weekRow, monthRow, tableDayPrimary, tableWeekPrimary, tableMonthPrimary, tableName3, tableName4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = 1;
                    week = 1;
                    month = 1;
                    dayCounter = 0;
                    weekCounter = 0;
                    monthCounter = 0;
                    dayCounterUsd = 0;
                    weekCounterUsd = 0;
                    monthCounterUsd = 0;
                    _timeLow = timeLow;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    dayRows = [];
                    weekRows = [];
                    monthRows = [];
                    offersRows = [];
                    requestsRows = [];
                    return [4 /*yield*/, try_getPackableOffersPrimary(timeLow, timeHigh, token.address, url)];
                case 1:
                    dayOffers = _a.sent();
                    return [4 /*yield*/, try_getPackableRequestsPrimary(timeLow, timeHigh, token.address, url)];
                case 2:
                    dayRequests = _a.sent();
                    if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                    else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    }
                    else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                        nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                        nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                        if (nextOfferTimestamp < nextRequestTimestamp) {
                            nextOffer = dayOffers.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = true;
                        }
                        else {
                            nextOffer = dayRequests.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = false;
                        }
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    _a.label = 3;
                case 3:
                    if (!(_timeHigh <= timeHigh)) return [3 /*break*/, 19];
                    _a.label = 4;
                case 4:
                    if (!((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh))) return [3 /*break*/, 18];
                    if (!(nextOffer.deals.length > 0)) return [3 /*break*/, 17];
                    if (!nextIsOffer) return [3 /*break*/, 11];
                    deals = nextOffer.deals;
                    q = 0;
                    _a.label = 5;
                case 5:
                    if (!(q < deals.length)) return [3 /*break*/, 10];
                    amount = parseFloat(utils_1.weiToEther(deals[q].sellAmount));
                    buyAmount = parseFloat(utils_1.weiToEther(deals[q].buyAmount));
                    dayCounter = dayCounter + amount;
                    weekCounter = weekCounter + amount;
                    monthCounter = monthCounter + amount;
                    usdAmount = 0;
                    if (!((deals[q].offer.buyToken.id == Constants.USD.address) ||
                        (deals[q].offer.buyToken.id == Constants.USC.address) ||
                        (deals[q].offer.buyToken.id == Constants.PEL.address))) return [3 /*break*/, 6];
                    usdAmount = buyAmount;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, convertToUsd(buyAmount, deals[q].offer.buyToken.id, deals[q].timestamp)];
                case 7:
                    usdAmount = _a.sent();
                    _a.label = 8;
                case 8:
                    dayCounterUsd = dayCounterUsd + usdAmount;
                    weekCounterUsd = weekCounterUsd + usdAmount;
                    monthCounterUsd = monthCounterUsd + usdAmount;
                    array = [];
                    array.push(new Date(deals[q].timestamp * 1000));
                    array.push(timeConverter(deals[q].offer.timestamp));
                    array.push(timeConverter(deals[q].timestamp));
                    array.push(deals[q].offer.buyToken.tokenSymbol);
                    if (deals[q].seller.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].seller.name);
                    }
                    if (deals[q].buyer.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].buyer.name);
                    }
                    array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                    array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                    offersRows.push(array);
                    _a.label = 9;
                case 9:
                    q++;
                    return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 17];
                case 11:
                    deals = nextOffer.deals;
                    q = 0;
                    _a.label = 12;
                case 12:
                    if (!(q < deals.length)) return [3 /*break*/, 17];
                    amount = parseFloat(utils_1.weiToEther(deals[q].buyAmount));
                    sellAmount = parseFloat(utils_1.weiToEther(deals[q].sellAmount));
                    dayCounter = dayCounter + amount;
                    weekCounter = weekCounter + amount;
                    monthCounter = monthCounter + amount;
                    usdAmount = 0;
                    if (!((deals[q].offer.sellToken.id == Constants.USD.address) ||
                        (deals[q].offer.sellToken.id == Constants.USC.address) ||
                        (deals[q].offer.sellToken.id == Constants.PEL.address))) return [3 /*break*/, 13];
                    usdAmount = sellAmount;
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, convertToUsd(sellAmount, deals[q].offer.sellToken.id, deals[q].timestamp)];
                case 14:
                    usdAmount = _a.sent();
                    _a.label = 15;
                case 15:
                    dayCounterUsd = dayCounterUsd + usdAmount;
                    weekCounterUsd = weekCounterUsd + usdAmount;
                    monthCounterUsd = monthCounterUsd + usdAmount;
                    array = [];
                    array.push(new Date(deals[q].timestamp * 1000));
                    array.push(timeConverter(deals[q].offer.timestamp));
                    array.push(timeConverter(deals[q].timestamp));
                    array.push(deals[q].offer.sellToken.tokenSymbol);
                    if (deals[q].seller.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].seller.name);
                    }
                    if (deals[q].buyer.name == null) {
                        array.push("");
                    }
                    else {
                        array.push(deals[q].buyer.name);
                    }
                    array.push(parseFloat(utils_1.weiToEther(deals[q].buyAmount)));
                    array.push(parseFloat(utils_1.weiToEther(deals[q].sellAmount)));
                    requestsRows.push(array);
                    _a.label = 16;
                case 16:
                    q++;
                    return [3 /*break*/, 12];
                case 17:
                    //pop new offer
                    if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                    else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    }
                    else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                        nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                        nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
                        if (nextOfferTimestamp < nextRequestTimestamp) {
                            nextOffer = dayOffers.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = true;
                        }
                        else {
                            nextOffer = dayRequests.pop();
                            nextTimestamp = nextOffer.timestamp;
                            nextIsOffer = false;
                        }
                    }
                    else {
                        nextTimestamp = 0;
                    }
                    return [3 /*break*/, 4];
                case 18:
                    //compute week
                    if (day == 7 * week) {
                        weekRow_5 = [];
                        weekRow_5.push(week);
                        weekRow_5.push(weekCounter);
                        weekRow_5.push(weekCounterUsd);
                        if (weekCounter == 0)
                            weekCounter = 1;
                        weekRow_5.push(weekCounterUsd / weekCounter);
                        weekRows.push(weekRow_5);
                        weekCounter = 0;
                        weekCounterUsd = 0;
                        week++;
                    }
                    dayRow = [];
                    dayRow.push(day);
                    dayRow.push(dayCounter);
                    dayRow.push(dayCounterUsd);
                    if (dayCounter == 0)
                        dayCounter = 1;
                    dayRow.push(dayCounterUsd / dayCounter);
                    dayRows.push(dayRow);
                    dayCounter = 0;
                    dayCounterUsd = 0;
                    day++;
                    _timeLow = _timeHigh;
                    _timeHigh = _timeLow + ONE_UTC_DAY;
                    return [3 /*break*/, 3];
                case 19:
                    weekRow = [];
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounterUsd);
                    if (weekCounter == 0)
                        weekCounter = 1;
                    weekRow.push(weekCounterUsd / weekCounter);
                    weekRows.push(weekRow);
                    monthRow = [];
                    monthRow.push(month);
                    monthRow.push(monthCounter);
                    monthRow.push(monthCounterUsd);
                    if (monthCounter == 0)
                        monthCounter = 1;
                    monthRow.push(monthCounterUsd / monthCounter);
                    monthRows.push(monthRow);
                    tableDayPrimary = 'TablaDayPrimary' + token.symbol;
                    tableWeekPrimary = 'TablaWeekPrimary' + token.symbol;
                    tableMonthPrimary = 'TablaMonthPrimary' + token.symbol;
                    addTable(sheet, tableDayPrimary, 'B3', [
                        { name: 'Día', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], dayRows);
                    addTable(sheet, tableWeekPrimary, 'G3', [
                        { name: 'Semana', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], weekRows);
                    addTable(sheet, tableMonthPrimary, 'L3', [
                        { name: 'Mes', filterButton: true },
                        { name: 'Monto', totalsRowFunction: 'sum' },
                        { name: 'Monto (USD)', totalsRowFunction: 'sum' },
                        { name: 'Tipo de cambio' }
                    ], monthRows);
                    sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
                    sheet.getCell('B36').font = { bold: true };
                    tableName3 = 'TablaPrimario' + token.symbol;
                    if (offersRows.length == 0) {
                        offersRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName3, 'B37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], offersRows);
                    sheet.getCell('K36').value = token.symbol + ' DEMANDADO';
                    sheet.getCell('K36').font = { bold: true };
                    tableName4 = 'TablaPrimario2' + token.symbol;
                    if (requestsRows.length == 0) {
                        requestsRows = getEmtpyDeal();
                    }
                    addTable(sheet, tableName4, 'K37', [
                        { name: 'Fecha (pacto)', filterButton: true },
                        { name: 'Hora (oferta)' },
                        { name: 'Hora (pacto)' },
                        { name: 'Contrapartida', filterButton: true },
                        { name: 'Vendedor (usuario)', filterButton: true },
                        { name: 'Comprador (usuario)', filterButton: true },
                        { name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum' },
                        { name: 'Monto contrapartida', totalsRowFunction: 'sum' }
                    ], requestsRows);
                    sheet.getCell('C1').value = 'Mercado P2P (Primario)';
                    sheet.getCell('C1').font = { bold: true };
                    sheet.getCell('B2').value = 'TOTAL (diario)';
                    sheet.getCell('B2').font = { bold: true };
                    sheet.getCell('G2').value = 'TOTAL (semanal)';
                    sheet.getCell('G2').font = { bold: true };
                    sheet.getCell('L2').value = 'TOTAL (mensual)';
                    sheet.getCell('L2').font = { bold: true };
                    return [2 /*return*/];
            }
        });
    });
}
function try_getTransactions(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var transactions, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getTransactions(_timeLow, _timeHigh, token, url)];
                case 1:
                    transactions = _a.sent();
                    return [2 /*return*/, transactions];
                case 2:
                    error_10 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getTransactions(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    transactions = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, transactions];
                case 4:
                    console.error(error_10);
                    throw new Error(error_10);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
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
function try_getOffers(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getOffers(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_11 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getOffers(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_11);
                    throw new Error(error_11);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getRequests(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getRequests(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_12 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getRequests(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_12);
                    throw new Error(error_12);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getOffersPrimary(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getOffersPrimary(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_13 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getOffersPrimary(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_13);
                    throw new Error(error_13);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getRequestsPrimary(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getRequestsPrimary(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_14 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getRequestsPrimary(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_14);
                    throw new Error(error_14);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getCollectableOffers(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getCollectableOffers(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_15 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getCollectableOffers(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_15);
                    throw new Error(error_15);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
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
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
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
function try_getCollectableOffersPrimary(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getCollectableOffersPrimary(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_16 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getCollectableOffersPrimary(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_16);
                    throw new Error(error_16);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
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
                    query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
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
function try_getPackableOffers(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getPackableOffers(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_17 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getPackableOffers(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_17);
                    throw new Error(error_17);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getPackableRequests(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getPackableRequests(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_18 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getPackableRequests(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_18);
                    throw new Error(error_18);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getPackableOffersPrimary(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getPackableOffersPrimary(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_19 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getPackableOffersPrimary(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_19);
                    throw new Error(error_19);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function try_getPackableRequestsPrimary(_timeLow, _timeHigh, token, url, retries) {
    if (retries === void 0) { retries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var offers, error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, getPackableRequestsPrimary(_timeLow, _timeHigh, token, url)];
                case 1:
                    offers = _a.sent();
                    return [2 /*return*/, offers];
                case 2:
                    error_20 = _a.sent();
                    if (!(retries < 10)) return [3 /*break*/, 4];
                    retries++;
                    console.log("-- REINTENTO DE QUERY: " + retries);
                    return [4 /*yield*/, try_getPackableRequestsPrimary(_timeLow, _timeHigh, token, url, retries + 1)];
                case 3:
                    offers = _a.sent();
                    console.log("-- REINTENTO EXITOSO --");
                    return [2 /*return*/, offers];
                case 4:
                    console.error(error_20);
                    throw new Error(error_20);
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
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
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
                    query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
function getPiPrice(_timeLow, _timeHigh, _url) {
    if (_url === void 0) { _url = 'mainnet'; }
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, queryService, response, queryPrices, prices, query_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = '{ prices (where: {timestamp_gte: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '} orderBy: timestamp, orderDirection:asc, first: 1000, skip: ' + skip + ') { id supply collateral piPrice collateralPrice timestamp } }';
                    queryService = new graph_1.Query('piprice', _url);
                    queryService.setCustomQuery(query);
                    return [4 /*yield*/, queryService.request()];
                case 1:
                    response = _a.sent();
                    queryPrices = response.prices;
                    prices = queryPrices;
                    _a.label = 2;
                case 2:
                    if (!(queryPrices.length >= 1000)) return [3 /*break*/, 4];
                    skip = prices.length;
                    query_1 = '{ prices (where: {timestamp_gte: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '} orderBy: timestamp, orderDirection:asc, first: 1000, skip: ' + skip + ') { id supply collateral piPrice collateralPrice timestamp } }';
                    queryService.setCustomQuery(query_1);
                    return [4 /*yield*/, queryService.request()];
                case 3:
                    response = _a.sent();
                    queryPrices = response.offerPackables;
                    prices = prices.concat(queryPrices);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, prices];
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
function getUtcTime() {
    return Date.now() / 1000;
}
function getUtcTimeFromDate(year, month, day) {
    var timeDate = new Date(year, month - 1, day);
    var utcTime = timeDate.getTime() / 1000;
    return utcTime;
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
function getEmtpyDeal() {
    var rows = [];
    var array = [];
    array.push(new Date());
    array.push("");
    array.push("");
    array.push("");
    array.push("");
    array.push("");
    array.push(0);
    array.push(0);
    rows.push(array);
    return rows;
}
function getEmptyTransaction() {
    var rows = [];
    var array = [];
    array.push(new Date());
    array.push("");
    array.push("");
    array.push("");
    array.push("");
    array.push("");
    array.push(0);
    rows.push(array);
    return rows;
}
function getEndPointDates(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var dayAfter = +UNIX_timestamp + +ONE_UTC_DAY;
    var b = new Date(dayAfter * 1000);
    var toYear = b.getFullYear();
    var toMonth = b.getMonth() + 1;
    var toDate = b.getDate();
    var from = year + '-' + month + '-' + date;
    var to = toYear + '-' + toMonth + '-' + toDate;
    return [from, to];
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
function getDayRate(fromYear, fromMonth, toYear, toMonth, token, tokenCategory) {
    return __awaiter(this, void 0, void 0, function () {
        var from, to, responseData, rates, factor, i, len, j, error_21, dates, rates, responseData, i, len, j, rates2, rates3, j, error_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((tokenCategory == 1) &&
                        (token != Constants.PI.address) &&
                        (token != Constants.USD.address) &&
                        (token != Constants.USC.address) &&
                        (token != Constants.PEL.address))) return [3 /*break*/, 5];
                    from = fromYear + "-" + fromMonth + "-01";
                    to = toYear + "-" + toMonth + "-01";
                    responseData = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, requestRateEndPoint(from, to, token)];
                case 2:
                    responseData = _a.sent();
                    rates = [];
                    factor = 1;
                    switch (token) {
                        case Constants.GLDX.address:
                            factor = 33.1034768;
                            break;
                        case Constants.GLDS.address:
                            factor = 33.1034768;
                            break;
                        default:
                            break;
                    }
                    for (i = 23; i < responseData.length; i = i + 24) {
                        if ((token == Constants.BTC.address) ||
                            (token == Constants.ETH.address) ||
                            (token == Constants.USDT.address)) {
                            rates.push(responseData[i].rate / factor);
                        }
                        else {
                            rates.push((1 / (responseData[i].rate)) / factor);
                        }
                    }
                    len = 31 - rates.length;
                    if (len > 0) {
                        for (j = 0; j < len; j++) {
                            rates.push(0);
                        }
                    }
                    return [2 /*return*/, rates];
                case 3:
                    error_21 = _a.sent();
                    console.error(error_21);
                    throw new Error(error_21);
                case 4: return [3 /*break*/, 13];
                case 5:
                    if (!((token == Constants.USD.address) ||
                        (token == Constants.USC.address) ||
                        (token == Constants.PEL.address))) return [3 /*break*/, 6];
                    return [2 /*return*/, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
                case 6:
                    if (!(token == Constants.PI.address)) return [3 /*break*/, 12];
                    dates = convertMonthAndYearToUTC(fromYear, fromMonth, toYear, toMonth);
                    rates = [];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, getPiPrice(dates[0], dates[1], 'mainnet')];
                case 8:
                    responseData = _a.sent();
                    for (i = 22; i < responseData.length; i = i + 24) {
                        rates.push(responseData[i].piPrice);
                    }
                    len = 31 - rates.length;
                    if (len > 0) {
                        for (j = 0; j < len; j++) {
                            rates.push(0);
                        }
                    }
                    return [4 /*yield*/, getDayRate(fromYear, fromMonth, toYear, toMonth, Constants.BTC.address, Constants.BTC.category)];
                case 9:
                    rates2 = _a.sent();
                    rates3 = [];
                    for (j = 0; j < rates.length; j++) {
                        rates3.push(rates[j] * rates2[j]);
                    }
                    return [2 /*return*/, rates3];
                case 10:
                    error_22 = _a.sent();
                    console.error(error_22);
                    throw new Error(error_22);
                case 11: return [3 /*break*/, 13];
                case 12: return [2 /*return*/, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function convertMonthAndYearToUTC(fromYear, fromMonth, toYear, toMonth) {
    var fromDate = new Date();
    fromDate.setFullYear(fromYear);
    fromDate.setMonth(fromMonth - 1);
    fromDate.setDate(1);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    var toDate = new Date();
    toDate.setFullYear(toYear);
    toDate.setMonth(toMonth - 1);
    toDate.setDate(1);
    toDate.setHours(0);
    toDate.setMinutes(0);
    toDate.setSeconds(0);
    toDate.setMilliseconds(0);
    return [Math.floor(fromDate.getTime() / 1000), Math.floor(toDate.getTime() / 1000)];
}
function convertToUsd(amount, token, timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var endPointDates, from, to, rates, rate, rates2, rate2, rates, rate, factor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endPointDates = getEndPointDates(timestamp);
                    from = endPointDates[0];
                    to = endPointDates[1];
                    if (!(token == Constants.PI.address)) return [3 /*break*/, 5];
                    return [4 /*yield*/, getPiPrice(timestamp, (timestamp + ONE_UTC_DAY), 'mainnet')];
                case 1:
                    rates = _a.sent();
                    if (!(rates.length == 0)) return [3 /*break*/, 2];
                    return [2 /*return*/, 0];
                case 2:
                    rate = rates[rates.length - 1].piPrice;
                    return [4 /*yield*/, requestRateEndPoint(from, to, Constants.BTC.address)];
                case 3:
                    rates2 = _a.sent();
                    if (rates2.length == 0) {
                        return [2 /*return*/, 0];
                    }
                    else {
                        rate2 = rates2[rates2.length - 1].rate;
                        return [2 /*return*/, amount * rate * rate2];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, 0];
                case 5:
                    if (!((token == Constants.USD.address) ||
                        (token == Constants.USC.address) ||
                        (token == Constants.PEL.address))) return [3 /*break*/, 6];
                    return [2 /*return*/, amount];
                case 6: return [4 /*yield*/, requestRateEndPoint(from, to, token)];
                case 7:
                    rates = _a.sent();
                    if (rates.length == 0) {
                        return [2 /*return*/, 0];
                    }
                    else {
                        rate = rates[rates.length - 1].rate;
                        factor = 1;
                        switch (token) {
                            case Constants.GLDX.address:
                                factor = 33.1034768;
                                break;
                            case Constants.GLDS.address:
                                factor = 33.1034768;
                                break;
                            default:
                                break;
                        }
                        if ((token == Constants.BTC.address) ||
                            (token == Constants.ETH.address) ||
                            (token == Constants.USDT.address)) {
                            rate = 1 / rate;
                        }
                        return [2 /*return*/, amount / (rate * factor)];
                    }
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function requestRateEndPoint(from, to, token) {
    return __awaiter(this, void 0, void 0, function () {
        var endPoint, body, response, responseData, error_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endPoint = "https://api.pimarkets.io/v1/public/asset/exchange/rates/history";
                    body = JSON.stringify({ "from": from, "to": to, "asset_id": token });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, node_fetch_1["default"](endPoint, {
                            "method": 'POST',
                            "headers": {
                                "Accept": 'application/json',
                                'Content-Type': 'application/json'
                            },
                            "body": body,
                            "redirect": 'follow'
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    responseData = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, responseData];
                case 5:
                    error_23 = _a.sent();
                    console.error(error_23);
                    throw new Error(error_23);
                case 6: return [2 /*return*/];
            }
        });
    });
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
