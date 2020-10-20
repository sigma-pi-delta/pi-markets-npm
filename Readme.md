![PiMarkets Logo](logo-pi-circle.png)
# PiMarkets ®
PiMarkets Package is a Javascript library for dealing with Pi Markets smart contracts and Pi Blockchain.

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
    pimarkets.Constants.CONTROLLER_ADDRESS_TESTNET,
    pimarkets.Constants.CONTROLLER_ABI
)
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
let address = "0x...";
let balance = await blockchainMainnet.getBalance(address);
console.log(balance);

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.