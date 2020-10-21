![PiMarkets Logo](logo-pi-markets.png)
# PiMarkets ®
PiMarkets Package is a Javascript library for dealing with Pi Markets smart contracts and Pi Blockchain.

## Table of Contents

- [PiMarkets ®](#pimarkets-)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Documentation](#documentation)
    - [Blockchain](#blockchain)
    - [Contracts](#contracts)
    - [Wallets](#wallets)
    - [Graph](#graph)
    - [SmartID](#smartid)
  - [Contributing](#contributing)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install pi-markets.

Using npm:

```bash
npm install pi-markets
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/pi-markets@0.0.27/index.min.js"></script>
```

## Usage
```javascript
const pimarkets = require('pi-markets');

// Blockchain Class Example
const blockchainService = new pimarkets.Blockchain('mainnet');
let blockNumber = await blockchainService.getBlockNumber();

// Query Example
let queryTemplates = new pimarkets.QueryTemplates('mainnet');
let balances = await queryTemplates.getBalancesByName('<username>');

// Smart Contract Call Example
let contractService = new pimarkets.Contracts('mainnet');
let controllerContract = contractService.getContractCaller(
    pimarkets.Constants.CONTROLLER_ADDRESS,
    pimarkets.Constants.CONTROLLER_ABI
);
let owner = await controllerContract.owner();

```


## Documentation

Usage examples for different classes and methods.

### Blockchain

Class used to simple blockchain request. Request like latest block number or nonce for an account.

```javascript
const pimarkets = require('pi-markets');

// Connect to MainNet
const blockchainMainnet = new pimarkets.Blockchain('mainnet');

// Connect to TestNet
const blockchainTestnet = new pimarkets.Blockchain('testnet');

// Connect to custom node
const blockchainLocal = new pimarkets.Blockchain('http://127.0.0.1:8545');

// Examples

// Get latest block number
let blockNumber = await blockchainMainnet.getBlockNumber();
console.log(blockNumber);

// Get Pi balance for an address
let address = '0x...';
let balance = await blockchainMainnet.getBalance(address);
console.log(balance);

```

### Contracts

Class used to interact with Pi Markets smart contracts or any other smart contract deployed in Pi Blockchain.

```javascript
const pimarkets = require('pi-markets');

let contractService = new pimarkets.Contracts('mainnet');

// Controller SC call
let controllerContract = contractService.getContractCaller(
    pimarkets.Constants.CONTROLLER_ADDRESS,
    pimarkets.Constants.CONTROLLER_ABI
);
let owner = await controllerContract.owner();
console.log(owner);

// Token BTC SC call
let btcToken = contractService.getContractCaller(
    pimarkets.Constants.BTC,
    pimarkets.Constants.TOKEN_ABI
);
let address = '0x...';
let balance = await btcToken.balanceOf(address);
console.log(pimarkets.Utils.weiToEther(balance));

```

### Wallets

Class used to handle the creation of wallets in different ways.

```javascript
const pimarkets = require('pi-markets');

// Returned wallets are connected to service's network
let walletService = new pimarkets.Wallets('mainnet');

// Create a new wallet
let wallet1 = walletService.createWalletFromEntropy('source_of_entropy');

// Import an existing wallet
let mnemonic = 'enemy skate bunker deposit vicious hint alarm sword owner bind cost draft';
let wallet2 = walletService.createWalletFromMnemonic(mnemonic, pimarkets.Constants.PATH_0);

```

### Graph

Class used to create queries and request them to different Pi Markets subgraphs providing fast and customizable information.

```javascript
const pimarkets = require('pi-markets');

// There are different ways of building a query

// FIRST WAY
let query = new pimarkets.Query('bank', 'testnet');
let entity = 'identities';
let filter = 'creationTime_gt: 1602166415';
let pagination = [5, 0]; // [first, skip]
let order = ['creationTime', 'desc'];
let properties = ['wallet', 'id', 'owner'];
let subproperties = ['wallet', 'id', 'name'];
let subproperties2 = ['name', 'id'];
let props = [properties, subproperties, subproperties2];

// Queries can be built and requested with the same method

try {
    console.log(await query.buildRequest(entity, filter, pagination, order, props));
} catch(error) {
    console.error(error);
}

// When having an already built query you can modify some params like pagination so you don't have to rebuild it
query.setPagination(5, 5); //(first, skip)
try {
    console.log(await query.request());
} catch(error) {
    console.error(error);
}

// SECOND WAY
let query2 = new pimarkets.Query('bank', 'testnet');
let customQuery = '{ name(id:"user_name") { wallet { id } } }';
query2.setCustomQuery(customQuery);
try {
    let response = await query2.request();
    console.log(response);
} catch(error) {
    console.error(error);
}

// THIRD WAY
let queryTemplates = new pimarkets.QueryTemplates('mainnet');
let filter = 'sellToken: "' + pimarkets.Constants.EUR + '" ';

try {
    let offersEur = await queryTemplates.getOffers(filter, 'timestamp', 'desc', 3, 0);
    console.log(offersEur);
} catch(error) {
    console.error(error);
}

```

### SmartID

Class used to .

```javascript
const pimarkets = require('pi-markets');

// First login when device is empty (no identity and wallet address)
let loginService = new pimarkets.SmartIDLogin('mainnet');
let digitalIdentity = await loginService.firstLogin(
    "user_name",
    "{...}",
    "password"
);

// Create the smartID so any action can be done
let smartID = new pimarkets.SmartID(
    digitalIdentity.signer,
    digitalIdentity.identity,
    digitalIdentity.wallet,
    'mainnet'
);

// Example of simple transfer of 10 PI
let transfer = new pimarkets.TransferRequest(
    pimarkets.Constants.PI,
    "0x...",
    pimarkets.Utils.etherStringToWeiBN("10"),
    "Insert transfer concept",
    pimarkets.Utils.stringToBN("2")
);

try {
    let receipt = await smartID.transfer(transfer);
    console.log(receipt);
} catch (error) {
    console.error(error);
}

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.