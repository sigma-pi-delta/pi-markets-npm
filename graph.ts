import * as Constants from './constants';

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

    constructor(subgraph: "bank" | "p2p" | "market" | string, url: string = 'mainnet') {
        this.query = '{ <entity> ( where:{ <filter> } first: 1000 skip: 0 <order> ) { <property> }}';

        if (url == 'mainnet') {
            this.url = Constants.RPC_URL;

            if (subgraph == 'bank') {
                this.subgraph = Constants.BANK_SUBGRAPH;
            } else if (subgraph == 'p2p') {
                this.subgraph = Constants.P2P_SUBGRAPH;
            } else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH;
            } else {
                this.subgraph = subgraph;
            }
        } else if (url == 'testnet') {
            this.url = Constants.RPC_URL_TESTNET;

            if (subgraph == 'bank') {
                this.subgraph = Constants.BANK_SUBGRAPH_TESTNET;
            } else if (subgraph == 'p2p') {
                this.subgraph = Constants.P2P_SUBGRAPH_TESTNET;
            } else if (subgraph == 'market') {
                this.subgraph = Constants.MARKETS_SUBGRAPH_TESTNET;
            } else {
                this.subgraph = subgraph;
            }
        } else {
            this.url = url;
            this.subgraph = subgraph;
        }
    }

    setCustomQuery(query: string) {
        this.query = query;
    }

    setEntity(entity: string) {
        let newQuery = this.query.replace("<entity>", entity);
        this.query = newQuery;
    }

    setPagination(first: number, skip: number) {
        let pagination = 'first: ' + first + ' skip: ' + skip;
        let newQuery = this.query.replace("first: 1000 skip: 0", pagination);
        this.query = newQuery;
    }

    setOrder(orderBy: string, orderDirection: 'asc' | 'desc') {
        let order = 'orderBy: ' + orderBy + ' orderDirection: ' + orderDirection;
        let newQuery = this.query.replace("<order>", order);
        this.query = newQuery;
    }

    setProperty(property: string) {
        let newProperty = property + ' { <subproperty> } <property>';
        let newQuery = this.query.replace("<order>", newProperty);
        this.query = newQuery;
    }

    setSubproperty(property: string, subproperty: string) {
        let searchString = property + ' { <subproperty>';
        let replaceString: string;

        
        
        if (this.query.indexOf(searchString) !== -1) {

            if (this.query.indexOf(property) !== -1) {
                searchString = property;
            }
        }

        /*if (!this.query.includes(searchString)) {

            if (this.query.includes(property)) {
                searchString = property;
            }
        }*/

        replaceString = searchString + subproperty;
        let newQuery = this.query.replace(searchString, replaceString);
        this.query = newQuery;
    }

    setFilter(filter: string) {
        let searchString = 'where: { <filter> ';
        let replaceString = searchString + filter;
        let newQuery = this.query.replace(searchString, replaceString);
        this.query = newQuery;
    }

    clean() {
        let regexp1 = /<property>/gi;
        let regexp2 = /<subproperty>/gi;
        let regexp3 = /<order>/gi;
        let regexp4 = /<filter>/gi;
        let empty = "";
        let noProperty = this.query.replace(regexp1, empty);
        let noSubproperty = noProperty.replace(regexp2, empty);
        let noOrder = noSubproperty.replace(regexp3, empty);
        let noFilter = noOrder.replace(regexp4, empty);
        this.query = noFilter;
    }
}