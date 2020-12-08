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

    async getTransactionReportV3(
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

        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);

        let promises: any = [];

        for (let i = 0; i < tokensArray.length; i++) {
            let sheet = workbook.addWorksheet(tokensArray[i].symbol);

            promises.push(this.setTransactionSheet(
                sheet, 
                timeLow, 
                timeHigh, 
                monthIndex,
                year,
                toMonthIndex,
                toYear,
                tokensArray[i]
            ));
        }

        await Promise.all(promises);

        try {
            await workbook.xlsx.writeFile('PiMarketsTransactionsReportV3.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTransactionsReportV3.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async setTransactionSheet(
        sheet: any,
        timeLow: number,
        timeHigh: number,
        monthIndex: number,
        year: number,
        toMonthIndex: number,
        toYear: number,
        token: any
    ) {
        //define vars
        let day = 1;
        let week = 1;
        let month = 1;
        let dayCounter = 0;
        let weekCounter = 0;
        let weekRates = 0;
        let monthCounter = 0;
        let monthRates = 0;
        let weekZeros = 0;
        let monthZeros = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let txRows = [];

        //rates: array[31] with USD price (padded with 0s)
        let rates = await getDayRate(
            year, 
            monthIndex, 
            toYear, 
            toMonthIndex, 
            token.address,
            token.category
        );

        while(_timeHigh <= timeHigh) {
            //1 DAY per iteration

            //define vars
            let dayRow = [];
            let weekRow = [];

            //day transactions
            let transactions = await try_getTransactions(_timeLow, _timeHigh, token.address, this.url);

            if (transactions.length > 0) {
                for (let j = 0; j < transactions.length; j++) {
                    //1 TX per iteration
                    let txDayRow = [];
                    let amount = parseFloat(weiToEther(transactions[j].amount));
                    dayCounter = dayCounter + amount;
                    weekCounter = weekCounter + amount;
                    monthCounter = monthCounter + amount;
                
                    //TXs Table
                    txDayRow.push(new Date(transactions[j].timestamp * 1000));
                    txDayRow.push(transactions[j].currency.tokenSymbol);
                    txDayRow.push(transactions[j].from.id);

                    if (transactions[j].from.name == null) {
                        txDayRow.push("");
                    } else {
                        txDayRow.push(transactions[j].from.name.id);
                    }

                    txDayRow.push(transactions[j].to.id);

                    if (transactions[j].to.name == null) {
                        txDayRow.push("");
                    } else {
                        txDayRow.push(transactions[j].to.name.id);
                    }

                    txDayRow.push(parseFloat(weiToEther(transactions[j].amount)));
                    txRows.push(txDayRow);
                }
            }

            //update week and month rate counters
            weekRates = weekRates + rates[day - 1];
            monthRates = monthRates + rates[day - 1];
            if (rates[day - 1] == 0) {
                weekZeros++;
                monthZeros++;
            }

            if (day == 7 * week) {
                //1 WEEK per iteration

                //calc this week rate
                if ((7 - weekZeros) == 0){
                    weekRates = 0;
                } else {
                    weekRates = weekRates / (7 - weekZeros);
                }

                //update week arrays
                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounter * weekRates);
                weekRow.push(weekRates);
                weekRows.push(weekRow);

                //reset and update counters
                week++;
                weekCounter = 0;
                weekRates = 0;
                weekZeros = 0;
            }

            //update day arrays
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

        //5th WEEK (days 29-31)
        let weekRow = [];
        
        //calc 5th week rate
        if ((day - 29 - weekZeros) == 0){
            weekRates = 0;
        } else {
            weekRates = weekRates / (day - 29 - weekZeros);
        }

        //update week arrays
        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounter * weekRates);
        weekRow.push(weekRates);
        weekRows.push(weekRow);

        //1 MONTH per iteration
        let monthRow = [];

        //calc month rate
        if ((day - 1 - monthZeros) == 0){
            monthRates = 0;
        } else {
            monthRates = monthRates / (day - 1 - monthZeros);
        }

        //update month arrays
        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounter * monthRates);
        monthRow.push(monthRates);
        monthRows.push(monthRow);

        //ADD SHEET TABLES
        let tableDay = 'TablaDay' + token.symbol;
        let tableWeek = 'TablaWeek' + token.symbol;
        let tableMonth = 'TablaMonth' + token.symbol;

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

        //TXs TABLE
        let tableName = 'Tabla' + token.symbol;

        if (txRows.length == 0) {
            txRows = getEmptyTransaction();
        }

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
            txRows
        );

        //CELL LABELS
        sheet.getCell('B35').value = 'TRANSFERENCIAS';
        sheet.getCell('B35').font = {bold: true};
        
        sheet.getCell('B1').value = 'TOTAL (diario)';
        sheet.getCell('B1').font = {bold: true};
        
        sheet.getCell('G1').value = 'TOTAL (semanal)';
        sheet.getCell('G1').font = {bold: true};

        sheet.getCell('L1').value = 'TOTAL (mensual)';
        sheet.getCell('L1').font = {bold: true};
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

        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);

        for (let i = 0; i < tokensArray.length; i++) {
            //1 TOKEN per iteration

            //define vars
            let day = 1;
            let week = 1;
            let month = 1;
            let dayCounter = 0;
            let weekCounter = 0;
            let weekRates = 0;
            let monthCounter = 0;
            let monthRates = 0;
            let weekZeros = 0;
            let monthZeros = 0;
            let _timeLow = timeLow;
            let _timeHigh = _timeLow + ONE_UTC_DAY;
            let dayRows = [];
            let weekRows = [];
            let monthRows = [];
            let txRows = [];

            //1 sheet per token
            let sheet = workbook.addWorksheet(tokensArray[i].symbol);

            //rates: array[31] with USD price (padded with 0s)
            let rates = await getDayRate(
                year, 
                monthIndex, 
                toYear, 
                toMonthIndex, 
                tokensArray[i].address,
                tokensArray[i].category
            );

            while(_timeHigh <= timeHigh) {
                //1 DAY per iteration

                //define vars
                let dayRow = [];
                let weekRow = [];

                //day transactions
                let transactions = await getTransactions(_timeLow, _timeHigh, tokensArray[i].address, this.url);

                if (transactions.length > 0) {
                    for (let j = 0; j < transactions.length; j++) {
                        //1 TX per iteration
                        let txDayRow = [];
                        let amount = parseFloat(weiToEther(transactions[j].amount));
                        dayCounter = dayCounter + amount;
                        weekCounter = weekCounter + amount;
                        monthCounter = monthCounter + amount;
                    
                        //TXs Table
                        txDayRow.push(new Date(transactions[j].timestamp * 1000));
                        txDayRow.push(transactions[j].currency.tokenSymbol);
                        txDayRow.push(transactions[j].from.id);

                        if (transactions[j].from.name == null) {
                            txDayRow.push("");
                        } else {
                            txDayRow.push(transactions[j].from.name.id);
                        }

                        txDayRow.push(transactions[j].to.id);

                        if (transactions[j].to.name == null) {
                            txDayRow.push("");
                        } else {
                            txDayRow.push(transactions[j].to.name.id);
                        }

                        txDayRow.push(parseFloat(weiToEther(transactions[j].amount)));
                        txRows.push(txDayRow);
                    }
                }

                //update week and month rate counters
                weekRates = weekRates + rates[day - 1];
                monthRates = monthRates + rates[day - 1];
                if (rates[day - 1] == 0) {
                    weekZeros++;
                    monthZeros++;
                }

                if (day == 7 * week) {
                    //1 WEEK per iteration

                    //calc this week rate
                    if ((7 - weekZeros) == 0){
                        weekRates = 0;
                    } else {
                        weekRates = weekRates / (7 - weekZeros);
                    }

                    //update week arrays
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);

                    //reset and update counters
                    week++;
                    weekCounter = 0;
                    weekRates = 0;
                    weekZeros = 0;
                }

                //update day arrays
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

            //5th WEEK (days 29-31)
            let weekRow = [];
            
            //calc 5th week rate
            if ((day - 29 - weekZeros) == 0){
                weekRates = 0;
            } else {
                weekRates = weekRates / (day - 29 - weekZeros);
            }

            //update week arrays
            weekRow.push(week);
            weekRow.push(weekCounter);
            weekRow.push(weekCounter * weekRates);
            weekRow.push(weekRates);
            weekRows.push(weekRow);

            //1 MONTH per iteration
            let monthRow = [];

            //calc month rate
            if ((day - 1 - monthZeros) == 0){
                monthRates = 0;
            } else {
                monthRates = monthRates / (day - 1 - monthZeros);
            }

            //update month arrays
            monthRow.push(month);
            monthRow.push(monthCounter);
            monthRow.push(monthCounter * monthRates);
            monthRow.push(monthRates);
            monthRows.push(monthRow);

            //ADD SHEET TABLES
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

            //TXs TABLE
            let tableName = 'Tabla' + tokensArray[i].symbol;

            if (txRows.length == 0) {
                txRows = getEmptyTransaction();
            }

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
                txRows
            );

            //CELL LABELS
            sheet.getCell('B35').value = 'TRANSFERENCIAS';
            sheet.getCell('B35').font = {bold: true};
            
            sheet.getCell('B1').value = 'TOTAL (diario)';
            sheet.getCell('B1').font = {bold: true};
            
            sheet.getCell('G1').value = 'TOTAL (semanal)';
            sheet.getCell('G1').font = {bold: true};

            sheet.getCell('L1').value = 'TOTAL (mensual)';
            sheet.getCell('L1').font = {bold: true};
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsMonthTransactionsReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsMonthTransactionsReport.xlsx');
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

    async getTokenDealsReportV3(
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

        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);

        let promises: any = [];

        for (let i = 0; i < tokensArray.length; i++) {
            //2 sheets per token (1 per market)
            let sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
            let sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');

            promises.push(this.setTokenDealsSheetV2(
                sheet, 
                timeLow, 
                timeHigh, 
                monthIndex,
                year,
                toMonthIndex,
                toYear,
                tokensArray[i]
            ));

            promises.push(this.setPrimaryTokenDealsSheetV2(
                sheet2, 
                timeLow, 
                timeHigh, 
                monthIndex,
                year,
                toMonthIndex,
                toYear,
                tokensArray[i]
            ));
        }

        await Promise.all(promises);

        try {
            await workbook.xlsx.writeFile('PiMarketsTokenDealsReportV3.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsTokenDealsReportV3.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async setTokenDealsSheet(
        sheet: any,
        sheet2: any,
        timeLow: number,
        timeHigh: number,
        monthIndex: number,
        year: number,
        toMonthIndex: number,
        toYear: number,
        token: any
    ) {
        //define vars
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
        let weekZeros = 0;
        let monthZeros = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let dayRowsPrimary = [];
        let weekRowsPrimary = [];
        let monthRowsPrimary = [];
        let offersRows = [];
        let requestsRows = [];
        let offersPrimaryRows = [];
        let requestsPrimaryRows = [];

        //rates: array[31] with USD price (padded with 0s)
        let rates = await getDayRate(
            year, 
            monthIndex, 
            toYear, 
            toMonthIndex, 
            token.address,
            token.category
        );

        while(_timeHigh <= timeHigh) {
            //1 DAY per iteration

            //define vars
            let dayRow = [];
            let weekRow = [];
            let dayRowPrimary = [];
            let weekRowPrimary = [];

            let dayOffers = await try_getOffers(_timeLow, _timeHigh, token.address, this.url);
            let dayOffersPrimary = await try_getOffersPrimary(_timeLow, _timeHigh, token.address, this.url);
            let dayRequests = await try_getRequests(_timeLow, _timeHigh, token.address, this.url);
            let dayRequestsPrimary = await try_getRequestsPrimary(_timeLow, _timeHigh, token.address, this.url);

            if (dayOffers.length > 0) {
                for (let p = 0; p < dayOffers.length; p++) {
                    if (dayOffers[p].deals.length > 0) {
                        let deals = dayOffers[p].deals;
                        for (let q = 0; q < deals.length; q++) {
                            let amount = parseFloat(weiToEther(deals[q].sellAmount));
                            dayCounter = dayCounter + amount;
                            weekCounter = weekCounter + amount;
                            monthCounter = monthCounter + amount;

                            //DEALS TABLE
                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersRows.push(array);
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

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersPrimaryRows.push(array);
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

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            requestsRows.push(array);
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

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            requestsPrimaryRows.push(array);
                        }
                    }
                }
            }

            //update week and month rates
            weekRates = weekRates + rates[day - 1];
            monthRates = monthRates + rates[day - 1];
            if (rates[day - 1] == 0) {
                weekZeros++;
                monthZeros++;
            }

            if (day == 7 * week) {
                //1 WEEK per iteration

                //calc week rate
                if ((7 - weekZeros) == 0){
                    weekRates = 0;
                } else {
                    weekRates = weekRates / (7 - weekZeros);
                }

                //update week secondary arrays
                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounter * weekRates);
                weekRow.push(weekRates);
                weekRows.push(weekRow);
                
                //update week primary arrays
                weekRowPrimary.push(week);
                weekRowPrimary.push(weekCounterPrimary);
                weekRowPrimary.push(weekCounterPrimary * weekRates);
                weekRowPrimary.push(weekRates);
                weekRowsPrimary.push(weekRowPrimary);

                //update and reset week counters
                week++;
                weekCounter = 0;
                weekCounterPrimary = 0;
                weekRates = 0
                weekZeros = 0;
            }

            //update day secondary arrays
            dayRow.push(day);
            dayRow.push(dayCounter);
            dayRow.push(dayCounter * rates[day - 1]);
            dayRow.push(rates[day - 1]);
            dayRows.push(dayRow);
            
            //update day primary arrays
            dayRowPrimary.push(day);
            dayRowPrimary.push(dayCounterPrimary);
            dayRowPrimary.push(dayCounterPrimary * rates[day - 1]);
            dayRowPrimary.push(rates[day - 1]);
            dayRowsPrimary.push(dayRowPrimary);

            //update and reset day counters
            day++;
            dayCounter = 0;
            dayCounterPrimary = 0;
            _timeLow = _timeHigh;
            _timeHigh = _timeLow + ONE_UTC_DAY;
        }

        //5th WEEK (days 29-31)
        let weekRow = [];
        let weekRowPrimary = [];

        //calc 5th week rates
        if ((day - 29 - weekZeros) == 0){
            weekRates = 0;
        } else {
            weekRates = weekRates / (day - 29 - weekZeros);
        }

        //update 5th week secondary array
        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounter * weekRates);
        weekRow.push(weekRates);
        weekRows.push(weekRow);

        //update 5th week primary array
        weekRowPrimary.push(week);
        weekRowPrimary.push(weekCounterPrimary);
        weekRowPrimary.push(weekCounterPrimary * weekRates);
        weekRowPrimary.push(weekRates);
        weekRowsPrimary.push(weekRowPrimary);

        //MONTH
        let monthRow = [];
        let monthRowPrimary = [];

        if ((day - 1 - monthZeros) == 0){
            monthRates = 0;
        } else {
            monthRates = monthRates / (day - 1 - monthZeros);
        }
        //secondary
        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounter * monthRates);
        monthRow.push(monthRates);
        monthRows.push(monthRow);
        //primary
        monthRowPrimary.push(month);
        monthRowPrimary.push(monthCounterPrimary);
        monthRowPrimary.push(monthCounterPrimary * monthRates);
        monthRowPrimary.push(monthRates);
        monthRowsPrimary.push(monthRowPrimary);

        //ADD TABLES
        let tableDay = 'TablaDay' + token.symbol;
        let tableWeek = 'TablaWeek' + token.symbol;
        let tableMonth = 'TablaMonth' + token.symbol;
        let tableDayPrimary = 'TablaDayPrimary' + token.symbol;
        let tableWeekPrimary = 'TablaWeekPrimary' + token.symbol;
        let tableMonthPrimary = 'TablaMonthPrimary' + token.symbol;

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

        sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet.getCell('B36').font = {bold: true};
        let tableName = 'Tabla' + token.symbol;

        if (offersRows.length == 0) {
            offersRows = getEmtpyDeal();
        }

        addTable(
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
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersRows
        );

        sheet.getCell('K36').value = 'PACTOS (' + token.symbol + ' DEMANDADO)';
        sheet.getCell('K36').font = {bold: true};
        let tableName2 = 'Tabla2' + token.symbol;

        if (requestsRows.length == 0) {
            requestsRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName2,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsRows
        );

        sheet2.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet2.getCell('B36').font = {bold: true};
        let tableName3 = 'TablaPrimario' + token.symbol;

        if (offersPrimaryRows.length == 0) {
            offersPrimaryRows = getEmtpyDeal();
        }

        addTable(
            sheet2,
            tableName3,
            'B37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersPrimaryRows
        );

        sheet2.getCell('K36').value = token.symbol + ' DEMANDADO';
        sheet2.getCell('K36').font = {bold: true};
        let tableName4 = 'TablaPrimario2' + token.symbol;

        if (requestsPrimaryRows.length == 0) {
            requestsPrimaryRows = getEmtpyDeal();
        }

        addTable(
            sheet2,
            tableName4,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsPrimaryRows
        );

        sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
        sheet.getCell('C1').font = {bold: true};
        sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
        sheet2.getCell('C1').font = {bold: true};

        sheet.getCell('B2').value = 'TOTAL (diario)';
        sheet.getCell('B2').font = {bold: true};
        sheet2.getCell('B2').value = 'TOTAL (diario)';
        sheet2.getCell('B2').font = {bold: true};
        
        sheet.getCell('G2').value = 'TOTAL (semanal)';
        sheet.getCell('G2').font = {bold: true};
        sheet2.getCell('G2').value = 'TOTAL (semanal)';
        sheet2.getCell('G2').font = {bold: true};

        sheet.getCell('L2').value = 'TOTAL (mensual)';
        sheet.getCell('L2').font = {bold: true};
        sheet2.getCell('L2').value = 'TOTAL (mensual)';
        sheet2.getCell('L2').font = {bold: true};
    }

    async setTokenDealsSheetV2(
        sheet: any,
        timeLow: number,
        timeHigh: number,
        monthIndex: number,
        year: number,
        toMonthIndex: number,
        toYear: number,
        token: any
    ) {
        //define vars
        let day = 1;
        let week = 1;
        let month = 1;
        let dayCounter = 0;
        let weekCounter = 0;
        let monthCounter = 0;
        let weekRates = 0;
        let monthRates = 0;
        let weekZeros = 0;
        let monthZeros = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let offersRows = [];
        let requestsRows = [];

        let dayOffers = await try_getOffers(timeLow, timeHigh, token.address, this.url);
        let dayRequests = await try_getRequests(timeLow, timeHigh, token.address, this.url);

        //rates: array[31] with USD price (padded with 0s)
        let rates = await getDayRate(
            year, 
            monthIndex, 
            toYear, 
            toMonthIndex, 
            token.address,
            token.category
        );

        let nextOffer: any;
        let nextTimestamp: number;
        let nextIsOffer: boolean;

        if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
            nextOffer = dayRequests.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = false;
        } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
            nextOffer = dayOffers.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = true;
        } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
            let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
            let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;

            if (nextOfferTimestamp < nextRequestTimestamp) {
                nextOffer = dayOffers.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = true;
            } else {
                nextOffer = dayRequests.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = false;
            }
        } else {
            nextTimestamp = 0;
        }

        while (_timeHigh <= timeHigh) {

            while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                //compute offer
                if (nextOffer.deals.length > 0) {
                    if (nextIsOffer) {
                        //COMPUTE OFFER
                        let deals = nextOffer.deals;
                        for (let q = 0; q < deals.length; q++) {
                            //1 DEAL per iteration
                            let amount = parseFloat(weiToEther(deals[q].sellAmount));
                            dayCounter = dayCounter + amount;
                            weekCounter = weekCounter + amount;
                            monthCounter = monthCounter + amount;

                            //DEALS TABLE
                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersRows.push(array);
                            //1 DEAL per iteration
                        }
                    } else {
                        //COMPUTE REQUEST
                        let deals = nextOffer.deals;
                        for (let q = 0; q < deals.length; q++) {
                            let amount = parseFloat(weiToEther(deals[q].buyAmount));
                            dayCounter = dayCounter + amount;
                            weekCounter = weekCounter + amount;
                            monthCounter = monthCounter + amount;

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
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
                } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                    nextOffer = dayOffers.pop();
                    nextTimestamp = nextOffer.timestamp;
                    nextIsOffer = true;
                } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                    let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                    let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
        
                    if (nextOfferTimestamp < nextRequestTimestamp) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    } else {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                } else {
                    nextTimestamp = 0;
                }
            }

            //compute day
            //update week and month rates
            weekRates = weekRates + rates[day - 1];
            monthRates = monthRates + rates[day - 1];
            if (rates[day - 1] == 0) {
                weekZeros++;
                monthZeros++;
            }

            let dayRow = [];

            dayRow.push(day);
            dayRow.push(dayCounter);
            dayRow.push(dayCounter * rates[day - 1]);
            dayRow.push(rates[day - 1]);
            dayRows.push(dayRow);

            dayCounter = 0;

            day++;
            _timeLow = _timeHigh;
            _timeHigh = _timeLow + ONE_UTC_DAY;

            //compute week
            if (day == 7 * week) {
                //WEEK
                //calc week rate
                if ((7 - weekZeros) == 0){
                    weekRates = 0;
                } else {
                    weekRates = weekRates / (7 - weekZeros);
                }

                let weekRow = [];

                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounter * weekRates);
                weekRow.push(weekRates);
                weekRows.push(weekRow);

                weekCounter = 0;
                weekRates = 0
                weekZeros = 0;
                week++;
            }
        }

        //5th week...days (29-31)
        let weekRow = [];

        //calc 5th week rates
        if ((day - 29 - weekZeros) == 0){
            weekRates = 0;
        } else {
            weekRates = weekRates / (day - 29 - weekZeros);
        }

        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounter * weekRates);
        weekRow.push(weekRates);
        weekRows.push(weekRow);

        //MONTH
        let monthRow = [];

        if ((day - 1 - monthZeros) == 0){
            monthRates = 0;
        } else {
            monthRates = monthRates / (day - 1 - monthZeros);
        }

        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounter * monthRates);
        monthRow.push(monthRates);
        monthRows.push(monthRow);

        //ADD TABLES
        let tableDay = 'TablaDay' + token.symbol;
        let tableWeek = 'TablaWeek' + token.symbol;
        let tableMonth = 'TablaMonth' + token.symbol;

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

        sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet.getCell('B36').font = {bold: true};
        let tableName = 'Tabla' + token.symbol;

        if (offersRows.length == 0) {
            offersRows = getEmtpyDeal();
        }

        addTable(
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
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersRows
        );

        sheet.getCell('K36').value = 'PACTOS (' + token.symbol + ' DEMANDADO)';
        sheet.getCell('K36').font = {bold: true};
        let tableName2 = 'Tabla2' + token.symbol;

        if (requestsRows.length == 0) {
            requestsRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName2,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsRows
        );

        sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
        sheet.getCell('C1').font = {bold: true};

        sheet.getCell('B2').value = 'TOTAL (diario)';
        sheet.getCell('B2').font = {bold: true};
        
        sheet.getCell('G2').value = 'TOTAL (semanal)';
        sheet.getCell('G2').font = {bold: true};

        sheet.getCell('L2').value = 'TOTAL (mensual)';
        sheet.getCell('L2').font = {bold: true};
    }

    async setPrimaryTokenDealsSheetV2(
        sheet: any,
        timeLow: number,
        timeHigh: number,
        monthIndex: number,
        year: number,
        toMonthIndex: number,
        toYear: number,
        token: any
    ) {
        //define vars
        let day = 1;
        let week = 1;
        let month = 1;
        let dayCounter = 0;
        let weekCounter = 0;
        let monthCounter = 0;
        let weekRates = 0;
        let monthRates = 0;
        let weekZeros = 0;
        let monthZeros = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let offersRows = [];
        let requestsRows = [];

        let dayOffers = await try_getOffersPrimary(timeLow, timeHigh, token.address, this.url);
        let dayRequests = await try_getRequestsPrimary(timeLow, timeHigh, token.address, this.url);

        //rates: array[31] with USD price (padded with 0s)
        let rates = await getDayRate(
            year, 
            monthIndex, 
            toYear, 
            toMonthIndex, 
            token.address,
            token.category
        );

        let nextOffer: any;
        let nextTimestamp: number;
        let nextIsOffer: boolean;

        if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
            nextOffer = dayRequests.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = false;
        } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
            nextOffer = dayOffers.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = true;
        } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
            let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
            let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;

            if (nextOfferTimestamp < nextRequestTimestamp) {
                nextOffer = dayOffers.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = true;
            } else {
                nextOffer = dayRequests.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = false;
            }
        } else {
            nextTimestamp = 0;
        }

        while (_timeHigh <= timeHigh) {

            while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                //compute offer
                if (nextOffer.deals.length > 0) {
                    if (nextIsOffer) {
                        //COMPUTE OFFER
                        let deals = nextOffer.deals;
                        for (let q = 0; q < deals.length; q++) {
                            //1 DEAL per iteration
                            let amount = parseFloat(weiToEther(deals[q].sellAmount));
                            dayCounter = dayCounter + amount;
                            weekCounter = weekCounter + amount;
                            monthCounter = monthCounter + amount;

                            //DEALS TABLE
                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersRows.push(array);
                            //1 DEAL per iteration
                        }
                    } else {
                        //COMPUTE REQUEST
                        let deals = nextOffer.deals;
                        for (let q = 0; q < deals.length; q++) {
                            let amount = parseFloat(weiToEther(deals[q].buyAmount));
                            dayCounter = dayCounter + amount;
                            weekCounter = weekCounter + amount;
                            monthCounter = monthCounter + amount;

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
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
                } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                    nextOffer = dayOffers.pop();
                    nextTimestamp = nextOffer.timestamp;
                    nextIsOffer = true;
                } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                    let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                    let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
        
                    if (nextOfferTimestamp < nextRequestTimestamp) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    } else {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                } else {
                    nextTimestamp = 0;
                }
            }

            //compute day
            //update week and month rates
            weekRates = weekRates + rates[day - 1];
            monthRates = monthRates + rates[day - 1];
            if (rates[day - 1] == 0) {
                weekZeros++;
                monthZeros++;
            }

            let dayRow = [];

            dayRow.push(day);
            dayRow.push(dayCounter);
            dayRow.push(dayCounter * rates[day - 1]);
            dayRow.push(rates[day - 1]);
            dayRows.push(dayRow);

            dayCounter = 0;

            day++;
            _timeLow = _timeHigh;
            _timeHigh = _timeLow + ONE_UTC_DAY;

            //compute week
            if (day == 7 * week) {
                //WEEK
                //calc week rate
                if ((7 - weekZeros) == 0){
                    weekRates = 0;
                } else {
                    weekRates = weekRates / (7 - weekZeros);
                }

                let weekRow = [];

                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounter * weekRates);
                weekRow.push(weekRates);
                weekRows.push(weekRow);

                weekCounter = 0;
                weekRates = 0
                weekZeros = 0;
                week++;
            }
        }

        //5th week...days (29-31)
        let weekRow = [];

        //calc 5th week rates
        if ((day - 29 - weekZeros) == 0){
            weekRates = 0;
        } else {
            weekRates = weekRates / (day - 29 - weekZeros);
        }

        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounter * weekRates);
        weekRow.push(weekRates);
        weekRows.push(weekRow);

        //MONTH
        let monthRow = [];

        if ((day - 1 - monthZeros) == 0){
            monthRates = 0;
        } else {
            monthRates = monthRates / (day - 1 - monthZeros);
        }

        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounter * monthRates);
        monthRow.push(monthRates);
        monthRows.push(monthRow);

        //ADD TABLES
        let tableDayPrimary = 'TablaDayPrimary' + token.symbol;
        let tableWeekPrimary = 'TablaWeekPrimary' + token.symbol;
        let tableMonthPrimary = 'TablaMonthPrimary' + token.symbol;

        addTable(
            sheet,
            tableDayPrimary,
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
            tableWeekPrimary,
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
            tableMonthPrimary,
            'L3',
            [
                {name: 'Mes', filterButton: true},
                {name: 'Monto', totalsRowFunction: 'sum'},
                {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                {name: 'Tipo de cambio'}
            ],
            monthRows
        );

        sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet.getCell('B36').font = {bold: true};
        let tableName3 = 'TablaPrimario' + token.symbol;

        if (offersRows.length == 0) {
            offersRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName3,
            'B37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersRows
        );

        sheet.getCell('K36').value = token.symbol + ' DEMANDADO';
        sheet.getCell('K36').font = {bold: true};
        let tableName4 = 'TablaPrimario2' + token.symbol;

        if (requestsRows.length == 0) {
            requestsRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName4,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsRows
        );

        sheet.getCell('C1').value = 'Mercado P2P (Primario)';
        sheet.getCell('C1').font = {bold: true};

        sheet.getCell('B2').value = 'TOTAL (diario)';
        sheet.getCell('B2').font = {bold: true};
        
        sheet.getCell('G2').value = 'TOTAL (semanal)';
        sheet.getCell('G2').font = {bold: true};

        sheet.getCell('L2').value = 'TOTAL (mensual)';
        sheet.getCell('L2').font = {bold: true};
    }

    async getTokenDealsReportV2(
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

        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);

        for (let i = 0; i < tokensArray.length; i++) {
            //1 TOKEN per iteration

            //define vars
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
            let weekZeros = 0;
            let monthZeros = 0;
            let _timeLow = timeLow;
            let _timeHigh = _timeLow + ONE_UTC_DAY;
            let dayRows = [];
            let weekRows = [];
            let monthRows = [];
            let dayRowsPrimary = [];
            let weekRowsPrimary = [];
            let monthRowsPrimary = [];
            let offersRows = [];
            let requestsRows = [];
            let offersPrimaryRows = [];
            let requestsPrimaryRows = [];

            //2 sheets per token (1 per market)
            let sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
            let sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');

            //rates: array[31] with USD price (padded with 0s)
            let rates = await getDayRate(
                year, 
                monthIndex, 
                toYear, 
                toMonthIndex, 
                tokensArray[i].address,
                tokensArray[i].category
            );

            while(_timeHigh <= timeHigh) {
                //1 DAY per iteration

                //define vars
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

                                //DEALS TABLE
                                let array = [];

                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.buyToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                offersRows.push(array);
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

                                let array = [];
    
                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.buyToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                offersPrimaryRows.push(array);
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

                                let array = [];
    
                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.sellToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                requestsRows.push(array);
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

                                let array = [];
    
                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.sellToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                requestsPrimaryRows.push(array);
                            }
                        }
                    }
                }

                //update week and month rates
                weekRates = weekRates + rates[day - 1];
                monthRates = monthRates + rates[day - 1];
                if (rates[day - 1] == 0) {
                    weekZeros++;
                    monthZeros++;
                }

                if (day == 7 * week) {
                    //1 WEEK per iteration

                    //calc week rate
                    if ((7 - weekZeros) == 0){
                        weekRates = 0;
                    } else {
                        weekRates = weekRates / (7 - weekZeros);
                    }

                    //update week secondary arrays
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounter * weekRates);
                    weekRow.push(weekRates);
                    weekRows.push(weekRow);
                    
                    //update week primary arrays
                    weekRowPrimary.push(week);
                    weekRowPrimary.push(weekCounterPrimary);
                    weekRowPrimary.push(weekCounterPrimary * weekRates);
                    weekRowPrimary.push(weekRates);
                    weekRowsPrimary.push(weekRowPrimary);

                    //update and reset week counters
                    week++;
                    weekCounter = 0;
                    weekCounterPrimary = 0;
                    weekRates = 0
                    weekZeros = 0;
                }

                //update day secondary arrays
                dayRow.push(day);
                dayRow.push(dayCounter);
                dayRow.push(dayCounter * rates[day - 1]);
                dayRow.push(rates[day - 1]);
                dayRows.push(dayRow);
                
                //update day primary arrays
                dayRowPrimary.push(day);
                dayRowPrimary.push(dayCounterPrimary);
                dayRowPrimary.push(dayCounterPrimary * rates[day - 1]);
                dayRowPrimary.push(rates[day - 1]);
                dayRowsPrimary.push(dayRowPrimary);

                //update and reset day counters
                day++;
                dayCounter = 0;
                dayCounterPrimary = 0;
                _timeLow = _timeHigh;
                _timeHigh = _timeLow + ONE_UTC_DAY;
            }

            //5th WEEK (days 29-31)
            let weekRow = [];
            let weekRowPrimary = [];

            //calc 5th week rates
            if ((day - 29 - weekZeros) == 0){
                weekRates = 0;
            } else {
                weekRates = weekRates / (day - 29 - weekZeros);
            }

            //update 5th week secondary array
            weekRow.push(week);
            weekRow.push(weekCounter);
            weekRow.push(weekCounter * weekRates);
            weekRow.push(weekRates);
            weekRows.push(weekRow);

            //update 5th week primary array
            weekRowPrimary.push(week);
            weekRowPrimary.push(weekCounterPrimary);
            weekRowPrimary.push(weekCounterPrimary * weekRates);
            weekRowPrimary.push(weekRates);
            weekRowsPrimary.push(weekRowPrimary);

            //MONTH
            let monthRow = [];
            let monthRowPrimary = [];

            if ((day - 1 - monthZeros) == 0){
                monthRates = 0;
            } else {
                monthRates = monthRates / (day - 1 - monthZeros);
            }
            //secondary
            monthRow.push(month);
            monthRow.push(monthCounter);
            monthRow.push(monthCounter * monthRates);
            monthRow.push(monthRates);
            monthRows.push(monthRow);
            //primary
            monthRowPrimary.push(month);
            monthRowPrimary.push(monthCounterPrimary);
            monthRowPrimary.push(monthCounterPrimary * monthRates);
            monthRowPrimary.push(monthRates);
            monthRowsPrimary.push(monthRowPrimary);

            //ADD TABLES
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

            sheet.getCell('B36').value = 'PACTOS (' + tokensArray[i].symbol + ' OFERTADO)';
            sheet.getCell('B36').font = {bold: true};
            let tableName = 'Tabla' + tokensArray[i].symbol;

            if (offersRows.length == 0) {
                offersRows = getEmtpyDeal();
            }

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
                offersRows
            );

            sheet.getCell('K36').value = 'PACTOS (' + tokensArray[i].symbol + ' DEMANDADO)';
            sheet.getCell('K36').font = {bold: true};
            let tableName2 = 'Tabla2' + tokensArray[i].symbol;

            if (requestsRows.length == 0) {
                requestsRows = getEmtpyDeal();
            }

            await addTable(
                sheet,
                tableName2,
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
                requestsRows
            );

            sheet2.getCell('B36').value = 'PACTOS (' + tokensArray[i].symbol + ' OFERTADO)';
            sheet2.getCell('B36').font = {bold: true};
            let tableName3 = 'TablaPrimario' + tokensArray[i].symbol;

            if (offersPrimaryRows.length == 0) {
                offersPrimaryRows = getEmtpyDeal();
            }

            await addTable(
                sheet2,
                tableName3,
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
                offersPrimaryRows
            );

            sheet2.getCell('K36').value = tokensArray[i].symbol + ' DEMANDADO';
            sheet2.getCell('K36').font = {bold: true};
            let tableName4 = 'TablaPrimario2' + tokensArray[i].symbol;

            if (requestsPrimaryRows.length == 0) {
                requestsPrimaryRows = getEmtpyDeal();
            }

            await addTable(
                sheet2,
                tableName4,
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
                requestsPrimaryRows
            );

            sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
            sheet.getCell('C1').font = {bold: true};
            sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
            sheet2.getCell('C1').font = {bold: true};

            sheet.getCell('B2').value = 'TOTAL (diario)';
            sheet.getCell('B2').font = {bold: true};
            sheet2.getCell('B2').value = 'TOTAL (diario)';
            sheet2.getCell('B2').font = {bold: true};
            
            sheet.getCell('G2').value = 'TOTAL (semanal)';
            sheet.getCell('G2').font = {bold: true};
            sheet2.getCell('G2').value = 'TOTAL (semanal)';
            sheet2.getCell('G2').font = {bold: true};

            sheet.getCell('L2').value = 'TOTAL (mensual)';
            sheet.getCell('L2').font = {bold: true};
            sheet2.getCell('L2').value = 'TOTAL (mensual)';
            sheet2.getCell('L2').font = {bold: true};
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsMonthTokenDealsReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsMonthTokenDealsReport.xlsx');
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

    async getPackableDealsReportV3(
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

        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);

        let promises: any = [];

        for (let i = 0; i < tokensArray.length; i++) {
            //2 sheets per token (1 per market)
            let sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
            let sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');

            promises.push(this.setPackableDealsSheetV2(
                sheet, 
                timeLow, 
                timeHigh, 
                tokensArray[i]
            ));

            promises.push(this.setPrimaryPackableDealsSheetV2(
                sheet2, 
                timeLow, 
                timeHigh, 
                tokensArray[i]
            ));
        }

        await Promise.all(promises);

        try {
            await workbook.xlsx.writeFile('PiMarketsPackableDealsReportV3.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsPackableDealsReportV3.xlsx');
            } catch (err) {
                console.error(err);
            }
        }
    }

    async setPackableDealsSheet(
        sheet: any,
        sheet2: any,
        timeLow: number,
        timeHigh: number,
        token: any
    ) {
        //define vars
        let day = 1;
        let week = 1;
        let month = 1;
        let dayCounter = 0;
        let dayCounterPrimary = 0;
        let weekCounter = 0;
        let weekCounterPrimary = 0;
        let monthCounter = 0;
        let monthCounterPrimary = 0;
        let dayCounterUsd = 0;
        let dayCounterPrimaryUsd = 0;
        let weekCounterUsd = 0;
        let weekCounterPrimaryUsd = 0;
        let monthCounterUsd = 0;
        let monthCounterPrimaryUsd = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let dayRowsPrimary = [];
        let weekRowsPrimary = [];
        let monthRowsPrimary = [];
        let offersRows = [];
        let requestsRows = [];
        let offersPrimaryRows = [];
        let requestsPrimaryRows = [];

        while(_timeHigh <= timeHigh) {
            //1 DAY per iteration

            //define vars
            let dayRow = [];
            let weekRow = [];
            let dayRowPrimary = [];
            let weekRowPrimary = [];
            
            let dayOffers = await try_getPackableOffers(_timeLow, _timeHigh, token.address, this.url);
            let dayOffersPrimary = await try_getPackableOffersPrimary(_timeLow, _timeHigh, token.address, this.url);
            let dayRequests = await try_getPackableRequests(_timeLow, _timeHigh, token.address, this.url);
            let dayRequestsPrimary = await try_getPackableRequestsPrimary(_timeLow, _timeHigh, token.address, this.url);

            if (dayOffers.length > 0) {
                for (let p = 0; p < dayOffers.length; p++) {
                    //1 OFFER per iteration
                    if (dayOffers[p].deals.length > 0) {
                        //1 DEALS ARRAY per iteration
                        let deals = dayOffers[p].deals;
                        for (let q = 0; q < deals.length; q++) {
                            //1 DEAL per iteration
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

                            //DEALS TABLE
                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersRows.push(array);
                            //1 DEAL per iteration
                        }
                        //1 DEALS ARRAY per iteration
                    }
                    //1 OFFER per iteration
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

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersPrimaryRows.push(array);
                            //1 DEAL per iteration
                        }
                        //1 DEALS ARRAY per iteration
                    }
                    //1 OFFER per iteration
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

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            requestsRows.push(array);
                            //1 DEAL per iteration
                        }
                        //1 DEALS ARRAY per iteration
                    }
                    //1 OFFER per iteration
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

                            let array = [];

                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            requestsPrimaryRows.push(array);
                        }
                    }
                }
            }

            if (day == 7 * week) {
                //1 WEEK per iteration

                //SECONDARY
                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounterUsd);
                if (weekCounter == 0) weekCounter = 1;
                weekRow.push(weekCounterUsd / weekCounter);
                weekRows.push(weekRow);

                weekCounter = 0;
                weekCounterUsd = 0;

                //PRIMARY
                weekRowPrimary.push(week);
                weekRowPrimary.push(weekCounterPrimary);
                weekRowPrimary.push(weekCounterPrimaryUsd);
                if (weekCounterPrimary == 0) weekCounterPrimary = 1;
                weekRowPrimary.push(weekCounterPrimaryUsd / weekCounterPrimary);
                weekRowsPrimary.push(weekRowPrimary);

                weekCounterPrimary = 0;
                weekCounterPrimaryUsd = 0;

                week++;
                //1 WEEK per iteration
            }

            //secondary
            dayRow.push(day);
            dayRow.push(dayCounter);
            dayRow.push(dayCounterUsd);
            if (dayCounter == 0) dayCounter = 1;
            dayRow.push(dayCounterUsd / dayCounter);
            dayRows.push(dayRow);

            dayCounter = 0;
            dayCounterUsd = 0;

            //primary
            dayRowPrimary.push(day);
            dayRowPrimary.push(dayCounterPrimary);
            dayRowPrimary.push(dayCounterPrimaryUsd);
            if (dayCounterPrimary == 0) dayCounterPrimary = 1;
            dayRowPrimary.push(dayCounterPrimaryUsd / dayCounterPrimary);
            dayRowsPrimary.push(dayRowPrimary);

            dayCounterPrimary = 0;
            dayCounterPrimaryUsd = 0;
            
            day++;
            _timeLow = _timeHigh;
            _timeHigh = _timeLow + ONE_UTC_DAY;
            //1 DAY per iteration
        }

        //5th week...days (29-31)
        //secondary
        let weekRow = [];
        let monthRow = [];

        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounterUsd);
        if (weekCounter == 0) weekCounter = 1;
        weekRow.push(weekCounterUsd / weekCounter);
        weekRows.push(weekRow);

        //primary
        let weekRowPrimary = [];
        let monthRowPrimary = []; 

        weekRowPrimary.push(week);
        weekRowPrimary.push(weekCounterPrimary);
        weekRowPrimary.push(weekCounterPrimaryUsd);
        if (weekCounterPrimary == 0) weekCounterPrimary = 1;
        weekRowPrimary.push(weekCounterPrimaryUsd / weekCounterPrimary);
        weekRowsPrimary.push(weekRowPrimary);

        //MONTH
        //secondary
        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounterUsd);
        if (monthCounter == 0) monthCounter = 1;
        monthRow.push(monthCounterUsd / monthCounter);
        monthRows.push(monthRow);

        //primary
        monthRowPrimary.push(month);
        monthRowPrimary.push(monthCounterPrimary);
        monthRowPrimary.push(monthCounterPrimaryUsd);
        if (monthCounterPrimary == 0) monthCounterPrimary = 1;
        monthRowPrimary.push(monthCounterPrimaryUsd / monthCounterPrimary);
        monthRowsPrimary.push(monthRowPrimary);

        //ADD TABLES
        let tableDay = 'TablaDay' + token.symbol;
        let tableWeek = 'TablaWeek' + token.symbol;
        let tableMonth = 'TablaMonth' + token.symbol;
        let tableDayPrimary = 'TablaDayPrimary' + token.symbol;
        let tableWeekPrimary = 'TablaWeekPrimary' + token.symbol;
        let tableMonthPrimary = 'TablaMonthPrimary' + token.symbol;

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

        sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet.getCell('B36').font = {bold: true};
        let tableName = 'Tabla' + token.symbol;

        if (offersRows.length == 0) {
            offersRows = getEmtpyDeal();
        }

        addTable(
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
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersRows
        );

        sheet.getCell('K36').value = 'PACTOS (' + token.symbol + ' DEMANDADO)';
        sheet.getCell('K36').font = {bold: true};
        let tableName2 = 'Tabla2' + token.symbol;

        if (requestsRows.length == 0) {
            requestsRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName2,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsRows
        );

        sheet2.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet2.getCell('B36').font = {bold: true};
        let tableName3 = 'TablaPrimario' + token.symbol;

        if (offersPrimaryRows.length == 0) {
            offersPrimaryRows = getEmtpyDeal();
        }

        addTable(
            sheet2,
            tableName3,
            'B37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersPrimaryRows
        );

        sheet2.getCell('K36').value = token.symbol + ' DEMANDADO';
        sheet2.getCell('K36').font = {bold: true};
        let tableName4 = 'TablaPrimario2' + token.symbol;

        if (requestsPrimaryRows.length == 0) {
            requestsPrimaryRows = getEmtpyDeal();
        }

        addTable(
            sheet2,
            tableName4,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsPrimaryRows
        );

        sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
        sheet.getCell('C1').font = {bold: true};
        sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
        sheet2.getCell('C1').font = {bold: true};

        sheet.getCell('B2').value = 'TOTAL (diario)';
        sheet.getCell('B2').font = {bold: true};
        sheet2.getCell('B2').value = 'TOTAL (diario)';
        sheet2.getCell('B2').font = {bold: true};
        
        sheet.getCell('G2').value = 'TOTAL (semanal)';
        sheet.getCell('G2').font = {bold: true};
        sheet2.getCell('G2').value = 'TOTAL (semanal)';
        sheet2.getCell('G2').font = {bold: true};

        sheet.getCell('L2').value = 'TOTAL (mensual)';
        sheet.getCell('L2').font = {bold: true};
        sheet2.getCell('L2').value = 'TOTAL (mensual)';
        sheet2.getCell('L2').font = {bold: true};
    }

    async setPackableDealsSheetV2(
        sheet: any,
        timeLow: number,
        timeHigh: number,
        token: any
    ) {
        //define vars
        let day = 1;
        let week = 1;
        let month = 1;
        let dayCounter = 0;
        let weekCounter = 0;
        let monthCounter = 0;
        let dayCounterUsd = 0;
        let weekCounterUsd = 0;
        let monthCounterUsd = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let offersRows = [];
        let requestsRows = [];

        let dayOffers = await try_getPackableOffers(timeLow, timeHigh, token.address, this.url);
        let dayRequests = await try_getPackableRequests(timeLow, timeHigh, token.address, this.url);

        let nextOffer: any;
        let nextTimestamp: number;
        let nextIsOffer: boolean;

        if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
            nextOffer = dayRequests.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = false;
        } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
            nextOffer = dayOffers.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = true;
        } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
            let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
            let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;

            if (nextOfferTimestamp < nextRequestTimestamp) {
                nextOffer = dayOffers.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = true;
            } else {
                nextOffer = dayRequests.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = false;
            }
        } else {
            nextTimestamp = 0;
        }

        while (_timeHigh <= timeHigh) {

            while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                //compute offer
                if (nextOffer.deals.length > 0) {
                    if (nextIsOffer) {
                        //COMPUTE OFFER
                        let deals = nextOffer.deals;
                        for (let q = 0; q < deals.length; q++) {
                            //1 DEAL per iteration
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
    
                            //DEALS TABLE
                            let array = [];
    
                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersRows.push(array);
                            //1 DEAL per iteration
                        }
                    } else {
                        //COMPUTE REQUEST
                        let deals = nextOffer.deals;
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
    
                            let array = [];
    
                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
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
                } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                    nextOffer = dayOffers.pop();
                    nextTimestamp = nextOffer.timestamp;
                    nextIsOffer = true;
                } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                    let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                    let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
        
                    if (nextOfferTimestamp < nextRequestTimestamp) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    } else {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                } else {
                    nextTimestamp = 0;
                }
            }

            //compute day
            let dayRow = [];

            //secondary
            dayRow.push(day);
            dayRow.push(dayCounter);
            dayRow.push(dayCounterUsd);
            if (dayCounter == 0) dayCounter = 1;
            dayRow.push(dayCounterUsd / dayCounter);
            dayRows.push(dayRow);

            dayCounter = 0;
            dayCounterUsd = 0;

            day++;
            _timeLow = _timeHigh;
            _timeHigh = _timeLow + ONE_UTC_DAY;

            //compute week
            if (day == 7 * week) {
                //WEEK
                let weekRow = [];
                //secondary
                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounterUsd);
                if (weekCounter == 0) weekCounter = 1;
                weekRow.push(weekCounterUsd / weekCounter);
                weekRows.push(weekRow);

                weekCounter = 0;
                weekCounterUsd = 0;
                week++;
            }
        }

        //5th week...days (29-31)
        //secondary
        let weekRow = [];
        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounterUsd);
        if (weekCounter == 0) weekCounter = 1;
        weekRow.push(weekCounterUsd / weekCounter);
        weekRows.push(weekRow);

        //MONTH
        //secondary
        let monthRow = [];
        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounterUsd);
        if (monthCounter == 0) monthCounter = 1;
        monthRow.push(monthCounterUsd / monthCounter);
        monthRows.push(monthRow);

        //ADD TABLES
        let tableDay = 'TablaDay' + token.symbol;
        let tableWeek = 'TablaWeek' + token.symbol;
        let tableMonth = 'TablaMonth' + token.symbol;

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

        sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet.getCell('B36').font = {bold: true};
        let tableName = 'Tabla' + token.symbol;

        if (offersRows.length == 0) {
            offersRows = getEmtpyDeal();
        }

        addTable(
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
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersRows
        );

        sheet.getCell('K36').value = 'PACTOS (' + token.symbol + ' DEMANDADO)';
        sheet.getCell('K36').font = {bold: true};
        let tableName2 = 'Tabla2' + token.symbol;

        if (requestsRows.length == 0) {
            requestsRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName2,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsRows
        );

        sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
        sheet.getCell('C1').font = {bold: true};

        sheet.getCell('B2').value = 'TOTAL (diario)';
        sheet.getCell('B2').font = {bold: true};
        
        sheet.getCell('G2').value = 'TOTAL (semanal)';
        sheet.getCell('G2').font = {bold: true};

        sheet.getCell('L2').value = 'TOTAL (mensual)';
        sheet.getCell('L2').font = {bold: true};
    }

    async setPrimaryPackableDealsSheetV2(
        sheet: any,
        timeLow: number,
        timeHigh: number,
        token: any
    ) {
        //define vars
        let day = 1;
        let week = 1;
        let month = 1;
        let dayCounter = 0;
        let weekCounter = 0;
        let monthCounter = 0;
        let dayCounterUsd = 0;
        let weekCounterUsd = 0;
        let monthCounterUsd = 0;
        let _timeLow = timeLow;
        let _timeHigh = _timeLow + ONE_UTC_DAY;
        let dayRows = [];
        let weekRows = [];
        let monthRows = [];
        let offersRows = [];
        let requestsRows = [];

        let dayOffers = await try_getPackableOffersPrimary(timeLow, timeHigh, token.address, this.url);
        let dayRequests = await try_getPackableRequestsPrimary(timeLow, timeHigh, token.address, this.url);

        let nextOffer: any;
        let nextTimestamp: number;
        let nextIsOffer: boolean;

        if ((dayOffers.length == 0) && (dayRequests.length > 0)) {
            nextOffer = dayRequests.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = false;
        } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
            nextOffer = dayOffers.pop();
            nextTimestamp = nextOffer.timestamp;
            nextIsOffer = true;
        } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
            let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
            let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;

            if (nextOfferTimestamp < nextRequestTimestamp) {
                nextOffer = dayOffers.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = true;
            } else {
                nextOffer = dayRequests.pop();
                nextTimestamp = nextOffer.timestamp;
                nextIsOffer = false;
            }
        } else {
            nextTimestamp = 0;
        }

        while (_timeHigh <= timeHigh) {

            while ((_timeLow < nextTimestamp) && (nextTimestamp < _timeHigh)) {
                //compute offer
                if (nextOffer.deals.length > 0) {
                    if (nextIsOffer) {
                        //COMPUTE OFFER
                        let deals = nextOffer.deals;
                        for (let q = 0; q < deals.length; q++) {
                            //1 DEAL per iteration
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
    
                            //DEALS TABLE
                            let array = [];
    
                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.buyToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            offersRows.push(array);
                            //1 DEAL per iteration
                        }
                    } else {
                        //COMPUTE REQUEST
                        let deals = nextOffer.deals;
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
    
                            let array = [];
    
                            array.push(new Date(deals[q].timestamp * 1000));
                            array.push(timeConverter(deals[q].offer.timestamp));
                            array.push(timeConverter(deals[q].timestamp));
                            array.push(deals[q].offer.sellToken.tokenSymbol);
    
                            if (deals[q].seller.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].seller.name);
                            }
    
                            if (deals[q].buyer.name == null) {
                                array.push("");
                            } else {
                                array.push(deals[q].buyer.name);
                            }
    
                            array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[q].sellAmount)));
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
                } else if ((dayRequests.length == 0) && (dayOffers.length > 0)) {
                    nextOffer = dayOffers.pop();
                    nextTimestamp = nextOffer.timestamp;
                    nextIsOffer = true;
                } else if ((dayOffers.length > 0) || (dayRequests.length > 0)) {
                    let nextOfferTimestamp = dayOffers[dayOffers.length - 1].timestamp;
                    let nextRequestTimestamp = dayRequests[dayRequests.length - 1].timestamp;
        
                    if (nextOfferTimestamp < nextRequestTimestamp) {
                        nextOffer = dayOffers.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = true;
                    } else {
                        nextOffer = dayRequests.pop();
                        nextTimestamp = nextOffer.timestamp;
                        nextIsOffer = false;
                    }
                } else {
                    nextTimestamp = 0;
                }
            }

            //compute day
            let dayRow = [];

            //secondary
            dayRow.push(day);
            dayRow.push(dayCounter);
            dayRow.push(dayCounterUsd);
            if (dayCounter == 0) dayCounter = 1;
            dayRow.push(dayCounterUsd / dayCounter);
            dayRows.push(dayRow);

            dayCounter = 0;
            dayCounterUsd = 0;

            day++;
            _timeLow = _timeHigh;
            _timeHigh = _timeLow + ONE_UTC_DAY;

            //compute week
            if (day == 7 * week) {
                //WEEK
                let weekRow = [];
                //secondary
                weekRow.push(week);
                weekRow.push(weekCounter);
                weekRow.push(weekCounterUsd);
                if (weekCounter == 0) weekCounter = 1;
                weekRow.push(weekCounterUsd / weekCounter);
                weekRows.push(weekRow);

                weekCounter = 0;
                weekCounterUsd = 0;
                week++;
            }
        }

        //5th week...days (29-31)
        //secondary
        let weekRow = [];
        weekRow.push(week);
        weekRow.push(weekCounter);
        weekRow.push(weekCounterUsd);
        if (weekCounter == 0) weekCounter = 1;
        weekRow.push(weekCounterUsd / weekCounter);
        weekRows.push(weekRow);

        //MONTH
        //secondary
        let monthRow = [];
        monthRow.push(month);
        monthRow.push(monthCounter);
        monthRow.push(monthCounterUsd);
        if (monthCounter == 0) monthCounter = 1;
        monthRow.push(monthCounterUsd / monthCounter);
        monthRows.push(monthRow);

        //ADD TABLES
        let tableDayPrimary = 'TablaDayPrimary' + token.symbol;
        let tableWeekPrimary = 'TablaWeekPrimary' + token.symbol;
        let tableMonthPrimary = 'TablaMonthPrimary' + token.symbol;

        addTable(
            sheet,
            tableDayPrimary,
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
            tableWeekPrimary,
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
            tableMonthPrimary,
            'L3',
            [
                {name: 'Mes', filterButton: true},
                {name: 'Monto', totalsRowFunction: 'sum'},
                {name: 'Monto (USD)', totalsRowFunction: 'sum'},
                {name: 'Tipo de cambio'}
            ],
            monthRows
        );

        sheet.getCell('B36').value = 'PACTOS (' + token.symbol + ' OFERTADO)';
        sheet.getCell('B36').font = {bold: true};
        let tableName3 = 'TablaPrimario' + token.symbol;

        if (offersRows.length == 0) {
            offersRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName3,
            'B37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            offersRows
        );

        sheet.getCell('K36').value = token.symbol + ' DEMANDADO';
        sheet.getCell('K36').font = {bold: true};
        let tableName4 = 'TablaPrimario2' + token.symbol;

        if (requestsRows.length == 0) {
            requestsRows = getEmtpyDeal();
        }

        addTable(
            sheet,
            tableName4,
            'K37',
            [
                {name: 'Fecha (pacto)', filterButton: true},
                {name: 'Hora (oferta)'},
                {name: 'Hora (pacto)'},
                {name: 'Contrapartida', filterButton: true},
                {name: 'Vendedor (usuario)', filterButton: true},
                {name: 'Comprador (usuario)', filterButton: true},
                {name: 'Monto pactado (primario) (' + token.symbol + ')', totalsRowFunction: 'sum'},
                {name: 'Monto contrapartida', totalsRowFunction: 'sum'}
            ],
            requestsRows
        );

        sheet.getCell('C1').value = 'Mercado P2P (Primario)';
        sheet.getCell('C1').font = {bold: true};

        sheet.getCell('B2').value = 'TOTAL (diario)';
        sheet.getCell('B2').font = {bold: true};
        
        sheet.getCell('G2').value = 'TOTAL (semanal)';
        sheet.getCell('G2').font = {bold: true};

        sheet.getCell('L2').value = 'TOTAL (mensual)';
        sheet.getCell('L2').font = {bold: true};
    }

    async getPackableDealsReportV2(
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

        let timeLow = getUtcTimeFromDate(year, monthIndex, 1);
        let timeHigh = getUtcTimeFromDate(toYear, toMonthIndex, 1);

        for (let i = 0; i < tokensArray.length; i++) {
            //1 TOKEN per iteration

            //define vars
            let day = 1;
            let week = 1;
            let month = 1;
            let dayCounter = 0;
            let dayCounterPrimary = 0;
            let weekCounter = 0;
            let weekCounterPrimary = 0;
            let monthCounter = 0;
            let monthCounterPrimary = 0;
            let dayCounterUsd = 0;
            let dayCounterPrimaryUsd = 0;
            let weekCounterUsd = 0;
            let weekCounterPrimaryUsd = 0;
            let monthCounterUsd = 0;
            let monthCounterPrimaryUsd = 0;
            let _timeLow = timeLow;
            let _timeHigh = _timeLow + ONE_UTC_DAY;
            let dayRows = [];
            let weekRows = [];
            let monthRows = [];
            let dayRowsPrimary = [];
            let weekRowsPrimary = [];
            let monthRowsPrimary = [];
            let offersRows = [];
            let requestsRows = [];
            let offersPrimaryRows = [];
            let requestsPrimaryRows = [];

            //2 sheets per token (1 per market)
            let sheet = workbook.addWorksheet(tokensArray[i].symbol + '2°');
            let sheet2 = workbook.addWorksheet(tokensArray[i].symbol + '1°');

            while(_timeHigh <= timeHigh) {
                //1 DAY per iteration

                //define vars
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
                        //1 OFFER per iteration
                        if (dayOffers[p].deals.length > 0) {
                            //1 DEALS ARRAY per iteration
                            let deals = dayOffers[p].deals;
                            for (let q = 0; q < deals.length; q++) {
                                //1 DEAL per iteration
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

                                //DEALS TABLE
                                let array = [];

                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.buyToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                offersRows.push(array);
                                //1 DEAL per iteration
                            }
                            //1 DEALS ARRAY per iteration
                        }
                        //1 OFFER per iteration
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

                                let array = [];
    
                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.buyToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                offersPrimaryRows.push(array);
                                //1 DEAL per iteration
                            }
                            //1 DEALS ARRAY per iteration
                        }
                        //1 OFFER per iteration
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

                                let array = [];
    
                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.sellToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                requestsRows.push(array);
                                //1 DEAL per iteration
                            }
                            //1 DEALS ARRAY per iteration
                        }
                        //1 OFFER per iteration
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

                                let array = [];
    
                                array.push(new Date(deals[q].timestamp * 1000));
                                array.push(timeConverter(deals[q].offer.timestamp));
                                array.push(timeConverter(deals[q].timestamp));
                                array.push(deals[q].offer.sellToken.tokenSymbol);
        
                                if (deals[q].seller.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].seller.name);
                                }
        
                                if (deals[q].buyer.name == null) {
                                    array.push("");
                                } else {
                                    array.push(deals[q].buyer.name);
                                }
        
                                array.push(parseFloat(weiToEther(deals[q].buyAmount)));
                                array.push(parseFloat(weiToEther(deals[q].sellAmount)));
                                requestsPrimaryRows.push(array);
                            }
                        }
                    }
                }

                if (day == 7 * week) {
                    //1 WEEK per iteration

                    //SECONDARY
                    weekRow.push(week);
                    weekRow.push(weekCounter);
                    weekRow.push(weekCounterUsd);
                    if (weekCounter == 0) weekCounter = 1;
                    weekRow.push(weekCounterUsd / weekCounter);
                    weekRows.push(weekRow);

                    weekCounter = 0;
                    weekCounterUsd = 0;

                    //PRIMARY
                    weekRowPrimary.push(week);
                    weekRowPrimary.push(weekCounterPrimary);
                    weekRowPrimary.push(weekCounterPrimaryUsd);
                    if (weekCounterPrimary == 0) weekCounterPrimary = 1;
                    weekRowPrimary.push(weekCounterPrimaryUsd / weekCounterPrimary);
                    weekRowsPrimary.push(weekRowPrimary);

                    weekCounterPrimary = 0;
                    weekCounterPrimaryUsd = 0;

                    week++;
                    //1 WEEK per iteration
                }

                //secondary
                dayRow.push(day);
                dayRow.push(dayCounter);
                dayRow.push(dayCounterUsd);
                if (dayCounter == 0) dayCounter = 1;
                dayRow.push(dayCounterUsd / dayCounter);
                dayRows.push(dayRow);

                dayCounter = 0;
                dayCounterUsd = 0;

                //primary
                dayRowPrimary.push(day);
                dayRowPrimary.push(dayCounterPrimary);
                dayRowPrimary.push(dayCounterPrimaryUsd);
                if (dayCounterPrimary == 0) dayCounterPrimary = 1;
                dayRowPrimary.push(dayCounterPrimaryUsd / dayCounterPrimary);
                dayRowsPrimary.push(dayRowPrimary);

                dayCounterPrimary = 0;
                dayCounterPrimaryUsd = 0;
                
                day++;
                _timeLow = _timeHigh;
                _timeHigh = _timeLow + ONE_UTC_DAY;
                //1 DAY per iteration
            }

            //5th week...days (29-31)
            //secondary
            let weekRow = [];
            let monthRow = [];

            weekRow.push(week);
            weekRow.push(weekCounter);
            weekRow.push(weekCounterUsd);
            if (weekCounter == 0) weekCounter = 1;
            weekRow.push(weekCounterUsd / weekCounter);
            weekRows.push(weekRow);

            //primary
            let weekRowPrimary = [];
            let monthRowPrimary = []; 

            weekRowPrimary.push(week);
            weekRowPrimary.push(weekCounterPrimary);
            weekRowPrimary.push(weekCounterPrimaryUsd);
            if (weekCounterPrimary == 0) weekCounterPrimary = 1;
            weekRowPrimary.push(weekCounterPrimaryUsd / weekCounterPrimary);
            weekRowsPrimary.push(weekRowPrimary);

            //MONTH
            //secondary
            monthRow.push(month);
            monthRow.push(monthCounter);
            monthRow.push(monthCounterUsd);
            if (monthCounter == 0) monthCounter = 1;
            monthRow.push(monthCounterUsd / monthCounter);
            monthRows.push(monthRow);

            //primary
            monthRowPrimary.push(month);
            monthRowPrimary.push(monthCounterPrimary);
            monthRowPrimary.push(monthCounterPrimaryUsd);
            if (monthCounterPrimary == 0) monthCounterPrimary = 1;
            monthRowPrimary.push(monthCounterPrimaryUsd / monthCounterPrimary);
            monthRowsPrimary.push(monthRowPrimary);

            //ADD TABLES
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

            sheet.getCell('B36').value = 'PACTOS (' + tokensArray[i].symbol + ' OFERTADO)';
            sheet.getCell('B36').font = {bold: true};
            let tableName = 'Tabla' + tokensArray[i].symbol;

            if (offersRows.length == 0) {
                offersRows = getEmtpyDeal();
            }

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
                offersRows
            );

            sheet.getCell('K36').value = 'PACTOS (' + tokensArray[i].symbol + ' DEMANDADO)';
            sheet.getCell('K36').font = {bold: true};
            let tableName2 = 'Tabla2' + tokensArray[i].symbol;

            if (requestsRows.length == 0) {
                requestsRows = getEmtpyDeal();
            }

            await addTable(
                sheet,
                tableName2,
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
                requestsRows
            );

            sheet2.getCell('B36').value = 'PACTOS (' + tokensArray[i].symbol + ' OFERTADO)';
            sheet2.getCell('B36').font = {bold: true};
            let tableName3 = 'TablaPrimario' + tokensArray[i].symbol;

            if (offersPrimaryRows.length == 0) {
                offersPrimaryRows = getEmtpyDeal();
            }

            await addTable(
                sheet2,
                tableName3,
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
                offersPrimaryRows
            );

            sheet2.getCell('K36').value = tokensArray[i].symbol + ' DEMANDADO';
            sheet2.getCell('K36').font = {bold: true};
            let tableName4 = 'TablaPrimario2' + tokensArray[i].symbol;

            if (requestsPrimaryRows.length == 0) {
                requestsPrimaryRows = getEmtpyDeal();
            }

            await addTable(
                sheet2,
                tableName4,
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
                requestsPrimaryRows
            );

            sheet.getCell('C1').value = 'Mercado P2P (Secundario)';
            sheet.getCell('C1').font = {bold: true};
            sheet2.getCell('C1').value = 'Mercado P2P (Primario)';
            sheet2.getCell('C1').font = {bold: true};

            sheet.getCell('B2').value = 'TOTAL (diario)';
            sheet.getCell('B2').font = {bold: true};
            sheet2.getCell('B2').value = 'TOTAL (diario)';
            sheet2.getCell('B2').font = {bold: true};
            
            sheet.getCell('G2').value = 'TOTAL (semanal)';
            sheet.getCell('G2').font = {bold: true};
            sheet2.getCell('G2').value = 'TOTAL (semanal)';
            sheet2.getCell('G2').font = {bold: true};

            sheet.getCell('L2').value = 'TOTAL (mensual)';
            sheet.getCell('L2').font = {bold: true};
            sheet2.getCell('L2').value = 'TOTAL (mensual)';
            sheet2.getCell('L2').font = {bold: true};
        }

        try {
            await workbook.xlsx.writeFile('PiMarketsMonthPackableDealsReport.xlsx');
        } catch (error) {
            let buffer = await workbook.xlsx.writeBuffer();
            
            try {
                await FileSaver.saveAs(new Blob([buffer]), 'PiMarketsMonthPackableDealsReport.xlsx');
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

async function try_getTransactions(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let transactions: any;
    try {
        transactions = await getTransactions(_timeLow, _timeHigh, token, url);
        return transactions;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            transactions = await try_getTransactions(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return transactions;
        } else {
            console.error(error);
            throw new Error(error);
        }
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

async function try_getOffers(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getOffers(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getOffers(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getRequests(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getRequests(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getRequests(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getRequests(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getOffersPrimary(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getOffersPrimary(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getRequestsPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getRequestsPrimary(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getRequestsPrimary(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getRequestsPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getCollectableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getCollectableOffers(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getCollectableOffers(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getCollectableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getCollectableOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getCollectableOffersPrimary(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getCollectableOffersPrimary(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getCollectableOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerCommodities (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp sellId { tokenId metadata reference} } seller { id name } buyer { id name } buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getPackableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getPackableOffers(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getPackableOffers(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getPackableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getPackableRequests(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getPackableRequests(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getPackableRequests(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getPackableRequests(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getPackableOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getPackableOffersPrimary(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getPackableOffersPrimary(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getPackableOffersPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function try_getPackableRequestsPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    token: string,
    url: string,
    retries: number = 0
) {
    let offers: any;
    try {
        offers = await getPackableRequestsPrimary(_timeLow, _timeHigh, token, url);
        return offers;
    } catch (error) {
        if (retries < 10) {
            retries++;
            console.log("-- REINTENTO DE QUERY: " + retries);  
            offers = await try_getPackableRequestsPrimary(_timeLow, _timeHigh, token, url, retries + 1);
            console.log("-- REINTENTO EXITOSO --");
            return offers;
        } else {
            console.error(error);
            throw new Error(error);
        }
    }
}

async function getPackableRequestsPrimary(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string,
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { timestamp deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol id } sellToken { tokenSymbol id } timestamp } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offerPackables;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getPiPrice(
    _timeLow: number, 
    _timeHigh: number, 
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ prices (where: {timestamp_gte: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '} orderBy: timestamp, orderDirection:asc, first: 1000, skip: ' + skip + ') { id supply collateral piPrice collateralPrice timestamp } }'
    let queryService = new Query('piprice', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryPrices = response.prices;
    let prices = queryPrices;

    while(queryPrices.length >= 1000) {
        skip = prices.length;
        let query = '{ prices (where: {timestamp_gte: ' + _timeLow + ', timestamp_lt: ' + _timeHigh + '} orderBy: timestamp, orderDirection:asc, first: 1000, skip: ' + skip + ') { id supply collateral piPrice collateralPrice timestamp } }'
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryPrices = response.offerPackables;
        prices = prices.concat(queryPrices);
    }

    return prices;
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

function getEmtpyDeal() {
    let rows: any[] = [];
    let array: any[] = [];

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
    let rows: any[] = [];
    let array: any[] = [];

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
                if (
                    (token == Constants.BTC.address) ||
                    (token == Constants.ETH.address) ||
                    (token == Constants.USDT.address)
                ) {
                    rates.push(responseData[i].rate/factor);
                } else {
                    rates.push((1/(responseData[i].rate))/factor);
                }
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
    } else if (token == Constants.PI.address) {
        let dates = convertMonthAndYearToUTC(fromYear, fromMonth, toYear, toMonth);
        let rates = [];

        try {
            let responseData = await getPiPrice(dates[0], dates[1], 'mainnet');

            for (let i = 23; i < responseData.length; i=i+24) {
                rates.push(responseData[i].piPrice);
            }

            let len = 31 - rates.length;

            if (len > 0) {
                for (let j = 0; j < len; j++) {
                    rates.push(0);
                }
            }

            let rates2 = await getDayRate(fromYear, fromMonth, toYear, toMonth, Constants.BTC.address, Constants.BTC.category);

            let rates3 = [];

            for (let j = 0; j < rates.length; j++) {
                rates3.push(rates[j] * rates2[j]);
            }

            return rates3;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    } else {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}

function convertMonthAndYearToUTC(
    fromYear: number,
    fromMonth: number,
    toYear: number,
    toMonth: number
) {
    let fromDate = new Date();
    fromDate.setFullYear(fromYear);
    fromDate.setMonth(fromMonth - 1);
    fromDate.setDate(1);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    let toDate = new Date();
    toDate.setFullYear(toYear);
    toDate.setMonth(toMonth - 1);
    toDate.setDate(1);
    toDate.setHours(0);
    toDate.setMinutes(0);
    toDate.setSeconds(0);
    toDate.setMilliseconds(0);

    return [Math.floor(fromDate.getTime()/1000), Math.floor(toDate.getTime()/1000)];
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
        let rates = await getPiPrice(timestamp, (timestamp + ONE_UTC_DAY), 'mainnet');

        if (rates.length == 0) {
            return 0;
        } else {
            let rate = rates[rates.length - 1].piPrice;

            let rates2 = await requestRateEndPoint(from, to, Constants.BTC.address);

            if (rates2.length == 0) {
                return 0;
            } else {
                let rate2 = rates2[rates2.length - 1].rate;

                return amount * rate * rate2;
            }
        }
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

            if (
                (token == Constants.BTC.address) ||
                (token == Constants.ETH.address) ||
                (token == Constants.USDT.address)
            ) {
                rate = 1 / rate;
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