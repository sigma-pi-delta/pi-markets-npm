//import ExcelJS from 'exceljs';
const ExcelJS = require('exceljs');
import { Query, QueryTemplates } from './graph';
import { weiToEther } from './utils';
const FileSaver = require('file-saver');

export class Report {

    public url: string;

    constructor(
        url: string = 'mainnet'
    ) {
        this.url = url;
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
                offers = await queryTemplates.getPackableOffers(
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
                                {name: 'Fecha', filterButton: true},
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
    
                            array.push(parseFloat(weiToEther(deals[k].buyAmount)));
                            array.push(parseFloat(weiToEther(deals[k].sellAmount)));
                            rows.push(array);
                        }      
                        
                        sheet.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('I2').font = {bold: true};
                        let tableName = 'Tabla2' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'I3',
                            [
                                {name: 'Fecha', filterButton: true},
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
                                {name: 'Fecha', filterButton: true},
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
                        
                        sheet2.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('I2').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'I3',
                            [
                                {name: 'Fecha', filterButton: true},
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
                                {name: 'Fecha', filterButton: true},
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
                        
                        sheet.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet.getCell('I2').font = {bold: true};
                        let tableName = 'Tabla2' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet,
                            tableName,
                            'I3',
                            [
                                {name: 'Fecha', filterButton: true},
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
                                {name: 'Fecha', filterButton: true},
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
                        
                        sheet2.getCell('I2').value = tokensArray[i].symbol + ' DEMANDADO';
                        sheet2.getCell('I2').font = {bold: true};
                        let tableName = 'TablaPrimario' + tokensArray[i].symbol;
    
                        await addTable(
                            sheet2,
                            tableName,
                            'I3',
                            [
                                {name: 'Fecha', filterButton: true},
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offers;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offers (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
        queryService.setCustomQuery(query);
        response = await queryService.request();
        queryOffers = response.offers;
        offers = offers.concat(queryOffers);
    }

    return offers;
}

async function getPackableOffers(
    _timeLow: number, 
    _timeHigh: number, 
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {sellToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { buyToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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
    _tokensAddress: string[],
    _url: string = 'mainnet'
) {
    let skip = 0;
    let query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
    let queryService = new Query('p2p-primary', _url);
    queryService.setCustomQuery(query);
    let response = await queryService.request();
    let queryOffers = response.offerPackables;
    let offers = queryOffers;

    while(queryOffers.length >= 1000) {
        skip = offers.length;
        query = '{ offerPackables (where: {buyToken: "' + _tokensAddress + '", timestamp_gt: ' + _timeLow + ', timestamp_lt: ' + _timeHigh +'}, orderBy: timestamp, orderDirection:desc, first: 1000, skip: ' + skip + ') { deals(where:{isSuccess:true}) { offer { sellToken { tokenSymbol } } seller { id name } buyer { id name } sellAmount buyAmount timestamp } } }';
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