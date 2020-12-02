//import ExcelJS from 'exceljs';
const ExcelJS = require('exceljs');
import * as Constants from './constants';
import { Query, QueryTemplates } from './graph';
import { weiToEther } from './utils';
import fetch from 'node-fetch';
const FileSaver = require('file-saver');

const ONE_UTC_DAY = 86400;

export class Report {

    public url: string;

    constructor(
        url: string = 'mainnet'
    ) {
        this.url = url;
    }

    async getTransactionReportV2(
        monthIndex: number,
        year: number,
        tokensArray: any[]
    ) {
        const workbook = new ExcelJS.Workbook();

        let toYear = year;
        let toMonthIndex = monthIndex + 1;

        if (monthIndex == 12) {
            toYear = year + 1;
            toMonthIndex = 1;
        }

        for (let i = 0; i < tokensArray.length; i++) {
            let rates = await getDayRate(
                year, 
                monthIndex, 
                toYear, 
                toMonthIndex, 
                tokensArray[i].address,
                tokensArray[i].category
            );
            let sheet = workbook.addWorksheet(tokensArray[i].symbol);
            /************************* */
            let day = 1;
            let week = 1;
            let month = 1;
            let dayCounter = 0;
            let weekCounter = 0;
            let weekRates = 0;
            let monthCounter = 0;
            let monthRates = 0;
            let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
            let timeHigh = getUtcTimeFromDate(year, monthIndex + 1, 1);

            let _timeLow = timeLow;
            let _timeHigh = _timeLow + ONE_UTC_DAY;
            let dayRows = [];
            let weekRows = [];
            let monthRows = [];

            while(_timeHigh <= timeHigh) {
                //DAYS
                let dayRow = [];
                let weekRow = [];
                
                let transactions = await getTransactions(_timeLow, _timeHigh, tokensArray[i].address, this.url);

                if (transactions.length > 0) {
                    
                    for (let j = 0; j < transactions.length; j++) {
                        let amount = parseFloat(weiToEther(transactions[j].amount));
                        dayCounter = dayCounter + amount;
                        weekCounter = weekCounter + amount;
                        monthCounter = monthCounter + amount;
                    }
                }

                weekRates = weekRates + rates[day - 1];
                monthRates = monthRates + rates[day - 1];

                if (day == 7 * week) {
                    //WEEKS
                    weekRates = weekRates / 7;
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    week++;
                    weekCounter = 0;
                    weekRates = 0;
                }

                dayRow.push(day);
                dayRow.push(dayCounter);
                dayRow.push(dayCounter * rates[day - 1]);
                dayRow.push(rates[day - 1]);
                dayRows.push(dayRow);
                day++;
                dayCounter = 0;
                _timeLow = _timeHigh;
                _timeHigh = _timeLow + ONE_UTC_DAY;
            }
            //MONTH
            let weekRow = [];
            let monthRow = [];
            weekRates = weekRates / (day - 29);
            weekRow.push(week);
            weekRow.push(weekCounter);
            weekRow.push(weekCounter * weekRates);
            weekRow.push(weekRates);
            weekRows.push(weekRow);
            monthRates = monthRates / (day - 1);
            monthRow.push(month);
            monthRow.push(monthCounter);
            monthRow.push(monthCounter * monthRates);
            monthRow.push(monthRates);
            monthRows.push(monthRow);

            let tableDay = 'TablaDay' + tokensArray[i].symbol;
            let tableWeek = 'TablaWeek' + tokensArray[i].symbol;
            let tableMonth = 'TablaMonth' + tokensArray[i].symbol;

            addTable(
                sheet,
                tableDay,
                'B2',
                [
                    {name: 'Día', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                dayRows
            );

            addTable(
                sheet,
                tableWeek,
                'G2',
                [
                    {name: 'Semana', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                weekRows
            );

            addTable(
                sheet,
                tableMonth,
                'L2',
                [
                    {name: 'Mes', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                monthRows
            );
            /************************* */
            let transactions = await getTransactions(timeLow, timeHigh, tokensArray[i].address, this.url);

            if (transactions.length > 0) {
                let rows = [];

                for (let j = 0; j < transactions.length; j++) {
                    let array = [];
                    
                    
                    array.push(new Date(transactions[j].timestamp * 1000));
                    array.push(transactions[j].currency.tokenSymbol);
                    array.push(transactions[j].from.id);

                    if (transactions[j].from.name == null) {
                        array.push("");
                    } else {
                        array.push(transactions[j].from.name.id);
                    }

                    array.push(transactions[j].to.id);

                    if (transactions[j].to.name == null) {
                        array.push("");
                    } else {
                        array.push(transactions[j].to.name.id);
                    }

                    array.push(parseFloat(weiToEther(transactions[j].amount)));
                    rows.push(array);
                }

                let tableName = 'Tabla' + tokensArray[i].symbol;

                addTable(
                    sheet,
                    tableName,
                    'B36',
                    [
                        {name: 'Fecha', filterButton: true},
                        {name: 'Divisa'},
                        {name: 'Origen (wallet)'},
                        {name: 'Origen (usuario)', filterButton: true},
                        {name: 'Destino (wallet)'},
                        {name: 'Destino (usuario)', filterButton: true},
                        {name: 'Monto', totalsRowFunction: 'sum'}
                    ],
                    rows
                );

                sheet.getCell('B35').value = 'TRANSFERENCIAS';
                sheet.getCell('B35').font = {bold: true};
                
                sheet.getCell('B1').value = 'PROMEDIO (diario)';
                sheet.getCell('B1').font = {bold: true};
                
                sheet.getCell('G1').value = 'PROMEDIO (semanal)';
                sheet.getCell('G1').font = {bold: true};

                sheet.getCell('L1').value = 'PROMEDIO (mensual)';
                sheet.getCell('L1').font = {bold: true};
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsTransactionsReportV2.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTransactionsReportV2.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getTransactionReport(
        timeLow: number,
        timeHigh: number,
        tokensArray: any[]
    ) {
        const workbook = new ExcelJS.Workbook();

        for (let i = 0; i < tokensArray.length; i++) {
            let sheet = workbook.addWorksheet(tokensArray[i].symbol);
            let transactions = await getTransactions(timeLow, timeHigh, tokensArray[i].address, this.url);

            if (transactions.length > 0) {
                let rows = [];

                for (let j = 0; j < transactions.length; j++) {
                    let array = [];
                    
                    
                    array.push(new Date(transactions[j].timestamp * 1000));
                    array.push(transactions[j].currency.tokenSymbol);
                    array.push(transactions[j].from.id);

                    if (transactions[j].from.name == null) {
                        array.push("");
                    } else {
                        array.push(transactions[j].from.name.id);
                    }

                    array.push(transactions[j].to.id);

                    if (transactions[j].to.name == null) {
                        array.push("");
                    } else {
                        array.push(transactions[j].to.name.id);
                    }

                    array.push(parseFloat(weiToEther(transactions[j].amount)));
                    rows.push(array);
                }

                let tableName = 'Tabla' + tokensArray[i].symbol;

                addTable(
                    sheet,
                    tableName,
                    'B2',
                    [
                        {name: 'Fecha', filterButton: true},
                        {name: 'Divisa'},
                        {name: 'Origen (wallet)'},
                        {name: 'Origen (usuario)', filterButton: true},
                        {name: 'Destino (wallet)'},
                        {name: 'Destino (usuario)', filterButton: true},
                        {name: 'Monto', totalsRowFunction: 'sum'}
                    ],
                    rows
                );
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsTransactionsReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTransactionsReport.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getTokenHoldersReport(
        orderBy: string,
        orderDirection: "desc" | "asc",
        tokensArray: any[]
    ) {
        const first = 1000;
        let skip = 0;
        let queryTemplates = new QueryTemplates(this.url);
        const workbook = new ExcelJS.Workbook();
    
        for (let i = 0; i < tokensArray.length; i++) {
            let response = await queryTemplates.getTokenHolders(
                orderBy,
                orderDirection,
                first,
                skip,
                tokensArray[i].address
            );
    
            let loopresponse = response;
    
            while(loopresponse.length >= 1000) {
                skip = response.length;
                response = await queryTemplates.getTokenHolders(
                    orderBy,
                    orderDirection,
                    first,
                    skip,
                    tokensArray[i].address
                );
                response = response.concat(loopresponse);
            }
    
            let sheet = workbook.addWorksheet(tokensArray[i].symbol);
            sheet.getCell('B2').value = 'TOKEN';
            sheet.getCell('B3').value = 'FECHA';
            sheet.getCell('B2').font = {bold: true};
            sheet.getCell('B3').font = {bold: true};
            sheet.getCell('C2').value = tokensArray[i].symbol;
            sheet.getCell('C3').value = getTime();
            sheet.getCell('C6').value = 'HOLDERS';
            sheet.getCell('C6').font = {bold: true};
    
            let rows = [];
    
            for (let j = 0; j < response.length; j++) {
                let array = [];
                
                if (response[j].wallet.name == null) {
                    array.push("");
                } else {
                    array.push(response[j].wallet.name.id);
                }
                
                array.push(response[j].wallet.id);
                array.push(parseFloat(weiToEther(response[j].balance)));
                rows.push(array);
            }
    
            let tableName = 'Tabla' + tokensArray[i].symbol;
    
            await addTable(
                sheet,
                tableName,
                'B7',
                [
                    {name: 'Nombre', filterButton: true},
                    {name: 'Wallet'},
                    {name: 'Saldo', totalsRowFunction: 'sum'}
                ],
                rows
            );
    
            let skipOffers = 0;
    
            let offers = await queryTemplates.getOffers(
                'sellToken: "' + tokensArray[i].address + '", isOpen: true',
                'sellAmount',
                'desc',
                1000,
                skipOffers
            );
    
            let loopOffers = offers;
    
            while(loopOffers.length >= 1000) {
                skipOffers = offers.length;
                offers = await queryTemplates.getOffers(
                    'sellToken: "' + tokensArray[i].address + '", isOpen: true',
                    'sellAmount',
                    'desc',
                    1000,
                    skipOffers
                );
                offers = offers.concat(loopOffers);
            }
    
            if (offers.length > 0) {
                sheet.getCell('G6').value = 'OFERTAS P2P';
                sheet.getCell('G6').font = {bold: true};
                let rows2 = [];
    
                for (let k = 0; k < offers.length; k++) {
                    let array2 = [];
                    array2.push(offers[k].owner.name);
                    array2.push(offers[k].owner.id);
                    array2.push(parseFloat(weiToEther(offers[k].sellAmount)));
                    rows2.push(array2);
                }
    
                let tableName2 = 'P2P' + tokensArray[i].symbol;
    
                await addTable(
                    sheet,
                    tableName2,
                    'F7',
                    [
                        {name: 'Dueño de la oferta', filterButton: true},
                        {name: 'Wallet'},
                        {name: 'Cantidad ofertada', totalsRowFunction: 'sum'}
                    ],
                    rows2
                );
            }
        }
    
        try {
            await workbook.xlsx.writeFile('PiMarketsTokenHoldersReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenHoldersReport.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getPackableHoldersReport(
        orderBy: string,
        orderDirection: "desc" | "asc",
        tokensArray: any[],
        expiries: any[],
    ) {
        const first = 1000;
        let skip = 0;
        let queryTemplates = new QueryTemplates(this.url);
        const workbook = new ExcelJS.Workbook();
    
        for (let i = 0; i < tokensArray.length; i++) {
            let response = await queryTemplates.getPackableHolders(
                tokensArray[i].address,
                expiries[i][1],
                orderBy,
                orderDirection,
                first,
                skip
            );
    
            let loopresponse = response;
    
            while(loopresponse.length >= 1000) {
                skip = response.length;
                response = await queryTemplates.getPackableHolders(
                    tokensArray[i].address,
                    expiries[i][1],
                    orderBy,
                    orderDirection,
                    first,
                    skip
                );
                response = response.concat(loopresponse);
            }
    
            let sheet = workbook.addWorksheet(tokensArray[i].symbol + '-' + expiries[i][0]);
            sheet.getCell('B2').value = 'TOKEN';
            sheet.getCell('B3').value = 'VENCIMIENTO';
            sheet.getCell('B4').value = 'FECHA';
            sheet.getCell('B2').font = {bold: true};
            sheet.getCell('B3').font = {bold: true};
            sheet.getCell('B4').font = {bold: true};
            sheet.getCell('C2').value = tokensArray[i].symbol;
            sheet.getCell('C3').value = expiries[i][0];
            sheet.getCell('C4').value = getTime();
            sheet.getCell('C6').value = 'HOLDERS';
            sheet.getCell('C6').font = {bold: true};
    
            let rows = [];
    
            for (let j = 0; j < response.length; j++) {
                let array = [];
                if (response[j].wallet.name == null) {
                    array.push("");
                } else {
                    array.push(response[j].wallet.name.id);
                }
                array.push(response[j].wallet.id);
                array.push(parseInt(weiToEther(response[j].balance)));
                rows.push(array);
            }
    
            let tableName = 'Tabla' + tokensArray[i].symbol + expiries[i][0];
    
            await addTable(
                sheet,
                tableName,
                'B7',
                [
                    {name: 'Nombre', filterButton: true},
                    {name: 'Wallet'},
                    {name: 'Saldo', totalsRowFunction: 'sum'}
                ],
                rows
            );
    
            let skipOffers = 0;
    
            let offers = await queryTemplates.getPackableOffers(
                'sellToken: "' + tokensArray[i].address + '", sellId: "' + expiries[i][1] + '", isOpen: true',
                'sellAmount',
                'desc',
                1000,
                skipOffers
            );
    
            let loopOffers = offers;
    
            while(loopOffers.length >= 1000) {
                skipOffers = offers.length;
                offers = await queryTemplates.getPackableOffers(
                    'sellToken: "' + tokensArray[i].address + '", sellId: "' + expiries[i][1] + '", isOpen: true',
                    'sellAmount',
                    'desc',
                    1000,
                    skipOffers
                );
                offers = offers.concat(loopOffers);
            }
    
            if (offers.length > 0) {
                sheet.getCell('F6').value = 'NOTA: Si no coincide el saldo de Mercado P2P con el total ofertado hay que ver pactos pendientes';
                sheet.getCell('F6').font = {color: {argb: "ff0000"}};
                sheet.getCell('G5').value = 'OFERTAS P2P';
                sheet.getCell('G5').font = {bold: true};
                let rows2 = [];
    
                for (let k = 0; k < offers.length; k++) {
                    let array2 = [];
                    array2.push(offers[k].owner.name);
                    array2.push(offers[k].owner.id);
                    array2.push(parseInt(weiToEther(offers[k].sellAmount)));
                    rows2.push(array2);
                }
    
                let tableName2 = 'P2P' + tokensArray[i].symbol;
    
                await addTable(
                    sheet,
                    tableName2,
                    'F7',
                    [
                        {name: 'Dueño de la oferta', filterButton: true},
                        {name: 'Wallet'},
                        {name: 'Cantidad ofertada', totalsRowFunction: 'sum'}
                    ],
                    rows2
                );
            }
        }
    
        try {
            await workbook.xlsx.writeFile('PiMarketsPackableHoldersReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableHoldersReport.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getCollectableHoldersReport(
        orderBy: string,
        orderDirection: "desc" | "asc",
        tokensArray: any[]
    ) {
        const first = 1000;
        let skip = 0;
        let queryTemplates = new QueryTemplates(this.url);
        const workbook = new ExcelJS.Workbook();
    
        for (let i = 0; i < tokensArray.length; i++) {
            let response = await queryTemplates.getNFTHolders(
                orderBy,
                orderDirection,
                first,
                skip,
                tokensArray[i].address
            );
    
            let loopresponse = response;
    
            while(loopresponse.length >= 1000) {
                skip = response.length;
                response = await queryTemplates.getNFTHolders(
                    orderBy,
                    orderDirection,
                    first,
                    skip,
                    tokensArray[i].address
                );
                response = response.concat(loopresponse);
            }
    
            let sheet = workbook.addWorksheet(tokensArray[i].symbol);
            sheet.getCell('B2').value = 'TOKEN';
            sheet.getCell('B3').value = 'FECHA';
            sheet.getCell('B2').font = {bold: true};
            sheet.getCell('B3').font = {bold: true};
            sheet.getCell('C2').value = tokensArray[i].symbol;
            sheet.getCell('C3').value = getTime();
            sheet.getCell('C6').value = 'HOLDERS';
            sheet.getCell('C6').font = {bold: true};
    
            let rows = [];
    
            for (let j = 0; j < response.length; j++) {
                let array = [];
                
                if (response[j].wallet.name == null) {
                    array.push("");
                } else {
                    array.push(response[j].wallet.name.id);
                }
                
                array.push(response[j].wallet.id);
                array.push(parseFloat(weiToEther(response[j].balance)));
                rows.push(array);
            }
    
            let tableName = 'Tabla' + tokensArray[i].symbol;
    
            await addTable(
                sheet,
                tableName,
                'B7',
                [
                    {name: 'Nombre', filterButton: true},
                    {name: 'Wallet'},
                    {name: 'Saldo', totalsRowFunction: 'sum'}
                ],
                rows
            );
    
            let skipOffers = 0;
    
            let offers = await queryTemplates.getNFTOffers(
                'sellToken: "' + tokensArray[i].address + '", isOpen: true',
                'timestamp',
                'desc',
                1000,
                skipOffers
            );
    
            let loopOffers = offers;
    
            while(loopOffers.length >= 1000) {
                skipOffers = offers.length;
                offers = await queryTemplates.getNFTOffers(
                    'sellToken: "' + tokensArray[i].address + '", isOpen: true',
                    'timestamp',
                    'desc',
                    1000,
                    skipOffers
                );
                offers = offers.concat(loopOffers);
            }
    
            if (offers.length > 0) {
                sheet.getCell('G6').value = 'OFERTAS P2P';
                sheet.getCell('G6').font = {bold: true};
                let rows2 = [];
    
                for (let k = 0; k < offers.length; k++) {
                    let array2 = [];
                    array2.push(offers[k].owner.name);
                    array2.push(offers[k].owner.id);
                    array2.push(parseInt(weiToEther(offers[k].sellAmount)));
                    rows2.push(array2);
                }
    
                let tableName2 = 'P2P' + tokensArray[i].symbol;
    
                await addTable(
                    sheet,
                    tableName2,
                    'F7',
                    [
                        {name: 'Dueño de la oferta', filterButton: true},
                        {name: 'Wallet'},
                        {name: 'Cantidad ofertada', totalsRowFunction: 'sum'}
                    ],
                    rows2
                );
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsCollectableHoldersReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsCollectableHoldersReport.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getTokenDealsReportV2 (
        monthIndex: number,
        year: number,
        tokensArray: any[]
    ) {
        const workbook = new ExcelJS.Workbook();
        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(year, monthIndex + 1, 1);

        for (let i = 0; i < tokensArray.length; i++) {
            //init
            let sheet: any;
            let sheet2: any;

            let offers = await getOffers(timeLow, timeHigh, tokensArray[i].address, this.url);
            let offersPrimary = await getOffersPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requests = await getRequests(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requestsPrimary = await getRequestsPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
    
            sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
            sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
            sheet.getCell('C1').font = {bold: true};
            sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
            sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
            sheet2.getCell('C1').font = {bold: true};

            sheet.getCell('B2').value = 'PROMEDIO (diario)';
            sheet.getCell('B2').font = {bold: true};
            sheet2.getCell('B2').value = 'PROMEDIO (diario)';
            sheet2.getCell('B2').font = {bold: true};
            
            sheet.getCell('G2').value = 'PROMEDIO (semanal)';
            sheet.getCell('G2').font = {bold: true};
            sheet2.getCell('G2').value = 'PROMEDIO (semanal)';
            sheet2.getCell('G2').font = {bold: true};

            sheet.getCell('L2').value = 'PROMEDIO (mensual)';
            sheet.getCell('L2').font = {bold: true};
            sheet2.getCell('L2').value = 'PROMEDIO (mensual)';
            sheet2.getCell('L2').font = {bold: true};

            let toYear = year;
            let toMonthIndex = monthIndex + 1;

            if (monthIndex == 12) {
                toYear = year + 1;
                toMonthIndex = 1;
            }

            let rates = await getDayRate(
                year, 
                monthIndex, 
                toYear, 
                toMonthIndex, 
                tokensArray[i].address,
                tokensArray[i].category
            );

            //stats
            /************************* */
            let day = 1;
            let week = 1;
            let month = 1;
            let dayCounter = 0;
            let dayCounterPrimary = 0;
            let weekCounter = 0;
            let weekCounterPrimary = 0;
            let weekRates = 0;
            let monthCounter = 0;
            let monthCounterPrimary = 0;
            let monthRates = 0;

            let _timeLow = timeLow;
            let _timeHigh = _timeLow + ONE_UTC_DAY;
            let dayRows = [];
            let weekRows = [];
            let monthRows = [];
            let dayRowsPrimary = [];
            let weekRowsPrimary = [];
            let monthRowsPrimary = [];

            while(_timeHigh <= timeHigh) {
                //DAYS
                let dayRow = [];
                let weekRow = [];
                let dayRowPrimary = [];
                let weekRowPrimary = [];

                let dayOffers = await getOffers(_timeLow, _timeHigh, tokensArray[i].address, this.url);
                let dayOffersPrimary = await getOffersPrimary(_timeLow, _timeHigh, tokensArray[i].address, this.url);
                let dayRequests = await getRequests(_timeLow, _timeHigh, tokensArray[i].address, this.url);
                let dayRequestsPrimary = await getRequestsPrimary(_timeLow, _timeHigh, tokensArray[i].address, this.url);

                if (dayOffers.length > 0) {
                    for (let p = 0; p < dayOffers.length; p++) {
                        if (dayOffers[p].deals.length > 0) {
                            let deals = dayOffers[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].sellAmount));
                                dayCounter = dayCounter + amount;
                                weekCounter = weekCounter + amount;
                                monthCounter = monthCounter + amount;
                            }
                        }
                    }
                }

                if (dayOffersPrimary.length > 0) {
                    for (let p = 0; p < dayOffersPrimary.length; p++) {
                        if (dayOffersPrimary[p].deals.length > 0) {
                            let deals = dayOffersPrimary[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].sellAmount));
                                dayCounterPrimary = dayCounterPrimary + amount;
                                weekCounterPrimary = weekCounterPrimary + amount;
                                monthCounterPrimary = monthCounterPrimary + amount;
                            }
                        }
                    }
                }

                if (dayRequests.length > 0) {
                    for (let p = 0; p < dayRequests.length; p++) {
                        if (dayRequests[p].deals.length > 0) {
                            let deals = dayRequests[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].buyAmount));
                                dayCounter = dayCounter + amount;
                                weekCounter = weekCounter + amount;
                                monthCounter = monthCounter + amount;
                            }
                        }
                    }
                }

                if (dayRequestsPrimary.length > 0) {
                    for (let p = 0; p < dayRequestsPrimary.length; p++) {
                        if (dayRequestsPrimary[p].deals.length > 0) {
                            let deals = dayRequestsPrimary[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].buyAmount));
                                dayCounterPrimary = dayCounterPrimary + amount;
                                weekCounterPrimary = weekCounterPrimary + amount;
                                monthCounterPrimary = monthCounterPrimary + amount;
                            }
                        }
                    }
                }

                weekRates = weekRates + rates[day - 1];
                monthRates = monthRates + rates[day - 1];

                if (day == 7 * week) {
                    //WEEKS
                    weekRates = weekRates / 7;
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    //
                    weekRowPrimary.push(week);
                    weekRowPrimary.push(weekCounterPrimary);
                    weekRowPrimary.push(weekCounterPrimary * weekRates);
                    weekRowPrimary.push(weekRates);
                    weekRowsPrimary.push(weekRowPrimary);

                    week++;
                    weekCounter = 0;
                    weekCounterPrimary = 0;
                    weekRates = 0
                }

                dayRow.push(day);
                dayRow.push(dayCounter);
                dayRow.push(dayCounter * rates[day - 1]);
                dayRow.push(rates[day - 1]);
                dayRows.push(dayRow);
                //
                dayRowPrimary.push(day);
                dayRowPrimary.push(dayCounterPrimary);
                dayRowPrimary.push(dayCounterPrimary * rates[day - 1]);
                dayRowPrimary.push(rates[day - 1]);
                dayRowsPrimary.push(dayRowPrimary);

                day++;
                dayCounter = 0;
                dayCounterPrimary = 0;
                _timeLow = _timeHigh;
                _timeHigh = _timeLow + ONE_UTC_DAY;
            }
            //MONTH
            let weekRow = [];
            let monthRow = [];
            let weekRowPrimary = [];
            let monthRowPrimary = [];

            weekRates = weekRates / (day - 29);
            weekRow.push(week);
            weekRow.push(weekCounter);
            weekRow.push(weekCounter * weekRates);
            weekRow.push(weekRates);
            weekRows.push(weekRow);

            weekRowPrimary.push(week);
            weekRowPrimary.push(weekCounterPrimary);
            weekRowPrimary.push(weekCounterPrimary * weekRates);
            weekRowPrimary.push(weekRates);
            weekRowsPrimary.push(weekRowPrimary);

            monthRates = monthRates / (day - 1);
            monthRow.push(month);
            monthRow.push(monthCounter);
            monthRow.push(monthCounter * monthRates);
            monthRow.push(monthRates);
            monthRows.push(monthRow);

            monthRowPrimary.push(month);
            monthRowPrimary.push(monthCounterPrimary);
            monthRowPrimary.push(monthCounterPrimary * monthRates);
            monthRowPrimary.push(monthRates);
            monthRowsPrimary.push(monthRowPrimary);

            let tableDay = 'TablaDay' + tokensArray[i].symbol;
            let tableWeek = 'TablaWeek' + tokensArray[i].symbol;
            let tableMonth = 'TablaMonth' + tokensArray[i].symbol;
            let tableDayPrimary = 'TablaDayPrimary' + tokensArray[i].symbol;
            let tableWeekPrimary = 'TablaWeekPrimary' + tokensArray[i].symbol;
            let tableMonthPrimary = 'TablaMonthPrimary' + tokensArray[i].symbol;

            addTable(
                sheet,
                tableDay,
                'B3',
                [
                    {name: 'Día', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                dayRows
            );

            addTable(
                sheet,
                tableWeek,
                'G3',
                [
                    {name: 'Semana', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                weekRows
            );

            addTable(
                sheet,
                tableMonth,
                'L3',
                [
                    {name: 'Mes', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                monthRows
            );

            addTable(
                sheet2,
                tableDayPrimary,
                'B3',
                [
                    {name: 'Día', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                dayRowsPrimary
            );

            addTable(
                sheet2,
                tableWeekPrimary,
                'G3',
                [
                    {name: 'Semana', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                weekRowsPrimary
            );

            addTable(
                sheet2,
                tableMonthPrimary,
                'L3',
                [
                    {name: 'Mes', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                monthRowsPrimary
            );

            /************************* */

            //offers
            if (offers.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offers.length; j++) {
                    if (offers[j].deals.length > 0) {
                        let deals = offers[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('B36').value = 'PACTOS (' + tokensArray[i].symbol + ' OFERTADO)';
                        sheet.getCell('B36').font = {bold: true};
                        let tableName = 'Tabla' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'B37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }

            //requests
            if (requests.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requests.length; j++) {
                    if (requests[j].deals.length > 0) {
                        let deals = requests[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('K36').value = 'PACTOS (' + tokensArray[i].symbol + ' DEMANDADO)';
                        sheet.getCell('K36').font = {bold: true};
                        let tableName = 'Tabla2' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'K37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }

            //primaryoffers
            if (offersPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offersPrimary.length; j++) {
                    if (offersPrimary[j].deals.length > 0) {
                        let deals = offersPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('B36').value = 'PACTOS (' + tokensArray[i].symbol + ' OFERTADO)';
                        sheet2.getCell('B36').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'B37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }

            //primaryrequests
            if (requestsPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requestsPrimary.length; j++) {
                    if (requestsPrimary[j].deals.length > 0) {
                        let deals = requestsPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('K36').value = 'PACTOS (' + tokensArray[i].symbol + ' DEMANDADO)';
                        sheet2.getCell('K36').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'K37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsTokenDealsReportV2.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenDealsReportV2.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getTokenDealsReport(
        timeLow: number,
        timeHigh: number,
        tokensArray: any[]
    ) {
        const workbook = new ExcelJS.Workbook();
    
        for (let i = 0; i < tokensArray.length; i++) {
            let sheet: any;
            let sheet2: any;
            let offers = await getOffers(timeLow, timeHigh, tokensArray[i].address, this.url);
            let offersPrimary = await getOffersPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requests = await getRequests(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requestsPrimary = await getRequestsPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
    
            if ((offers.length > 0) || (requests.length > 0)) {
                sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
                sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
                sheet.getCell('C1').font = {bold: true};
            }
    
            if ((offersPrimary.length > 0) || (requestsPrimary.length > 0)) {
                sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
            
                sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
                sheet2.getCell('C1').font = {bold: true};
            }
    
            if (offers.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offers.length; j++) {
                    if (offers[j].deals.length > 0) {
                        let deals = offers[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet.getCell('B2').font = {bold: true};
                        let tableName = 'Tabla' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'B3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
    
            if (requests.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requests.length; j++) {
                    if (requests[j].deals.length > 0) {
                        let deals = requests[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('K2').font = {bold: true};
                        let tableName = 'Tabla2' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'K3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
    
            if (offersPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offersPrimary.length; j++) {
                    if (offersPrimary[j].deals.length > 0) {
                        let deals = offersPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet2.getCell('B2').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'B3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
    
            if (requestsPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requestsPrimary.length; j++) {
                    if (requestsPrimary[j].deals.length > 0) {
                        let deals = requestsPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('K2').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'K3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsTokenDealsReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenDealsReport.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getPackableDealsReportV2 (
        monthIndex: number,
        year: number,
        tokensArray: any[]
    ) {
        const workbook = new ExcelJS.Workbook();
        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(year, monthIndex + 1, 1);

        for (let i = 0; i < tokensArray.length; i++) {
            //init
            let sheet: any;
            let sheet2: any;
            let offers = await getPackableOffers(timeLow, timeHigh, tokensArray[i].address, this.url);
            let offersPrimary = await getPackableOffersPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requests = await getPackableRequests(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requestsPrimary = await getPackableRequestsPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
    
            sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
            sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
            sheet.getCell('C1').font = {bold: true};
            sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
            sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
            sheet2.getCell('C1').font = {bold: true};

            sheet.getCell('B2').value = 'PROMEDIO (diario)';
            sheet.getCell('B2').font = {bold: true};
            sheet2.getCell('B2').value = 'PROMEDIO (diario)';
            sheet2.getCell('B2').font = {bold: true};
            
            sheet.getCell('G2').value = 'PROMEDIO (semanal)';
            sheet.getCell('G2').font = {bold: true};
            sheet2.getCell('G2').value = 'PROMEDIO (semanal)';
            sheet2.getCell('G2').font = {bold: true};

            sheet.getCell('L2').value = 'PROMEDIO (mensual)';
            sheet.getCell('L2').font = {bold: true};
            sheet2.getCell('L2').value = 'PROMEDIO (mensual)';
            sheet2.getCell('L2').font = {bold: true};

            //stats
            /************************* */
            let day = 1;
            let week = 1;
            let month = 1;
            let dayCounter = 0;
            let dayCounterPrimary = 0;
            let dayRates = 0;
            let dayRatesPrimary = 0;
            let dayRatesOffers = 0;
            let dayRatesRequests = 0;
            let dayRatesPrimaryOffers = 0;
            let dayRatesPrimaryRequests = 0;
            let weekCounter = 0;
            let weekCounterPrimary = 0;
            let weekRates = 0;
            let weekRatesPrimary = 0;
            let monthCounter = 0;
            let monthCounterPrimary = 0;
            let monthRates = 0;
            let monthRatesPrimary = 0;
            let dayCounterUsd = 0;
            let dayCounterPrimaryUsd = 0;
            let weekCounterUsd = 0;
            let weekCounterPrimaryUsd = 0;
            let monthCounterUsd = 0;
            let monthCounterPrimaryUsd = 0;
            let dayRatesCounter = 0
            let dayRatesPrimaryCounter = 0
            let dayRatesCounter2 = 0
            let dayRatesPrimaryCounter2 = 0

            let _timeLow = timeLow;
            let _timeHigh = _timeLow + ONE_UTC_DAY;
            let dayRows = [];
            let weekRows = [];
            let monthRows = [];
            let dayRowsPrimary = [];
            let weekRowsPrimary = [];
            let monthRowsPrimary = [];

            while(_timeHigh <= timeHigh) {
                //DAYS
                let dayRow = [];
                let weekRow = [];
                let dayRowPrimary = [];
                let weekRowPrimary = [];
                
                let dayOffers = await getPackableOffers(_timeLow, _timeHigh, tokensArray[i].address, this.url);
                let dayOffersPrimary = await getPackableOffersPrimary(_timeLow, _timeHigh, tokensArray[i].address, this.url);
                let dayRequests = await getPackableRequests(_timeLow, _timeHigh, tokensArray[i].address, this.url);
                let dayRequestsPrimary = await getPackableRequestsPrimary(_timeLow, _timeHigh, tokensArray[i].address, this.url);

                if (dayOffers.length > 0) {
                    for (let p = 0; p < dayOffers.length; p++) {
                        if (dayOffers[p].deals.length > 0) {
                            let deals = dayOffers[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].sellAmount));
                                let buyAmount = parseFloat(weiToEther(deals[q].buyAmount));
                                dayCounter = dayCounter + amount;
                                weekCounter = weekCounter + amount;
                                monthCounter = monthCounter + amount;

                                let usdAmount = 0;

                                if (
                                    (deals[q].offer.buyToken.id == Constants.USD.address) ||
                                    (deals[q].offer.buyToken.id == Constants.USC.address) ||
                                    (deals[q].offer.buyToken.id == Constants.PEL.address)
                                ) {
                                    usdAmount = buyAmount;
                                } else {
                                    usdAmount = await convertToUsd(
                                        buyAmount, 
                                        deals[q].offer.buyToken.id,
                                        deals[q].timestamp
                                    );
                                }

                                dayCounterUsd = dayCounterUsd + usdAmount;
                                weekCounterUsd = weekCounterUsd + usdAmount;
                                monthCounterUsd = monthCounterUsd + usdAmount;
                                dayRatesOffers = dayRatesOffers + (usdAmount / amount);
                            }

                            dayRatesOffers = dayRatesOffers / deals.length;
                        }
                    }
                }

                if (dayOffersPrimary.length > 0) {
                    for (let p = 0; p < dayOffersPrimary.length; p++) {
                        if (dayOffersPrimary[p].deals.length > 0) {
                            let deals = dayOffersPrimary[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].sellAmount));
                                let buyAmount = parseFloat(weiToEther(deals[q].buyAmount));
                                dayCounterPrimary = dayCounterPrimary + amount;
                                weekCounterPrimary = weekCounterPrimary + amount;
                                monthCounterPrimary = monthCounterPrimary + amount;

                                let usdAmount = 0;

                                if (
                                    (deals[q].offer.buyToken.id == Constants.USD.address) ||
                                    (deals[q].offer.buyToken.id == Constants.USC.address) ||
                                    (deals[q].offer.buyToken.id == Constants.PEL.address)
                                ) {
                                    usdAmount = buyAmount;
                                } else {
                                    usdAmount = await convertToUsd(
                                        buyAmount, 
                                        deals[q].offer.buyToken.id,
                                        deals[q].timestamp
                                    );
                                }

                                dayCounterPrimaryUsd = dayCounterPrimaryUsd + usdAmount;
                                weekCounterPrimaryUsd = weekCounterPrimaryUsd + usdAmount;
                                monthCounterPrimaryUsd = monthCounterPrimaryUsd + usdAmount;
                                dayRatesPrimaryOffers = dayRatesPrimaryOffers + (usdAmount / amount);
                            }

                            dayRatesPrimaryOffers = dayRatesPrimaryOffers / deals.length;
                        }
                    }
                }

                if (dayRequests.length > 0) {
                    for (let p = 0; p < dayRequests.length; p++) {
                        if (dayRequests[p].deals.length > 0) {
                            let deals = dayRequests[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].buyAmount));
                                let sellAmount = parseFloat(weiToEther(deals[q].sellAmount));
                                dayCounter = dayCounter + amount;
                                weekCounter = weekCounter + amount;
                                monthCounter = monthCounter + amount;

                                let usdAmount = 0;

                                if (
                                    (deals[q].offer.sellToken.id == Constants.USD.address) ||
                                    (deals[q].offer.sellToken.id == Constants.USC.address) ||
                                    (deals[q].offer.sellToken.id == Constants.PEL.address)
                                ) {
                                    usdAmount = sellAmount;
                                } else {
                                    usdAmount = await convertToUsd(
                                        sellAmount, 
                                        deals[q].offer.sellToken.id,
                                        deals[q].timestamp
                                    );
                                }

                                dayCounterUsd = dayCounterUsd + usdAmount;
                                weekCounterUsd = weekCounterUsd + usdAmount;
                                monthCounterUsd = monthCounterUsd + usdAmount;
                                dayRatesRequests = dayRatesRequests + (usdAmount / amount);
                            }

                            dayRatesRequests = dayRatesRequests / deals.length;
                        }
                    }
                }

                if (dayRequestsPrimary.length > 0) {
                    for (let p = 0; p < dayRequestsPrimary.length; p++) {
                        if (dayRequestsPrimary[p].deals.length > 0) {
                            let deals = dayRequestsPrimary[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                let amount = parseFloat(weiToEther(deals[q].buyAmount));
                                let sellAmount = parseFloat(weiToEther(deals[q].sellAmount));
                                dayCounterPrimary = dayCounterPrimary + amount;
                                weekCounterPrimary = weekCounterPrimary + amount;
                                monthCounterPrimary = monthCounterPrimary + amount;

                                let usdAmount = 0;

                                if (
                                    (deals[q].offer.sellToken.id == Constants.USD.address) ||
                                    (deals[q].offer.sellToken.id == Constants.USC.address) ||
                                    (deals[q].offer.sellToken.id == Constants.PEL.address)
                                ) {
                                    usdAmount = sellAmount;
                                } else {
                                    usdAmount = await convertToUsd(
                                        sellAmount, 
                                        deals[q].offer.sellToken.id,
                                        deals[q].timestamp
                                    );
                                }

                                dayCounterUsd = dayCounterUsd + usdAmount;
                                weekCounterPrimaryUsd = weekCounterPrimaryUsd + usdAmount;
                                monthCounterPrimaryUsd = monthCounterPrimaryUsd + usdAmount;
                                dayRatesPrimaryRequests = dayRatesPrimaryRequests + (usdAmount / amount);
                            }

                            dayRatesPrimaryRequests = dayRatesPrimaryRequests / deals.length;
                        }
                    }
                }

                if (dayRatesOffers == 0) dayRatesOffers = dayRatesRequests;
                if (dayRatesRequests == 0) dayRatesRequests = dayRatesOffers;
                if (dayRatesPrimaryOffers == 0) dayRatesPrimaryOffers = dayRatesPrimaryRequests;
                if (dayRatesPrimaryRequests == 0) dayRatesPrimaryRequests = dayRatesPrimaryOffers;

                dayRates = (dayRatesOffers + dayRatesRequests) / 2;
                dayRatesPrimary = (dayRatesPrimaryOffers + dayRatesPrimaryRequests) / 2;
                dayRatesOffers = 0;
                dayRatesRequests = 0;
                dayRatesPrimaryOffers = 0;
                dayRatesPrimaryRequests = 0;

                if (dayRates != 0)  { dayRatesCounter++; dayRatesCounter2++; }
                if (dayRatesPrimary != 0) { dayRatesPrimaryCounter++; dayRatesPrimaryCounter2++; }

                weekRates = weekRates + dayRates;
                weekRatesPrimary = weekRatesPrimary + dayRatesPrimary;
                monthRates = monthRates + dayRates;
                monthRatesPrimary = monthRatesPrimary + dayRatesPrimary;

                if (day == 7 * week) {
                    //WEEKS
                    if (dayRatesCounter == 0) dayRatesCounter = 1;
                    weekRates = weekRates / dayRatesCounter;
                    dayRatesCounter = 0;
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounterUsd);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    //
                    if (dayRatesPrimaryCounter == 0) dayRatesPrimaryCounter = 1;
                    weekRatesPrimary = weekRatesPrimary / dayRatesPrimaryCounter;
                    dayRatesPrimaryCounter = 0;
                    weekRowPrimary.push(week);
                    weekRowPrimary.push(weekCounterPrimary);
                    weekRowPrimary.push(weekCounterPrimaryUsd);
                    weekRowPrimary.push(weekRatesPrimary);
                    weekRowsPrimary.push(weekRowPrimary);

                    week++;
                    weekCounter = 0;
                    weekCounterPrimary = 0;
                    weekCounterUsd = 0;
                    weekCounterPrimaryUsd = 0;
                    weekRates = 0;
                    weekRatesPrimary = 0;
                }

                dayRow.push(day);
                dayRow.push(dayCounter);
                dayRow.push(dayCounterUsd);
                dayRow.push(dayRates);
                dayRows.push(dayRow);
                //
                dayRowPrimary.push(day);
                dayRowPrimary.push(dayCounterPrimary);
                dayRowPrimary.push(dayCounterPrimaryUsd);
                dayRowPrimary.push(dayRatesPrimary);
                dayRowsPrimary.push(dayRowPrimary);

                day++;
                dayCounter = 0;
                dayCounterPrimary = 0;
                dayCounterUsd = 0;
                dayCounterPrimaryUsd = 0;

                _timeLow = _timeHigh;
                _timeHigh = _timeLow + ONE_UTC_DAY;
            }
            //MONTH
            let weekRow = [];
            let monthRow = [];
            let weekRowPrimary = [];
            let monthRowPrimary = [];

            if (dayRatesCounter == 0) dayRatesCounter = 1;
            weekRates = weekRates / dayRatesCounter;
            weekRow.push(week);
            weekRow.push(weekCounter);
            weekRow.push(weekCounterUsd);
            weekRow.push(weekRates);
            weekRows.push(weekRow);

            if (dayRatesPrimaryCounter == 0) dayRatesPrimaryCounter = 1;
            weekRatesPrimary = weekRatesPrimary / dayRatesPrimaryCounter;
            weekRowPrimary.push(week);
            weekRowPrimary.push(weekCounterPrimary);
            weekRowPrimary.push(weekCounterPrimaryUsd);
            weekRowPrimary.push(weekRatesPrimary);
            weekRowsPrimary.push(weekRowPrimary);

            if (dayRatesCounter2 == 0) dayRatesCounter2 = 1;
            monthRates = monthRates / dayRatesCounter2;
            monthRow.push(month);
            monthRow.push(monthCounter);
            monthRow.push(monthCounterUsd);
            monthRow.push(monthRates);
            monthRows.push(monthRow);

            if (dayRatesPrimaryCounter2 == 0) dayRatesPrimaryCounter2 = 1;
            monthRatesPrimary = monthRatesPrimary / dayRatesPrimaryCounter2;
            monthRowPrimary.push(month);
            monthRowPrimary.push(monthCounterPrimary);
            monthRowPrimary.push(monthCounterPrimaryUsd);
            monthRowPrimary.push(monthRatesPrimary);
            monthRowsPrimary.push(monthRowPrimary);

            let tableDay = 'TablaDay' + tokensArray[i].symbol;
            let tableWeek = 'TablaWeek' + tokensArray[i].symbol;
            let tableMonth = 'TablaMonth' + tokensArray[i].symbol;
            let tableDayPrimary = 'TablaDayPrimary' + tokensArray[i].symbol;
            let tableWeekPrimary = 'TablaWeekPrimary' + tokensArray[i].symbol;
            let tableMonthPrimary = 'TablaMonthPrimary' + tokensArray[i].symbol;

            addTable(
                sheet,
                tableDay,
                'B3',
                [
                    {name: 'Día', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                dayRows
            );

            addTable(
                sheet,
                tableWeek,
                'G3',
                [
                    {name: 'Semana', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                weekRows
            );

            addTable(
                sheet,
                tableMonth,
                'L3',
                [
                    {name: 'Mes', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                monthRows
            );

            addTable(
                sheet2,
                tableDayPrimary,
                'B3',
                [
                    {name: 'Día', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                dayRowsPrimary
            );

            addTable(
                sheet2,
                tableWeekPrimary,
                'G3',
                [
                    {name: 'Semana', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                weekRowsPrimary
            );

            addTable(
                sheet2,
                tableMonthPrimary,
                'L3',
                [
                    {name: 'Mes', filterButton: true},
                    {name: 'Monto', totalsRowFunction: 'sum'},
                    {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                    {name: 'Tipo de cambio'}
                ],
                monthRowsPrimary
            );

            /************************* */

            //offers
            if (offers.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offers.length; j++) {
                    if (offers[j].deals.length > 0) {
                        let deals = offers[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('B36').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet.getCell('B36').font = {bold: true};
                        let tableName = 'Tabla' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'B37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }

            //requests
            if (requests.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requests.length; j++) {
                    if (requests[j].deals.length > 0) {
                        let deals = requests[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('K36').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('K36').font = {bold: true};
                        let tableName = 'Tabla2' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'K7',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }

            //primaryoffers
            if (offersPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offersPrimary.length; j++) {
                    if (offersPrimary[j].deals.length > 0) {
                        let deals = offersPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('B36').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet2.getCell('B36').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'B37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }

            //primaryrequests
            if (requestsPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requestsPrimary.length; j++) {
                    if (requestsPrimary[j].deals.length > 0) {
                        let deals = requestsPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('K36').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('K36').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'K37',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsPackableDealsReportV2.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableDealsReportV2.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getPackableDealsReport(
        timeLow: number,
        timeHigh: number,
        tokensArray: any[]
    ) {
        const workbook = new ExcelJS.Workbook();
    
        for (let i = 0; i < tokensArray.length; i++) {
            let sheet: any;
            let sheet2: any;
            let offers = await getPackableOffers(timeLow, timeHigh, tokensArray[i].address, this.url);
            let offersPrimary = await getPackableOffersPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requests = await getPackableRequests(timeLow, timeHigh, tokensArray[i].address, this.url);
            let requestsPrimary = await getPackableRequestsPrimary(timeLow, timeHigh, tokensArray[i].address, this.url);
    
            if ((offers.length > 0) || (requests.length > 0)) {
                sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
                sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
                sheet.getCell('C1').font = {bold: true};
            }
    
            if ((offersPrimary.length > 0) || (requestsPrimary.length > 0)) {
                sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');
            
                sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
                sheet2.getCell('C1').font = {bold: true};
            }
    
            if (offers.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offers.length; j++) {
                    if (offers[j].deals.length > 0) {
                        let deals = offers[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].sellAmount)));
                            array.push(parseInt(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet.getCell('B2').font = {bold: true};
                        let tableName = 'Tabla' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'B3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
    
            if (requests.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requests.length; j++) {
                    if (requests[j].deals.length > 0) {
                        let deals = requests[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].buyAmount)));
                            array.push(parseInt(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('K2').font = {bold: true};
                        let tableName = 'Tabla2' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'K3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
    
            if (offersPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < offersPrimary.length; j++) {
                    if (offersPrimary[j].deals.length > 0) {
                        let deals = offersPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.buyToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].sellAmount)));
                            array.push(parseInt(weiToEther(deals[k].buyAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('B2').value = tokensArray[i].symbol + ' OFERTADO';
                        sheet2.getCell('B2').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'B3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
    
            if (requestsPrimary.length > 0) {
                let rows = [];
    
                for (let j = 0; j < requestsPrimary.length; j++) {
                    if (requestsPrimary[j].deals.length > 0) {
                        let deals = requestsPrimary[j].deals;
    
                        for (let k = 0; k < deals.length; k++) {
                            let array = [];
    
                            array.push(new Date(deals[k].timestamp * 1000));
                            array.push(timeConverter(deals[k].offer.timestamp));
                            array.push(timeConverter(deals[k].timestamp));
                            array.push(deals[k].offer.sellToken.tokenSymbol);
    
                            if (deals[k].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].seller.name);
                            }
    
                            if (deals[k].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[k].buyer.name);
                            }
    
                            array.push(parseInt(weiToEther(deals[k].buyAmount)));
                            array.push(parseInt(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet2.getCell('K2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('K2').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'K3',
                            [
                                {name: 'Fecha (pacto)', filterButton: true},
                                {name: 'Hora (oferta)'},
                                {name: 'Hora (pacto)'},
                                {name: 'Contrapartida', filterButton: true},
                                {name: 'Vendedor (usuario)', filterButton: true},
                                {name: 'Comprador (usuario)', filterButton: true},
                                {name: 'Monto pactado (primario) (' + tokensArray[i].symbol + ')', totalsRowFunction: 'sum'},
                                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
                            ],
                            rows
                        );
                    }
                }
            }
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsPackableDealsReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableDealsReport.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getTransactionsData(
        timeLow: number,
        timeHigh: number,
        token: any
    ) {
        return await getTransactions(timeLow, timeHigh, token.address, this.url);
    }

    async getDealsData(
        timeLow: number,
        timeHigh: number,
        token: any,
        market: "primary" | "secondary" = "secondary"
    ) {
        let offers: any[] = [];
        let requests: any[] = [];

        if (token.category == 1) {
            if (market == "secondary") {
                offers = await getOffers(timeLow, timeHigh, token.address, this.url);
                requests = await getRequests(timeLow, timeHigh, token.address, this.url);
            } else if (market == "primary") {
                offers = await getOffersPrimary(timeLow, timeHigh, token.address, this.url);
                requests = await getRequestsPrimary(timeLow, timeHigh, token.address, this.url);
            }
        } else if (token.category == 2) {
            if (market == "secondary") {
                offers = await getCollectableOffers(timeLow, timeHigh, token.address, this.url);
            } else if (market == "primary") {
                offers = await getCollectableOffersPrimary(timeLow, timeHigh, token.address, this.url);
            }
        } else if (token.category == 3) {
            if (market == "secondary") {
                offers = await getPackableOffers(timeLow, timeHigh, token.address, this.url);
                requests = await getPackableRequests(timeLow, timeHigh, token.address, this.url);
            } else if (market == "primary") {
                offers = await getPackableOffersPrimary(timeLow, timeHigh, token.address, this.url);
                requests = await getPackableRequestsPrimary(timeLow, timeHigh, token.address, this.url);
            }
        }

        offers = cleanEmptyDeals(offers);
        requests = cleanEmptyDeals(requests);

        return new DealsReportData(token.address, token.symbol, offers, requests);
    }

    async getHoldersData(
        token: any,
        expiry?: any
    ) {
        const first = 1000;
        const orderBy = "balance";
        const orderDirection = "desc";
        let queryTemplates = new QueryTemplates(this.url);
        let skip = 0;
        let holders: any[] = [];
        let offers: any[] = [];

        if (token.category == 1) {
            holders = await queryTemplates.getTokenHolders(
                orderBy,
                orderDirection,
                first,
                skip,
                token.address
            );
    
            let loopresponse = holders;
    
            while(loopresponse.length >= 1000) {
                skip = holders.length;
                holders = await queryTemplates.getTokenHolders(
                    orderBy,
                    orderDirection,
                    first,
                    skip,
                    token.address
                );
                holders = holders.concat(loopresponse);
            }

            let skipOffers = 0;
    
            offers = await queryTemplates.getOffers(
                'sellToken: "' + token.address + '", isOpen: true',
                'sellAmount',
                'desc',
                1000,
                skipOffers
            );
    
            let loopOffers = offers;
    
            while(loopOffers.length >= 1000) {
                skipOffers = offers.length;
                offers = await queryTemplates.getOffers(
                    'sellToken: "' + token.address + '", isOpen: true',
                    'sellAmount',
                    'desc',
                    1000,
                    skipOffers
                );
                offers = offers.concat(loopOffers);
            }
        } else if (token.category == 2) {
            holders = await queryTemplates.getNFTHolders(
                orderBy,
                orderDirection,
                first,
                skip,
                token.address
            );
    
            let loopresponse = holders;
    
            while(loopresponse.length >= 1000) {
                skip = holders.length;
                holders = await queryTemplates.getNFTHolders(
                    orderBy,
                    orderDirection,
                    first,
                    skip,
                    token.address
                );
                holders = holders.concat(loopresponse);
            }

            let skipOffers = 0;
    
            offers = await queryTemplates.getNFTOffers(
                'sellToken: "' + token.address + '", isOpen: true',
                'sellAmount',
                'desc',
                1000,
                skipOffers
            );
    
            let loopOffers = offers;
    
            while(loopOffers.length >= 1000) {
                skipOffers = offers.length;
                offers = await queryTemplates.getNFTOffers(
                    'sellToken: "' + token.address + '", isOpen: true',
                    'sellAmount',
                    'desc',
                    1000,
                    skipOffers
                );
                offers = offers.concat(loopOffers);
            }
        } else if (token.category == 3) {
            holders = await queryTemplates.getPackableHolders(
                token.address,
                expiry[1],
                orderBy,
                orderDirection,
                first,
                skip
            );
    
            let loopresponse = holders;
    
            while(loopresponse.length >= 1000) {
                skip = holders.length;
                holders = await queryTemplates.getPackableHolders(
                    token.address,
                    expiry[1],
                    orderBy,
                    orderDirection,
                    first,
                    skip
                );
                holders = holders.concat(loopresponse);
            }

            let skipOffers = 0;
    
            offers = await queryTemplates.getPackableOffers(
                'sellToken: "' + token.address + '", sellId: "' + expiry[1] + '", isOpen: true',
                'sellAmount',
                'desc',
                1000,
                skipOffers
            );
    
            let loopOffers = offers;
    
            while(loopOffers.length >= 1000) {
                skipOffers = offers.length;
                offers = await queryTemplates.getPackableOffers(
                    'sellToken: "' + token.address + '", sellId: "' + expiry[1] + '", isOpen: true',
                    'sellAmount',
                    'desc',
                    1000,
                    skipOffers
                );
                offers = offers.concat(loopOffers);
            }
        }

        return new HoldersReportData(token.address, token.symbol, holders, offers, expiry);
    }
}

async function getTransactions(
    _timeLow: number, 
    _timeHigh: number, 
    _tokenAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ transactions(first: 1000, skip: ' + skip + ', where: {timestamp_gte: ' + _timeLow + ', timestamp_lte: ' + _timeHigh + ', currency:"' + _tokenAddress + '"}, orderBy: timestamp, orderDirection: desc) { from { id name { id } } to { id name { id } } currency { tokenSymbol } amount timestamp } }';
    let queryService = new Query('bank', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryTransactions = response.transactions;
    let transactions = queryTransactions;

    while(queryTransactions.length >= 1000) {
        skip = transactions.length;
        query = '{ transactions(first: 1000, skip: ' + skip + ', where: {timestamp_gte: ' + _timeLow + ', timestamp_lte: ' + _timeHigh + ', currency:"' + _tokenAddress + '"}, orderBy: timestamp, orderDirection: desc) { from { id name { id } } to { id name { id } } currency { tokenSymbol } amount timestamp } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryTransactions = response.transactions;
        transactions = transactions.concat(queryTransactions);
    }

    return transactions;
}

async function getOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getRequests(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getRequestsPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getCollectableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getCollectableOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getPackableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getPackableRequests(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getPackableOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getPackableRequestsPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

function addTable(
    sheet: any,
    tableName: string,
    tablePosition: string,
    columns: any[],
    rows: any[]
) {
    sheet.addTable({
        name: tableName,
        ref: tablePosition,
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium1',
            showRowStripes: true,
        },
        columns: columns,
        rows: rows,
    });
}

function getTime() {
    return timeConverter(Date.now() / 1000);
}

function getUtcTime() {
    return Date.now() / 1000;
}

function getUtcTimeFromDate(year: number, month: number, day: number) {
    let timeDate = new Date(year, month - 1, day);
    let utcTime = timeDate.getTime() / 1000;
    return utcTime
}

function timeConverter(UNIX_timestamp: number) {
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

function getEndPointDates(UNIX_timestamp: number) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();

    let dayAfter = +UNIX_timestamp + +ONE_UTC_DAY;
    var b = new Date(dayAfter * 1000);
    var toYear = b.getFullYear();
    var toMonth = b.getMonth() + 1;
    var toDate = b.getDate();

    var from = year + '-' + month + '-' + date;
    var to = toYear + '-' + toMonth + '-' + toDate;
    return [from, to];
}

function cleanEmptyDeals(array: any[]) {
    let cleanArray: any[] = [];

    for (let i = 0; i < array.length; i++) {
        if (array[i].deals.length > 0) {
            cleanArray.push(array[i]);
        }
    }

    return cleanArray;
}

async function getDayRate(
    fromYear: number,
    fromMonth: number,
    toYear: number,
    toMonth: number,
    token: string,
    tokenCategory: number
) {
    if (
        (tokenCategory == 1) &&
        (token != Constants.PI.address) &&
        (token != Constants.USD.address) &&
        (token != Constants.USC.address) &&
        (token != Constants.PEL.address)
    ) {

        let from = fromYear + "-" + fromMonth + "-01";
        let to = toYear + "-" + toMonth + "-01";

        let responseData: any;

        try {
            responseData = await requestRateEndPoint(from, to, token);

            let rates = [];
            let factor = 1;

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

            for (let i = 23; i < responseData.length; i=i+24) {
                rates.push((1/(responseData[i].rate))/factor);
            }

            let len = 31 - rates.length;

            if (len > 0) {
                for (let j = 0; j < len; j++) {
                    rates.push(0);
                }
            }

            return rates;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    } else if (
        (token == Constants.USD.address) ||
        (token == Constants.USC.address) ||
        (token == Constants.PEL.address)
    ) {
        return [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    } else {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}

async function convertToUsd(
    amount: number,
    token: string,
    timestamp: number
) {
    let endPointDates = getEndPointDates(timestamp);
    let from = endPointDates[0];
    let to = endPointDates[1];
    
    if (token == Constants.PI.address) {
        return 0;
    } else if (
        (token == Constants.USD.address) ||
        (token == Constants.USC.address) ||
        (token == Constants.PEL.address)
    ) {
        return amount;
    } else {
        let rates = await requestRateEndPoint(from, to, token);

        if (rates.length == 0) {
            return 0;
        } else {
            let rate = rates[rates.length - 1].rate;

            let factor = 1;

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

            return amount/(rate * factor);
        }
    }
}

async function requestRateEndPoint(
    from: string,
    to: string,
    token: string
) {
    let endPoint = "https://api.pimarkets.io/v1/public/asset/exchange/rates/history";
    let body = JSON.stringify({"from":from,"to":to,"asset_id":token});

    let response: any;
    let responseData: any;

    try {
        response = await fetch(endPoint, {
            "method": 'POST',
            "headers": {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            "body": body,
            "redirect": 'follow'
        });

        if (response.ok) {
            responseData = await response.json();
        }

        return responseData;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export class DealsReportData {

    readonly tokenSymbol: string;
    readonly tokenAddress: string;
    readonly offers: any[];
    readonly requests: any[];

    constructor(
        tokenAddress: string,
        tokenSymbol: string,
        offers: any[],
        requests: any[]
    ) {
        this.tokenAddress = tokenAddress;
        this.tokenSymbol = tokenSymbol;
        this.offers = offers;
        this.requests = requests;
    }
}

export class HoldersReportData {

    readonly tokenSymbol: string;
    readonly tokenAddress: string;
    readonly holders: any[];
    readonly offers: any[];
    readonly expiry: string[];
    readonly timestamp: string;

    constructor(
        tokenAddress: string,
        tokenSymbol: string,
        holders: any[],
        offers: any[],
        expiry?: string[]
    ) {
        this.tokenAddress = tokenAddress;
        this.tokenSymbol = tokenSymbol;
        this.holders = holders;
        this.offers = offers;
        this.timestamp = getTime();
        
        if (expiry != undefined) {
            this.expiry = expiry;
        }
    }
}