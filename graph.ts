import * as Constants from './constants';
import fetch from 'node-fetch';
import * as Utils from './utils'

export class Graph {

    async querySubgraph(_query: Query) {
        let response: any;
        let responseData: any;
    
        try {
            response = await fetch(_query.url + _query.subgraph, {
                "method": 'POST',
                "headers": {
                    "Accept": 'application/json',
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify({
                    query: _query.query
                }),
            });

            if (response.ok) {
                responseData = await response.json();
            }

            return responseData.data;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}

export class Query {
    public query: string;
    public subgraph: string;
    public url: string;
    public first: number;
    public skip: number;
    public isClean: boolean;

    constructor(
        subgraph: "bank" | 
            "p2p" | 
            "market" | 
            "p2p-primary" | 
            "auction" | 
            "piprice" | 
            "dividend" | 
            "dex" | 
            "dex-bicentenario" | 
            "registry" | 
            string, 
        url: string = 'mainnet'
    ) {
        this.query = '{ <entity> ( where:{ <filter> } first: 1000 skip: 0 <order> ) { <property> }}';
        this.first = 1000;
        this.skip = 0;
        this.isClean = false;

        if (url == 'mainnet') {
            this.url = Constants.GRAPH_URL;

            if (subgraph == 'bank') {
                this.subgraph = Constants.BANK_SUBGRAPH;
            } else if (subgraph == 'p2p') {
                this.subgraph = Constants.P2P_SUBGRAPH;
            } else if (subgraph == 'p2p-primary') {
                this.subgraph = Constants.P2P_PRIMARY_SUBGRAPH;
            } else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH;
            } else if (subgraph == 'auction') {
                this.subgraph = Constants.AUCTION_SUBGRAPH;
            } else if (subgraph == 'piprice') {
                this.subgraph = Constants.PIPRICE_SUBGRAPH;
            } else if (subgraph == 'dividend') {
                this.subgraph = Constants.DIVIDENDS_SUBGRAPH;
            } else if (subgraph == 'dex') {
                this.subgraph = Constants.DEX_SUBGRAPH;
            } else if (subgraph == 'dex-bicentenario') {
                this.subgraph = Constants.DEX_BICENTENARIO_SUBGRAPH;
            } else if (subgraph == 'registry') {
                this.subgraph = Constants.REGISTRY_SUBGRAPH;
            } else {
                this.subgraph = subgraph;
            }
        } else if (url == 'testnet') {
            this.url = Constants.GRAPH_URL_TESTNET;

            if (subgraph == 'bank') {
                this.subgraph = Constants.BANK_SUBGRAPH_TESTNET;
            } else if (subgraph == 'p2p') {
                this.subgraph = Constants.P2P_SUBGRAPH_TESTNET;
            } else if (subgraph == 'p2p-primary') {
                this.subgraph = Constants.P2P_PRIMARY_SUBGRAPH_TESTNET;
            } else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH_TESTNET;
            } else if (subgraph == 'auction') {
                this.subgraph = Constants.AUCTION_SUBGRAPH_TESTNET;
            } else if (subgraph == 'piprice') {
                this.subgraph = Constants.PIPRICE_SUBGRAPH_TESTNET;
            } else if (subgraph == 'dividend') {
                this.subgraph = Constants.DIVIDENDS_SUBGRAPH_TESTNET;
            } else if (subgraph == 'dex') {
                this.subgraph = Constants.DEX_SUBGRAPH_TESTNET;
            } else if (subgraph == 'dex-bicentenario') {
                this.subgraph = Constants.DEX_BICENTENARIO_SUBGRAPH_TESTNET;
            } else if (subgraph == 'registry') {
                this.subgraph = Constants.REGISTRY_SUBGRAPH_TESTNET;
            } else {
                this.subgraph = subgraph;
            }
        } else {
            this.url = url;
            this.subgraph = subgraph;
        }
    }

    async buildRequest(
        entity: string, 
        filter: string, 
        pagination: number[], 
        order: string[], 
        props: string[][]
    ) {
        this.build(entity, filter, pagination, order, props);
        return await this.request();
    }

    build(
        entity: string, 
        filter: string, 
        pagination: number[], 
        order: string[], 
        props: string[][]
    ) {
        //TODO: validar todo

        this.setEntity(entity);
        this.setFilter(filter);
        this.setPagination(pagination[0], pagination[1]);

        if (order[1] == 'asc') {
            this.setOrder(order[0], 'asc');
        } else if (order[1] == 'desc') {
            this.setOrder(order[0], 'desc');
        }

        for (let i = 0; i < props[0].length; i++) {
            this.setProperty(props[0][i]);
        }

        for (let j = 1; j < props.length; j++) {
            for (let k = 1; k < props[j].length; k++) {
                this.setSubproperty(props[j][0], props[j][k]);
            }
        }

        this.clean();
    }

    async request() {
        let graph = new Graph();

        try {
            let response = await graph.querySubgraph(this);
            return response;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }

        //TODO?: Incluir this.first & this.skip y gestionar cuando length == 1000 == first
        //para repetir la query modificando first y skip en la query. Aunque quizás no se quiere
        //y es mejor gestionarlo desde fuera.
    }

    setCustomQuery(query: string) {
        this.query = query;
    }

    setEntity(entity: string) {
        if (!this.isClean) {
            let newQuery = this.query.replace("<entity>", entity);
            this.query = newQuery;
        } else {
            throw new Error('Query is built and clean, create a new one');
        }
    }

    setPagination(first: number, skip: number) {
        let searchString = 'first: ' + this.first + ' skip: ' + this.skip;
        let pagination = 'first: ' + first + ' skip: ' + skip;
        let newQuery = this.query.replace(searchString, pagination);
        this.query = newQuery;
        this.first = first;
        this.skip = skip;
    }

    setOrder(orderBy: string, orderDirection: 'asc' | 'desc') {
        if (!this.isClean) {
            let order = 'orderBy: ' + orderBy + ' orderDirection: ' + orderDirection;
            let newQuery = this.query.replace("<order>", order);
            this.query = newQuery;
        } else {
            throw new Error('Query is built and clean, create a new one');
        }
    }

    setProperty(property: string) {
        if (!this.isClean) {
            let newProperty = property + ' { <subproperty> } <property>';
            let newQuery = this.query.replace("<property>", newProperty);
            this.query = newQuery;
        } else {
            throw new Error('Query is built and clean, create a new one');
        }
    }

    setSubproperty(property: string, subproperty: string) {

        if (!this.isClean) {
            let searchString = property + ' { <subproperty> ';
            let replaceString: string;

            if (this.query.indexOf(searchString) == -1) {

                if (this.query.indexOf(property) !== -1) {
                    searchString = property;
                }
            }

            replaceString = searchString + subproperty + ' { <subproperty> } ';
            let newQuery = this.query.replace(searchString, replaceString);
            this.query = newQuery;
        } else {
            throw new Error('Query is built and clean, create a new one');
        }
    }

    setFilter(filter: string) {

        if (!this.isClean) {
            let searchString = 'where: { <filter> ';
            let replaceString = searchString + filter;
            let newQuery = this.query.replace(searchString, replaceString);
            this.query = newQuery;
        } else {
            throw new Error('Query is built and clean, create a new one');
        }
    }

    clean() {
        let regexp1 = /<property>/gi;
        let regexp2 = /<subproperty>/gi;
        let regexp3 = /<order>/gi;
        let regexp4 = /<filter>/gi;
        let regexp5 = /where:{ }/gi;
        let regexp6 = /{ }/gi;
        let empty = "";
        let noProperty = this.query.replace(regexp1, empty);
        let noSubproperty = noProperty.replace(regexp2, empty);
        let noOrder = noSubproperty.replace(regexp3, empty);
        let noFilter = noOrder.replace(regexp4, empty);
        let noSpaces = noFilter.replace(/ +(?= )/g,'');
        let noEmptyWhere = noSpaces.replace(regexp5, empty);
        let noEmptyBraces = noEmptyWhere.replace(regexp6, empty);
        let noDuplicateSpaces = noEmptyBraces.replace(/ +(?= )/g,'');
        this.query = noDuplicateSpaces;
        this.isClean = true;
    }
}

export class QueryTemplates {
    readonly network: string;

    constructor(
        network: string = 'mainnet'
    ) {
        this.network = network;
    }

    /******** BANK */

    async getWalletByName(name: string) {
        let customQuery = '{ name(id:"' + name + '") { wallet { id } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.id;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getNameByWallet(name: string) {
        let customQuery = '{ wallet(id:"' + name.toLowerCase() + '") { name { id } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.wallet.name.id;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getAddressesByName(name: string) {
        let customQuery = '{ name(id:"' + name + '") { wallet { id identity { id owner } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return [response.name.wallet.id, response.name.wallet.identity.id, response.name.wallet.identity.owner];
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getOwnerByName(name: string) {
        let customQuery = '{ name(id:"' + name + '") { wallet { identity { owner } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.identity.owner;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getSmartIDs(skip: number) {
        let customQuery = '{ identities (first:1000, skip: ' + skip + ', orderBy:timestamp, orderDirection:asc) { identity hashDD } }';
        let query = new Query('registry', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.identities;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getNamesByIdentityArray(identitiesArray: string[], skip: number) {
        let stringArray = identitiesArray.join('", "');
        let customQuery = '{ identities(first: 1000, skip: ' + skip + ' where:{id_in:["' + stringArray + '"]}) {id wallet { id name { id } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.identities;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTransactionsByName(
        name: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number
    ) {
        let customQuery = '{ name(id:"' + name + '") { wallet { transactions (orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.transactions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTransactionsByNameByTokens(
        name: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        token: string
    ) {
        let customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{currency: ' + token +'}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.transactions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTransactionsFromNameByTokens(
        name: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        token: string
    ) {
        let from = await this.getWalletByName(name);
        let customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{from: ' + from  + ', currency: ' + token +'}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.transactions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTransactionsToNameByTokens(
        name: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        token: string
    ) {
        let to = await this.getWalletByName(name);
        let customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{to: ' + to  + ', currency: ' + token +'}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.transactions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTransactionsFromNameToNameByTokens(
        nameFrom: string,
        nameTo: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        token: string
    ) {
        let from = await this.getWalletByName(nameFrom);
        let to = await this.getWalletByName(nameTo);
        let customQuery = '{ name(id:"' + name + '") { wallet { transactions ( where:{from: ' + from + ', to: ' + to  + ', currency: ' + token +'}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.transactions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getBalancesByName(name: string) {
        let customQuery = '{ name(id:"' + name + '") { wallet { balances { token { id tokenSymbol tokenKind } balance packables { balances { balance packableId { id } } } commodities { tokenId reference metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.balances;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getBalancesByNameByTokens(name: string, tokensArray: string[]) {
        let customQuery = '{ name(id:"' + name + '") { wallet { balances (where:{token_in:' + tokensArray + '}) { token { id tokenSymbol tokenKind } balance packables { balances { balance packableId { id } } } commodities { tokenId reference metadata } } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.name.wallet.balances;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTokens(tokensArray: string[]) {
        let customQuery = '{ tokens (where:{id_in:' + tokensArray + '}) { id tokenSymbol tokenName tokenKind } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.tokens;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTransactionsByTokens(
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        tokensArray: string[]
    ) {
        let customQuery = '{ transactions ( where:{currency_in:' + tokensArray + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { from { id name { id } } to { id name { id } } currency { id tokenSymbol tokenKind } amount timestamp bankTransaction { concept } packableId pnftDescription { metadata } nftDescription { reference tokenId metadata } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.transactions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getTokenHolders(
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        token: string
    ) {
        let customQuery = '{ tokenBalances(where:{token:"' + token + '", balance_gt: 0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { token { id tokenSymbol } balance wallet { id name { id } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.tokenBalances;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getNFTHolders(
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        token: string
    ) {
        let customQuery = '{ tokenBalances(where:{token:"' + token + '", balance_gt: 0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { token { id tokenSymbol } balance commodities { tokenId reference metadata } wallet { id name { id } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.tokenBalances;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getPackableHolders(
        tokenAddress: string,
        packableId: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number
    ) {
        let tokenPackableId = tokenAddress + "-" + packableId
        let customQuery = '{ packableBalances (where: {packableId:"' + tokenPackableId + '", balance_gt:0}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first +', skip: ' + skip + ') { packableId { id } balance wallet { id name { id } } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.packableBalances;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    /******** P2P */

    async getOffers(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        market: "p2p" | "p2p-primary" = "p2p"
    ) {
        let customQuery = '{ offers(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation } sellToken { id tokenSymbol } initialSellAmount sellAmount buyToken { id tokenSymbol } sellAmount price isPartial isBuyFiat isSellFiat minDealAmount maxDealAmount minReputation isOpen auditor description country payMethod payAccount timestamp deals { id } } }';
        let query = new Query(market, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.offers;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getPackableOffers(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        market: "p2p" | "p2p-primary" = "p2p"
    ) {
        let customQuery = '{ offerPackables(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: '+ orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation } sellToken { id tokenSymbol } initialSellAmount sellAmount sellId { tokenId metadata } buyToken { id tokenSymbol } sellAmount price price_per_unit isPartial isBuyFiat isSellFiat minDealAmount maxDealAmount minReputation isOpen auditor description country payMethod payAccount timestamp deals { id } } }';
        let query = new Query(market, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.offerPackables;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getNFTOffers(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        market: "p2p" | "p2p-primary" = "p2p"
    ) {
        let customQuery = '{ offerCommodities(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation } sellToken { id tokenSymbol } sellId { tokenId metadata reference } buyToken { id tokenSymbol } price isBuyFiat minReputation isOpen auditor description country payMethod payAccount timestamp deals { id } } }';
        let query = new Query(market, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.offerCommodities;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getDeals(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        market: "p2p" | "p2p-primary" = "p2p"
    ) {
        let customQuery = '{ deals(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id offer { id sellToken { id tokenSymbol } buyToken { id tokenSymbol } } seller { id name offchainReputation } buyer { id offchainReputation } sellAmount buyAmount sellerVote buyerVote auditorVote isPending isSuccess executor timestamp } }';
        let query = new Query(market, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.deals;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getPackableDeals(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        market: "p2p" | "p2p-primary" = "p2p"
    ) {
        let customQuery = '{ dealPackables(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id offer { id sellToken { id tokenSymbol } buyToken { id tokenSymbol } sellId { tokenId metadata } } seller { id name offchainReputation } buyer { id offchainReputation } sellAmount buyAmount sellerVote buyerVote auditorVote isPending isSuccess executor timestamp } }';
        let query = new Query(market, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.dealPackables;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getNFTDeals(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number,
        market: "p2p" | "p2p-primary" = "p2p"
    ) {
        let customQuery = '{ dealCommodities(where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id offer { id sellToken { id tokenSymbol } buyToken { id tokenSymbol } sellId { tokenId metadata reference } } seller { id name offchainReputation } buyer { id offchainReputation } buyAmount sellerVote buyerVote auditorVote isPending isSuccess executor timestamp } }';
        let query = new Query(market, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.dealPackables;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    /******** MARKET */

    async getTransfersCommission() {
        let customQuery = '{ controllers { commission } }';
        let query = new Query('market', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.controllers[0].commission;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    /******** AUCTIONS */

    async getAuctions(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number
    ) {
        let customQuery = '{ auctions (where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id owner { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } auctionToken { id tokenSymbol } auctionAmount auctionCollectable { tokenId metadata reference } auctionPackable { tokenId metadata } bidToken { id tokenSymbol } bidPrice minValue maxBid maxBidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } startTime endTime auditor category bids (orderBy:bid, orderDirection:desc) { bid bidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } bidEntity { isCancel } timestamp } isOpen isClose isDealPaid isDealCancelled isKillable isKilled } }';
        let query = new Query("auction", this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.auctions;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getBids(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number
    ) {
        let customQuery = '{ bids (where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { bid bidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } timestamp isCancel auctionToken { id tokenSymbol } bidToken { id tokenSymbol } auction { id owner { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } auctionToken { id tokenSymbol } auctionAmount auctionCollectable { tokenId metadata reference } auctionPackable { tokenId metadata } bidToken { id tokenSymbol } bidPrice minValue maxBid maxBidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } startTime endTime auditor category bids (orderBy:bid, orderDirection:desc) { bid bidder { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } bidEntity { isCancel } timestamp } isOpen isClose isDealPaid isDealCancelled isKillable isKilled } } }';
        let query = new Query("auction", this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.bids;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getAuctionsUserStats(
        filter: string,
        orderBy: string,
        orderDirection: "asc" | "desc",
        first: number,
        skip: number
    ) {
        let customQuery = '{ users (where:{' + filter + '}, orderBy: ' + orderBy + ', orderDirection: ' + orderDirection + ', first: ' + first + ', skip: ' + skip + ') { id name offchainReputation auctionsAsOwner biddedAuctions totalBids bidderGoodDeals bidderBadDeals } }';
        let query = new Query("auction", this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return response.users;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getAuctionsCommission() {
        let customQuery = '{ factories { commission } }';
        let query = new Query("auction", this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            if (response != undefined) return Utils.weiToEther(response.factories[0].commission);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    /******** DEX */

    async getOrdersSkip(
        skip: number,
        dex: "dex" | "dex-bicentenario" = "dex"
    ) {
        let customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
        let query = new Query(dex, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();

            if (response != undefined) {
                let queryOrders = response.orders;
                let orders = queryOrders;

                let _skip = skip;
                while(queryOrders.length >= 1000) {
                    skip = orders.length + _skip;
                    customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
                    query.setCustomQuery(customQuery);
                    response = await query.request();
                    if (response != undefined) {
                        queryOrders = response.orders;
                        orders = orders.concat(queryOrders);
                    } else {
                        queryOrders = [];
                    }
                }

                return orders;
            }
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getOpenOrdersNotInArray(
        ordersArray: string[],
        dex: "dex" | "dex-bicentenario" = "dex"
    ) {
        let skip = 0;
        let stringArray = ordersArray.join('", "');
        let customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true, id_not_in:["' + stringArray + '"]}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
        let query = new Query(dex, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();

            if (response != undefined) {
                let queryOrders = response.orders;
                let orders = queryOrders;

                let _skip = skip;
                while(queryOrders.length >= 1000) {
                    skip = orders.length + _skip;
                    customQuery = '{ orders(first:1000, skip: ' + skip + ', where: {open:true, id_not_in:["' + stringArray + '"]}, orderBy: blockNumber, orderDirection:asc) { id owner { id name }, sellToken { id tokenSymbol } buyToken { id tokenSymbol } isPackable packableId { tokenId metadata } amount price side open cancelled dealed timestamp blockNumber } }';
                    query.setCustomQuery(customQuery);
                    response = await query.request();
                    if (response != undefined) {
                        queryOrders = response.orders;
                        orders = orders.concat(queryOrders);
                    } else {
                        queryOrders = [];
                    }
                }

                return orders;
            }
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getCancelationsSkip(
        skip: number,
        dex: "dex" | "dex-bicentenario" = "dex"
    ) {
        let customQuery = '{ cancelations(first:1000, skip:' + skip + ', orderBy: blockNumber, orderDirection:asc) { id order { owner { id name } } timestamp blockNumber } }';
        let query = new Query(dex, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();

            if (response != undefined) {
                let queryOrders = response.cancelations;
                let orders = queryOrders;

                let _skip = skip;
                while(queryOrders.length >= 1000) {
                    skip = orders.length + _skip;
                    customQuery = '{ cancelations(first:1000, skip:' + skip + ', orderBy: blockNumber, orderDirection:asc) { id order { owner { id name } } timestamp blockNumber } }';
                    query.setCustomQuery(customQuery);
                    response = await query.request();
                    if (response != undefined) {
                        queryOrders = response.cancelations;
                        orders = orders.concat(queryOrders);
                    } else {
                        queryOrders = [];
                    }
                }

                return orders;
            }
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getInstrumentOrderbook(
        token: string,
        baseToken: string,
        dex: "dex" | "dex-bicentenario" = "dex"
    ) {
        let skip = 0;
        let array = [];
        array.push(token);
        array.push(baseToken);
        let stringArray = array.join('", "');
        let customQuery = '{ orders(skip: ' + skip + ' where:{sellToken_in:["' + stringArray + '"], buyToken_in:["' + stringArray + '"], open:true}, first:1000, orderBy: price, orderDirection:asc) { amount side price buyToken {id} sellToken {id} } }';
        let query = new Query(dex, this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();

            if (response != undefined) {
                let queryOrders = response.orders;
                let orders = queryOrders;

                while(queryOrders.length >= 1000) {
                    skip = orders.length;
                    customQuery = '{ orders(skip: ' + skip + ' where:{sellToken_in:["' + stringArray + '"], buyToken_in:["' + stringArray + '"], open:true}, first:1000, orderBy: price, orderDirection:asc) { amount side price buyToken {id} sellToken {id} } }';
                    query.setCustomQuery(customQuery);
                    response = await query.request();
                    if (response != undefined) {
                        queryOrders = response.orders;
                        orders = orders.concat(queryOrders);
                    } else {
                        queryOrders = [];
                    }
                }

                let buyAmountByPrice = {};
                let sellAmountByPrice = {};
                let sellPrices = [];
                let buyPrices = [];

                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i];
                    let price = parseFloat(Utils.weiBNToEtherString(order.price));
                    let amount = parseFloat(Utils.weiBNToEtherString(order.amount));

                    if (
                        (order.side == 1) && 
                        (order.sellToken.id == baseToken) && 
                        (order.buyToken.id == token)
                    ) {
                        //SELL
                        if (!sellPrices.includes(price)) sellPrices.push(price);

                        if (sellAmountByPrice[price] != undefined) {
                            sellAmountByPrice[price] = sellAmountByPrice[price] + amount;
                        } else {
                            sellAmountByPrice[price] = amount;
                        }
                    } else if (
                        (order.side == 2) && 
                        (order.sellToken.id == token) && 
                        (order.buyToken.id == baseToken)
                    ) {
                        //BUY
                        if (!buyPrices.includes(price)) buyPrices.push(price);

                        amount = amount/price;
                        if (buyAmountByPrice[price] != undefined) {
                            buyAmountByPrice[price] = buyAmountByPrice[price] + amount;
                        } else {
                            buyAmountByPrice[price] = amount;
                        }
                    }
                }

                return [sellAmountByPrice, buyAmountByPrice];
            }
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async isBicentenarioAllowed(
        wallet: string
    ) {
        let customQuery = '{ user(id:"' + wallet.toLowerCase() + '") { allowed allowedPackable } }';
        let query = new Query('dex-bicentenario', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();

            if (response != undefined) return response.user;
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }
}