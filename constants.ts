// URL
const RPC_URL = "https://connect.pichain.io";
const RPC_URL_TESTNET = "https://testnet.pimarkets.io";
const TRACES_URL = "http://18.192.148.106:8545";
const GRAPH_URL = "https://graph.pimarkets.io";
const GRAPH_URL_TESTNET = "https://graph-test.pimarkets.io";

// SUBGRAPHS
const BANK_SUBGRAPH = "/subgraphs/name/gperezalba/bank-subgraph-mainnet";
const BANK_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/bank-subgraph-testnet";
const MARKETS_SUBGRAPH = "/subgraphs/name/gperezalba/markets-subgraph-mainnet";
const MARKETS_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/markets-subgraph-testnet";
const P2P_SUBGRAPH = "/subgraphs/name/gperezalba/p2p-v2-mainnet";
const P2P_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/p2p-v2-testnet";
const P2P_PRIMARY_SUBGRAPH = "/subgraphs/name/gperezalba/p2p-primary-v2-mainnet";
const P2P_PRIMARY_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/p2p-primary-v2-testnet";
const AUCTION_SUBGRAPH = "/subgraphs/name/gperezalba/auction-subgraph-mainnet";
const AUCTION_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/auction-subgraph-testnet";
const PIPRICE_SUBGRAPH = "/subgraphs/name/gperezalba/piprice-subgraph-mainnet";
const PIPRICE_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/piprice-subgraph-testnet";
const DIVIDENDS_SUBGRAPH = "/subgraphs/name/gperezalba/dividends-subgraph-mainnet";
const DIVIDENDS_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/dividends-subgraph-testnet";
const DEX_SUBGRAPH = "/subgraphs/name/gperezalba/dex-subgraph-mainnet";
const DEX_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/dex-subgraph-testnet";
const REGISTRY_SUBGRAPH = "/subgraphs/name/gperezalba/registry-subgraph-mainnet";
const REGISTRY_SUBGRAPH_TESTNET = "/subgraphs/name/gperezalba/registry-subgraph-testnet";

// ABIS
const CONTROLLER_ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"kinds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isFactory","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isNFToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newDiamondOwner","type":"address"}],"name":"setDiamondOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token1","type":"address"},{"name":"_token2","type":"address"},{"name":"_market","type":"address"}],"name":"setNewMarket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopCuts","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"setNewToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes4"}],"name":"facets","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"diamondCut","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"markets","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newCommission","type":"uint256"}],"name":"setTxCommission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"switcher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopUpgrades","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cuttable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_category","type":"uint256"}],"name":"setNewNFToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"commission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"diamondOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newSwitcher","type":"address"}],"name":"setSwitcher","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"addresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kind","type":"uint256"},{"name":"_address","type":"address"},{"name":"_isFactory","type":"bool"}],"name":"setNewAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_switcher","type":"address"},{"name":"_facets","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewSwitcher","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"kind","type":"uint256"},{"indexed":false,"name":"contractAddress","type":"address"},{"indexed":false,"name":"isFactory","type":"bool"}],"name":"NewAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newToken","type":"address"}],"name":"NewToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newToken","type":"address"},{"indexed":false,"name":"category","type":"uint256"}],"name":"NewNFToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenA","type":"address"},{"indexed":false,"name":"tokenB","type":"address"},{"indexed":false,"name":"market","type":"address"}],"name":"NewMarket","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCommission","type":"uint256"}],"name":"NewCommission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"selector","type":"bytes4"},{"indexed":true,"name":"oldFacet","type":"address"},{"indexed":true,"name":"newFacet","type":"address"}],"name":"DiamondCut","type":"event"}];
const REGISTRY_ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hashes","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"identities","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_identity","type":"address"},{"name":"_dataHash","type":"bytes32"}],"name":"setNewIdentity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hashesDD","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_identity","type":"address"},{"name":"_dataHashDD","type":"bytes32"}],"name":"setNewIdentityDD","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"identitiesDD","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_dataHash","type":"bytes32"}],"name":"isHashAvailable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdrawl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"identity","type":"address"},{"indexed":true,"name":"_dataHash","type":"bytes32"}],"name":"NewIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"identity","type":"address"},{"indexed":true,"name":"_dataHashDD","type":"bytes32"}],"name":"NewIdentityDD","type":"event"}];
const IDENTITY_FACTORY_ABI = [{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_identityOwner","type":"address"},{"name":"_identityRecovery","type":"address"},{"name":"_dataHash","type":"bytes32"},{"name":"_name","type":"string"}],"name":"deployIdentity","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"identity","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"recovery","type":"address"},{"indexed":true,"name":"wallet","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"dataHash","type":"bytes32"}],"name":"DeployIdentity","type":"event"}];
const IDENTITY_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"kinds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_factory","type":"address"},{"name":"_data","type":"bytes"}],"name":"forwardFactory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getFacetCategory","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSelectors","outputs":[{"name":"","type":"bytes4[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rechargeAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"facetCategory","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_destination","type":"address"},{"name":"_data","type":"bytes"}],"name":"forward","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newState","type":"uint256"}],"name":"setState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"minBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"recovery","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_walletAddress","type":"address"}],"name":"setWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_destination","type":"address"},{"name":"_data","type":"bytes"}],"name":"forwardValue","outputs":[{"name":"","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newRecovery","type":"address"}],"name":"setRecovery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"selectors","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"destination","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"},{"indexed":false,"name":"result","type":"bytes"}],"name":"Forward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"kind","type":"uint256"},{"indexed":false,"name":"contractAddress","type":"address"}],"name":"FactoryForward","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewRecovery","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"old","type":"string"},{"indexed":false,"name":"current","type":"string"}],"name":"NewName","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewWallet","type":"event"}];
const WALLET_ABI = [{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferPNFT","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_receivingToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_kind","type":"uint256"}],"name":"exchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onERC721Received","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_transferingToken","type":"address"},{"name":"_transferingAmount","type":"uint256"},{"name":"_to","type":"address"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferExchangeReceiving","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_destination","type":"address"},{"name":"_data","type":"bytes"}],"name":"forwardValuePNFT","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"unlimitDaily","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"nfts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"future8","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferSending","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isNFToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_transferingToken","type":"address"},{"name":"_transferingAmount","type":"uint256"},{"name":"_name","type":"string"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferExchangeDomainReceiving","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"future4","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_receiver","type":"address"},{"name":"_isAllowed","type":"bool"}],"name":"limitTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_transferingToken","type":"address"},{"name":"_sendingAmount","type":"uint256"},{"name":"_to","type":"address"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferExchangeSending","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getFacetCategory","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_transferingToken","type":"address"},{"name":"_sendingAmount","type":"uint256"},{"name":"_name","type":"string"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferExchangeDomainSending","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getSelectors","outputs":[{"name":"","type":"bytes4[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_transferingToken","type":"address"},{"name":"_receivingAmount","type":"uint256"}],"name":"getTransferExchangeInfoReceiving","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_receivingToken","type":"address"},{"name":"_sendingAmount","type":"uint256"}],"name":"getExchangeInfoSending","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"daySpent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNFTokens","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_name","type":"string"},{"name":"_tokenId","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferPNFTDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"future7","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenRef","type":"string"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferNFTRef","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"facetCategory","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_destination","type":"address"},{"name":"_data","type":"bytes"}],"name":"forward","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"future1","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onPNFTReceived","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"future3","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_receivingToken","type":"address"},{"name":"_receivingAmount","type":"uint256"}],"name":"getExchangeInfoReceiving","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dayByToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_transferValue","type":"uint256"}],"name":"getSpendToValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dayLimits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"unlimitValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokens","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"allowedReceiver","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sendingToken","type":"address"},{"name":"_transferingToken","type":"address"},{"name":"_sendingAmount","type":"uint256"}],"name":"getTransferExchangeInfoSending","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_name","type":"string"},{"name":"_tokenRef","type":"string"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferNFTRefDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"future6","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_name","type":"string"},{"name":"_value","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_collector","type":"address"}],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"future5","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isToLimited","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_name","type":"string"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferNFTDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unlimitTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_limit","type":"uint256"}],"name":"limitDaily","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"future2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isValueLimited","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isDayLimited","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"maxValues","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_totalAmount","type":"uint256"}],"name":"getValueToSpend","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"selectors","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_limit","type":"uint256"}],"name":"limitValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_name","type":"string"},{"name":"_value","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferDomainSending","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_amountOrId","type":"uint256"},{"name":"_destination","type":"address"},{"name":"_data","type":"bytes"}],"name":"forwardValue","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"string"},{"name":"_kind","type":"uint256"}],"name":"transferNFT","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"kind","type":"uint256"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"commission","type":"uint256"},{"indexed":false,"name":"data","type":"string"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Receive","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"LimitValue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"destination","type":"address"},{"indexed":false,"name":"isAllowed","type":"bool"}],"name":"LimitTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"dayLimit","type":"uint256"}],"name":"LimitDaily","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"}],"name":"UnlimitValue","type":"event"},{"anonymous":false,"inputs":[],"name":"UnlimitTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"}],"name":"UnlimitDaily","type":"event"}];
const NAME_SERVICE_ABI = [{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"nameIsAvailable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_wallet","type":"address"},{"name":"_owner","type":"address"}],"name":"createName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_nameHash","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"nameOwners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"addr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nameHash","type":"bytes32"}],"name":"nameIsAvailable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"names","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"addresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_wallet","type":"address"}],"name":"changeWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_newOwner","type":"address"}],"name":"changeNameOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_nameHash","type":"bytes32"}],"name":"isNameOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":true,"name":"wallet","type":"address"},{"indexed":true,"name":"owner","type":"address"}],"name":"CreateName","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":true,"name":"wallet","type":"address"}],"name":"ChangeWallet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"ChangeOwner","type":"event"}];
const P2P_ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isTDN","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"goodReputation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token1","type":"address"},{"name":"_token2","type":"address"},{"name":"_oracle","type":"address"}],"name":"setPriceOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"},{"name":"_vote","type":"uint8"}],"name":"voteDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reputationHandler","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newCommission","type":"uint256"}],"name":"setCommission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"offers","outputs":[{"name":"owner","type":"address"},{"name":"sellToken","type":"address"},{"name":"sellAmount","type":"uint256"},{"name":"commission","type":"uint256"},{"name":"isPartial","type":"bool"},{"name":"buyToken","type":"address"},{"name":"buyAmount","type":"uint256"},{"name":"isBuyFiat","type":"bool"},{"name":"minDealAmount","type":"uint256"},{"name":"maxDealAmount","type":"uint256"},{"name":"minReputation","type":"uint256"},{"name":"auditor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"},{"name":"_success","type":"bool"}],"name":"voteDealAuditor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"},{"name":"_buyAmount","type":"uint256"}],"name":"deal","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"}],"name":"requestAuditor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_isTDN","type":"bool"}],"name":"setTDN","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"deals","outputs":[{"name":"sellToken","type":"address"},{"name":"buyToken","type":"address"},{"name":"isBuyFiat","type":"bool"},{"name":"seller","type":"address"},{"name":"buyer","type":"address"},{"name":"buyAmount","type":"uint256"},{"name":"sellAmount","type":"uint256"},{"name":"commission","type":"uint256"},{"name":"vote1","type":"uint8"},{"name":"vote2","type":"uint8"},{"name":"auditor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newHandler","type":"address"}],"name":"setReputationHandler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"offchainReputation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"badReputation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"},{"name":"_buyAmount","type":"uint256"}],"name":"updateBuyAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"salt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"priceOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"commission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"address[2]"},{"name":"_amounts","type":"uint256[2]"},{"name":"_settings","type":"bool[2]"},{"name":"_limits","type":"uint256[3]"},{"name":"_auditor","type":"address"},{"name":"_description","type":"string"},{"name":"_metadata","type":"uint256[]"}],"name":"offer","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_reputation","type":"uint256"}],"name":"updateReputation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"}],"name":"cancelOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dealLockedUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_reputation","type":"address"},{"name":"_commission","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"sellToken","type":"address"},{"indexed":false,"name":"buyToken","type":"address"},{"indexed":false,"name":"sellAmount","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"},{"indexed":false,"name":"isPartial","type":"bool"},{"indexed":false,"name":"isBuyFiat","type":"bool"},{"indexed":false,"name":"limits","type":"uint256[3]"},{"indexed":false,"name":"auditor","type":"address"},{"indexed":false,"name":"description","type":"string"},{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"metadata","type":"uint256[]"}],"name":"NewOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":true,"name":"sender","type":"address"}],"name":"NewDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"sellAmount","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"}],"name":"NewPendingDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"sellAmount","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"}],"name":"UpdateOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"}],"name":"CancelOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"vote","type":"uint8"},{"indexed":false,"name":"counterpartVote","type":"uint8"}],"name":"VoteDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"}],"name":"AuditorNotification","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"reputation","type":"uint256"}],"name":"UpdateReputation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"isLocked","type":"bool"}],"name":"DealLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"commission","type":"uint256"}],"name":"NewCommission","type":"event"}];
const P2P_NFT_ABI = [{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"},{"name":"_vote","type":"uint8"}],"name":"voteDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onERC721Received","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCommission","type":"uint256"}],"name":"setCommission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"offers","outputs":[{"name":"owner","type":"address"},{"name":"sellToken","type":"address"},{"name":"sellId","type":"uint256"},{"name":"buyToken","type":"address"},{"name":"buyAmount","type":"uint256"},{"name":"isBuyFiat","type":"bool"},{"name":"minReputation","type":"uint256"},{"name":"auditor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"},{"name":"_success","type":"bool"}],"name":"voteDealAuditor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sellToken","type":"address"},{"name":"_sellId","type":"uint256"},{"name":"_buyToken","type":"address"},{"name":"_buyAmount","type":"uint256"},{"name":"_isBuyFiat","type":"bool"},{"name":"_minReputation","type":"uint256"},{"name":"_auditor","type":"address"},{"name":"_description","type":"string"},{"name":"_metadata","type":"uint256[]"},{"name":"_fixedBuyer","type":"address"}],"name":"offerFixed","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"}],"name":"requestAuditor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"deals","outputs":[{"name":"sellToken","type":"address"},{"name":"buyToken","type":"address"},{"name":"sellId","type":"uint256"},{"name":"isBuyFiat","type":"bool"},{"name":"seller","type":"address"},{"name":"buyer","type":"address"},{"name":"buyAmount","type":"uint256"},{"name":"vote1","type":"uint8"},{"name":"vote2","type":"uint8"},{"name":"auditor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"},{"name":"_buyAmount","type":"uint256"}],"name":"updateBuyAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"salt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sellToken","type":"address"},{"name":"_sellId","type":"uint256"},{"name":"_buyToken","type":"address"},{"name":"_buyAmount","type":"uint256"},{"name":"_isBuyFiat","type":"bool"},{"name":"_minReputation","type":"uint256"},{"name":"_auditor","type":"address"},{"name":"_description","type":"string"},{"name":"_metadata","type":"uint256[]"}],"name":"offer","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"}],"name":"deal","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"commission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"offerFixedBuyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"}],"name":"cancelOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dealLockedUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_commission","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"sellToken","type":"address"},{"indexed":false,"name":"buyToken","type":"address"},{"indexed":false,"name":"sellId","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"},{"indexed":false,"name":"isBuyFiat","type":"bool"},{"indexed":false,"name":"minReputation","type":"uint256"},{"indexed":false,"name":"auditor","type":"address"},{"indexed":false,"name":"description","type":"string"},{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"metadata","type":"uint256[]"}],"name":"NewOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":true,"name":"sender","type":"address"}],"name":"NewDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"buyAmount","type":"uint256"}],"name":"NewPendingDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"sellId","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"}],"name":"UpdateOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"}],"name":"CancelOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"commission","type":"uint256"}],"name":"NewCommission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"isLocked","type":"bool"}],"name":"DealLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"seller","type":"address"},{"indexed":false,"name":"isSuccess","type":"bool"},{"indexed":false,"name":"sellTokenAddress","type":"address"},{"indexed":false,"name":"buyTokenAddress","type":"address"},{"indexed":false,"name":"dealAmount","type":"uint256"}],"name":"HandleDealReputation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"vote","type":"uint8"},{"indexed":false,"name":"counterpartVote","type":"uint8"}],"name":"VoteDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"}],"name":"AuditorNotification","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"fixedBuyer","type":"address"}],"name":"FixedBuyer","type":"event"}];
const P2P_PNFT_ABI = [{"constant":false,"inputs":[{"name":"_tokens","type":"address[2]"},{"name":"_tokenId","type":"bytes32"},{"name":"_amounts","type":"uint256[2]"},{"name":"_settings","type":"bool[2]"},{"name":"_limits","type":"uint256[3]"},{"name":"_auditor","type":"address"},{"name":"_description","type":"string"},{"name":"_metadata","type":"uint256[]"},{"name":"_fixedBuyer","type":"address"}],"name":"offerFixed","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isTDN","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"},{"name":"_vote","type":"uint8"}],"name":"voteDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCommission","type":"uint256"}],"name":"setCommission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"offers","outputs":[{"name":"owner","type":"address"},{"name":"sellToken","type":"address"},{"name":"tokenId","type":"bytes32"},{"name":"sellAmount","type":"uint256"},{"name":"isPartial","type":"bool"},{"name":"buyToken","type":"address"},{"name":"buyAmount","type":"uint256"},{"name":"isBuyFiat","type":"bool"},{"name":"minDealAmount","type":"uint256"},{"name":"maxDealAmount","type":"uint256"},{"name":"minReputation","type":"uint256"},{"name":"auditor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"},{"name":"_success","type":"bool"}],"name":"voteDealAuditor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"},{"name":"_buyAmount","type":"uint256"}],"name":"deal","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dealId","type":"bytes32"}],"name":"requestAuditor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"deals","outputs":[{"name":"sellToken","type":"address"},{"name":"buyToken","type":"address"},{"name":"tokenId","type":"bytes32"},{"name":"isBuyFiat","type":"bool"},{"name":"seller","type":"address"},{"name":"buyer","type":"address"},{"name":"buyAmount","type":"uint256"},{"name":"sellAmount","type":"uint256"},{"name":"vote1","type":"uint8"},{"name":"vote2","type":"uint8"},{"name":"auditor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onPNFTReceived","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"address[2]"},{"name":"_tokenId","type":"bytes32"},{"name":"_amounts","type":"uint256[2]"},{"name":"_settings","type":"bool[2]"},{"name":"_limits","type":"uint256[3]"},{"name":"_auditor","type":"address"},{"name":"_description","type":"string"},{"name":"_metadata","type":"uint256[]"}],"name":"offer","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"},{"name":"_buyAmount","type":"uint256"}],"name":"updateBuyAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"salt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"priceOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"commission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"offerFixedBuyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_offerId","type":"bytes32"}],"name":"cancelOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dealLockedUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_commission","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"sellToken","type":"address"},{"indexed":false,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"buyToken","type":"address"},{"indexed":false,"name":"sellAmount","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"},{"indexed":false,"name":"isPartial","type":"bool"},{"indexed":false,"name":"isBuyFiat","type":"bool"},{"indexed":false,"name":"limits","type":"uint256[3]"},{"indexed":false,"name":"auditor","type":"address"},{"indexed":false,"name":"description","type":"string"},{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"metadata","type":"uint256[]"}],"name":"NewOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":true,"name":"sender","type":"address"}],"name":"NewDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"sellAmount","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"}],"name":"NewPendingDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"sellAmount","type":"uint256"},{"indexed":false,"name":"buyAmount","type":"uint256"}],"name":"UpdateOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"offerId","type":"bytes32"}],"name":"CancelOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"vote","type":"uint8"},{"indexed":false,"name":"counterpartVote","type":"uint8"}],"name":"VoteDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dealId","type":"bytes32"}],"name":"AuditorNotification","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"reputation","type":"uint256"}],"name":"UpdateReputation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"seller","type":"address"},{"indexed":false,"name":"isSuccess","type":"bool"},{"indexed":false,"name":"tokenAddress","type":"address"},{"indexed":false,"name":"dealAmount","type":"uint256"}],"name":"HandleDealReputation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"isLocked","type":"bool"}],"name":"DealLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"commission","type":"uint256"}],"name":"NewCommission","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"offerId","type":"bytes32"},{"indexed":false,"name":"fixedBuyer","type":"address"}],"name":"FixedBuyer","type":"event"}];
const TOKEN_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_from","type":"address"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"disapprove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFromValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"charge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emisorAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"},{"name":"receiving","type":"address"},{"name":"price","type":"uint256"},{"name":"side","type":"uint256"},{"name":"exchangeAddress","type":"address"}],"name":"setDexOrder","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"approved","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"_owner","type":"address"},{"name":"initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"charger","type":"address"},{"indexed":true,"name":"charged","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Charge","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"old","type":"address"},{"indexed":true,"name":"current","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"}];
const TOKEN_PACKABLE_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_tokenId","type":"bytes32"}],"name":"balanceById","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"tokenOfOwner","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokens","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_destination","type":"address"},{"name":"_tokenId","type":"bytes32"}],"name":"getApproved","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_approved","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"bytes32"}],"name":"isExpired","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_json","type":"uint256[5]"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"string"}],"name":"setJsonReference","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"bytes32"}],"name":"getMetadata","outputs":[{"name":"","type":"uint256[5]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokens","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFromApproved","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"supplyByCategory","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"jsonReference","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_owner","type":"address"},{"name":"_jsonReference","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":true,"name":"_tokenId","type":"bytes32"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":true,"name":"_tokenId","type":"bytes32"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"json","type":"uint256[5]"}],"name":"NewJson","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"string"},{"indexed":false,"name":"current","type":"string"}],"name":"NewJsonReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"old","type":"address"},{"indexed":true,"name":"current","type":"address"}],"name":"NewOwner","type":"event"}];
const TOKEN_NFT_ABI = [{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getRefById","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"tokenOfOwner","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ref","type":"string"}],"name":"getTokenInfoRef","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256[10]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"isFake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenRef","type":"string"}],"name":"approveRef","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"setFake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokens","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ref","type":"string"}],"name":"getMetadataRef","outputs":[{"name":"","type":"uint256[10]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenRef","type":"string"}],"name":"burnRef","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ref","type":"string"}],"name":"getIdByRef","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getTokenInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256[10]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenRef","type":"string"},{"name":"_json","type":"uint256[]"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"string"}],"name":"setJsonReference","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getMetadata","outputs":[{"name":"","type":"uint256[10]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokens","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenRef","type":"string"}],"name":"transferFromRef","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"globalId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"isExpired","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"jsonReference","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ref","type":"string"}],"name":"ownerOfRef","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenRef","type":"string"},{"name":"_data","type":"bytes"}],"name":"safeTransferFromRef","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_owner","type":"address"},{"name":"_jsonReference","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenId","type":"uint256"},{"indexed":false,"name":"json","type":"uint256[]"}],"name":"NewJson","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"FakeToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"string"},{"indexed":false,"name":"current","type":"string"}],"name":"NewJsonReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"old","type":"address"},{"indexed":true,"name":"current","type":"address"}],"name":"NewOwner","type":"event"}];
const AUCTION_FACTORY_ABI = [{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onERC721Received","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onPNFTReceived","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_auditor","type":"address"},{"name":"_tokens","type":"address[]"},{"name":"_auctionAmountOrId","type":"uint256"},{"name":"_auctionTokenId","type":"bytes32"},{"name":"_settings","type":"uint256[]"}],"name":"deployAuction","outputs":[{"name":"","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"newAuction","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"tokens","type":"address[]"},{"indexed":false,"name":"auctionAmountOrId","type":"uint256"},{"indexed":false,"name":"auctionTokenId","type":"bytes32"},{"indexed":false,"name":"auditor","type":"address"},{"indexed":false,"name":"settings","type":"uint256[]"}],"name":"NewAuction","type":"event"}];
const AUCTION_ABI = [{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onERC721Received","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"cancelDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newCommission","type":"uint256"}],"name":"setCommission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"asset","outputs":[{"name":"token","type":"address"},{"name":"amountOrId","type":"uint256"},{"name":"tokenId","type":"bytes32"},{"name":"category","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auditor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newBid","type":"uint256"}],"name":"updateBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_wallet","type":"address"}],"name":"isSmartID","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newBid","type":"uint256"}],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"isOpen","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSelectors","outputs":[{"name":"","type":"bytes4[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bids","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onPNFTReceived","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"cancelBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"minValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isKillable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"noBidWithdrawl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxBidder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionCategory","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"piFallback","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"payDeal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"bidToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"commission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"selectors","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"FundAuction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Receive","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Pay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"bid","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"bid","type":"uint256"}],"name":"UpdateBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"bidder","type":"address"}],"name":"CancelBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"bid","type":"uint256"}],"name":"PayDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"badBidder","type":"address"}],"name":"CancelDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newEndTime","type":"uint256"}],"name":"NewEndTime","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCommission","type":"uint256"}],"name":"NewCommission","type":"event"},{"anonymous":false,"inputs":[],"name":"IsKillable","type":"event"},{"anonymous":false,"inputs":[],"name":"Killed","type":"event"}];
const REGISTRY_KYC_ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"kinds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"backend","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isFactory","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isNFToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newDiamondOwner","type":"address"}],"name":"setDiamondOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token1","type":"address"},{"name":"_token2","type":"address"},{"name":"_market","type":"address"}],"name":"setNewMarket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_category","type":"uint256"},{"name":"_is","type":"bool"}],"name":"setNewPNFToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopCuts","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_category","type":"uint256"},{"name":"_is","type":"bool"}],"name":"setNewNFToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes4"}],"name":"facets","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"diamondCut","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"markets","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_category","type":"uint256"},{"name":"_is","type":"bool"}],"name":"setNewToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCommission","type":"uint256"}],"name":"setTxCommission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isPNFToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"switcher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopUpgrades","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cuttable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setBackend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"commission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"diamondOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newSwitcher","type":"address"}],"name":"setSwitcher","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"addresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kind","type":"uint256"},{"name":"_address","type":"address"},{"name":"_isFactory","type":"bool"}],"name":"setNewAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_switcher","type":"address"},{"name":"_backend","type":"address"},{"name":"_facets","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewBackend","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"old","type":"address"},{"indexed":false,"name":"current","type":"address"}],"name":"NewSwitcher","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"kind","type":"uint256"},{"indexed":false,"name":"contractAddress","type":"address"},{"indexed":false,"name":"isFactory","type":"bool"}],"name":"NewAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newToken","type":"address"},{"indexed":false,"name":"category","type":"uint256"},{"indexed":false,"name":"isToken","type":"bool"}],"name":"NewToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newToken","type":"address"},{"indexed":false,"name":"category","type":"uint256"},{"indexed":false,"name":"isNFToken","type":"bool"}],"name":"NewNFToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newToken","type":"address"},{"indexed":false,"name":"category","type":"uint256"},{"indexed":false,"name":"isPNFToken","type":"bool"}],"name":"NewPNFToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenA","type":"address"},{"indexed":false,"name":"tokenB","type":"address"},{"indexed":false,"name":"market","type":"address"}],"name":"NewMarket","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCommission","type":"uint256"}],"name":"NewCommission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"selector","type":"bytes4"},{"indexed":true,"name":"oldFacet","type":"address"},{"indexed":true,"name":"newFacet","type":"address"}],"name":"DiamondCut","type":"event"}];
const DIVIDENDS_ABI = [{"constant":true,"inputs":[{"name":"_holder","type":"address"}],"name":"getPackableBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"holdersSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"payIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"payer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"holders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nTransfers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"supplier","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_withdrawler","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHolders","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"changeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_holder","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"packable","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"packableId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"checkSupply","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"payAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_holders","type":"address[]"},{"name":"_nTransfers","type":"uint256"}],"name":"updateBalanceArray","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isConfigured","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"globalIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isPaying","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payAmount","type":"uint256"}],"name":"configPay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"indexOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_supplier","type":"address"},{"name":"_payer","type":"address"},{"name":"_token","type":"address"},{"name":"_packable","type":"address"},{"name":"_packableId","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"withdrawler","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdrawl","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"token","type":"address"}],"name":"ChangeToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transfers","type":"uint256"},{"indexed":false,"name":"holdersSupply","type":"uint256"},{"indexed":false,"name":"nHolders","type":"uint256"}],"name":"HoldersUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payer","type":"address"},{"indexed":false,"name":"payAmount","type":"uint256"}],"name":"ConfigPay","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index","type":"uint256"}],"name":"PayUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"holder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Pay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"holder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"BadHolder","type":"event"},{"anonymous":false,"inputs":[],"name":"PayFinish","type":"event"}];
const MARKET_ABI = [{"constant":true,"inputs":[],"name":"stopInterval","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address[]"},{"name":"_newRate","type":"uint256[]"},{"name":"_newCommission","type":"uint256[]"}],"name":"setConfigArray","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastUpdateTimes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"charger","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"checkUpdateTime","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"commissions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_sellToken","type":"address"},{"name":"_sellAmount","type":"uint256"},{"name":"_buyToken","type":"address"}],"name":"exchange","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"rates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_newRate","type":"uint256"},{"name":"_newCommission","type":"uint256"}],"name":"setConfig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"baseToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newCharger","type":"address"}],"name":"setCharger","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_charger","type":"address"},{"name":"_baseToken","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":false,"name":"newRate","type":"uint256"},{"indexed":false,"name":"newCommission","type":"uint256"}],"name":"NewConfig","type":"event"}];
const DEX_ABI = [{"constant":true,"inputs":[],"name":"backend","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sending","type":"address"},{"name":"_receiving","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_prie","type":"uint256"},{"name":"_side","type":"uint256"}],"name":"setOrder","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"salt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"setInBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderId","type":"bytes32"}],"name":"cancelOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"nBlocks","type":"uint256"}],"name":"changeCancelBlocks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"nonce","type":"uint256"},{"name":"owner","type":"address"},{"name":"sending","type":"address"},{"name":"receiving","type":"address"},{"name":"amount","type":"uint256"},{"name":"price","type":"uint256"},{"name":"side","type":"uint256"},{"name":"open","type":"bool"},{"name":"close","type":"bool"},{"name":"cancelled","type":"bool"},{"name":"dealed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_orderId","type":"bytes32"}],"name":"getDeals","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newBackend","type":"address"}],"name":"setBackend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cancelBlocks","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderA","type":"bytes32"},{"name":"orderB","type":"bytes32"},{"name":"side","type":"uint256"}],"name":"dealOrder","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_backend","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"buying","type":"address"},{"indexed":true,"name":"selling","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"SetOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"buying","type":"address"},{"indexed":true,"name":"selling","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"CancelOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"orderA","type":"bytes32"},{"indexed":false,"name":"orderB","type":"bytes32"}],"name":"Deal","type":"event"}];
const DEX_PACKABLE_ABI = [{"constant":true,"inputs":[],"name":"backend","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"salt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"setInBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderId","type":"bytes32"}],"name":"cancelOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_from","type":"address"},{"name":"_tokenId","type":"bytes32"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onPNFTReceived","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"nBlocks","type":"uint256"}],"name":"changeCancelBlocks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sending","type":"address"},{"name":"_receiving","type":"address"},{"name":"_settings","type":"uint256[3]"},{"name":"_packableId","type":"bytes32"}],"name":"setOrder","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"nonce","type":"uint256"},{"name":"owner","type":"address"},{"name":"sending","type":"address"},{"name":"receiving","type":"address"},{"name":"packableId","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"price","type":"uint256"},{"name":"side","type":"uint256"},{"name":"open","type":"bool"},{"name":"close","type":"bool"},{"name":"cancelled","type":"bool"},{"name":"dealed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newBackend","type":"address"}],"name":"setBackend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cancelBlocks","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderA","type":"bytes32"},{"name":"orderB","type":"bytes32"},{"name":"side","type":"uint256"}],"name":"dealOrder","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_controllerAddress","type":"address"},{"name":"_backend","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"buying","type":"address"},{"indexed":true,"name":"selling","type":"address"},{"indexed":false,"name":"settings","type":"uint256[3]"},{"indexed":false,"name":"packableId","type":"bytes32"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"SetOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"buying","type":"address"},{"indexed":true,"name":"selling","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"CancelOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"orderA","type":"bytes32"},{"indexed":false,"name":"orderB","type":"bytes32"},{"indexed":false,"name":"amountA","type":"uint256"},{"indexed":false,"name":"amountB","type":"uint256"},{"indexed":false,"name":"side","type":"uint256"}],"name":"Deal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"UpdateOrder","type":"event"}];

// PATHS
const PATH_0 = "m/44'/60'/0'/0/0";
const PATH_1 = "m/44'/60'/0'/0/1";

// ADDRESSES
const CONTROLLER_ADDRESS = "0x9a46F7034102d716132f4FCA1f4f36132F4E992F";
const CONTROLLER_ADDRESS_TESTNET = "0xd864aD84602FE08492Bd058cD6aBc47e82CcFF0A";

// TOKENS
// MainNet
const PI = {
    symbol: "PI",
    address: "0x0000000000000000000000000000000000000000",
    category: 1
};
const GLDS = {
    symbol: "GLDs",
    address: "0x0dc5c612b313d583398aebcbc3185c6448542f2a",
    category: 2
};
const GLDX = {
    symbol: "GLDx",
    address: "0x8e4b37a1b65ce5e78616259584662341fb667345",
    category: 1
};
const PTR = {
    symbol: "PTR",
    address: "0x458e54534d6efbf2b1b0569f6ff994957bb93c7f",
    category: 1
};
const BTC = {
    symbol: "BTC",
    address: "0x4c3c844b751c18299932dcd18a3032bd3481d61a",
    category: 1
};
const USC = {
    symbol: "USC",
    address: "0x4f38f0c9a26a480feae22c78576cd3a24dbce834",
    category: 1
};
const ETH = {
    symbol: "ETH",
    address: "0x4ffb535bbbbd3d74d2f593bd9c21daa946a68c56",
    category: 1
};
const DASHx = {
    symbol: "DASHx",
    address: "0x900370b357ba48d9aed84f4a8cecbf6969f0a2d8",
    category: 1
};
const LTCx = {
    symbol: "LTCx",
    address: "0x7bf2baa78bb7033425fe7cd312e4e30ce0fe76dc",
    category: 1
};
const XMRx = {
    symbol: "XMRx",
    address: "0x14f2cac3fb386ea014041c4d8ad4b8848c33f5b3",
    category: 1
};
const BRENT = {
    symbol: "BRENT",
    address: "0x4729f5a25ce946ff1f468f7c0c703b07a65b48d2",
    category: 1
};
const DOGE = {
    symbol: "DOGE",
    address: "0xe10f7b6bca6c269a52c30ee29fe55074a0dd1146",
    category: 1
};
const DOT = {
    symbol: "DOT",
    address: "0x2b11506779855a5d6106bd8a0dd12108d6d862a1",
    category: 1
};
const GAS = {
    symbol: "GAS",
    address: "0x6a8e70de39d5600c9d2cf4e162856e0c4798780d",
    category: 1
};
const IBEX35 = {
    symbol: "IBEX35",
    address: "0x03bdbce729bfe37a6d2d9edf08ceacf6519db276",
    category: 1
};
const RUB = {
    symbol: "RUB",
    address: "0x23100542d162898e3de51fdbc37cc384a59f9143",
    category: 1
};
const SP500 = {
    symbol: "SP500",
    address: "0x1ffb0cee0a33bb534af879a4922e1c8ffac441fc",
    category: 1
};
const GBP = {
    symbol: "GBP",
    address: "0x3225b88c4850a891f88bee8491f6c1cae11d761d",
    category: 1
};
const EUR = {
    symbol: "EUR",
    address: "0x6645223d7947b4534f09dee35796e1c23326fc5b",
    category: 1
};
const PEN = {
    symbol: "PEN",
    address: "0x6e0c484e9efccf8d29ef229cc5b47b8b79ed8f97",
    category: 1
};
const ARS = {
    symbol: "ARS",
    address: "0x6e5040f4ba7a6ec228a5247fe690d5df73539b83",
    category: 1
};
const USD = {
    symbol: "USD",
    address: "0x77f4ab4a154cf41c0b812f0873a3491dd39f478a",
    category: 1
};
const VES = {
    symbol: "VES",
    address: "0x88a83a48bf4039023118ac760e6beaf5e6f110fb",
    category: 1
};
const COP = {
    symbol: "COP",
    address: "0xbe7a8d8c2a26a847bbde18a401066f196bf5657d",
    category: 1
};
const CLP = {
    symbol: "CLP",
    address: "0xd9a7f80cd3552e30b62168164bd04c3b8e5dfcc0",
    category: 1
};
const PEL = {
    symbol: "PEL",
    address: "0xe1f2d5b6d86030660fc2e80965585af3163a1454",
    category: 1
};
const USDT = {
    symbol: "USDT",
    address: "0xf4a47b570d8d1c37552229e9acf3678eb9090c99",
    category: 1
};
const IMV = {
    symbol: "IMV",
    address: "0x7b47E489c2eC1841c09b346CA1ADd03853A5dA85",
    category: 1
};
const DIA = {
    symbol: "DIA",
    address: "0xfb75b3cd83d81937770e5955f3e6565bfecc195f",
    category: 2
};
//packables
const CMT = {
    symbol: "CMT",
    address: "0xc28ce4d4a4428415f810097244646ef23d0f7f22",
    expiry: {
        dic20: ["dic20", "0xf4d673b892f6fcab7102cd5a5d491b10eb92fe62141917263e9d6177533d9f46"]
    },
    category: 3
};
const VOTE = {
    symbol: "VOTE",
    address: "0xd2b28cc2de7284a24421aa12f598291ec30c7840",
    expiry: {
        id: "",
    },
    category: 3
};
const MVZA = {
    symbol: "MVZA",
    address: "0x19fba3dba401388dc658670437df5c5971036a66",
    expiry: {
        sep20: ["sep20", "0xa2606ae0f41221792d66c0660b868a3d379b2730cdbebe5ad692bc4f03f42432"],
    },
    category: 3
};
const RST = {
    symbol: "RST",
    address: "0x7af5c748770c5d6fb8f1f949e6892aadcdc4fd52",
    expiry: {
        nov20: ["nov20", "0xc94f49fef30fea649378e3a0992a5ed53d90e5d8ee7144f52bbbeb66db688aaa"],
        ene21: ["ene21", "0x041b2ac9bd7b54b942a14323bb7cf435fb3600d191f3b9ba1415cd488f5c8aa0"],
        nov21: ["nov21", "0xb0402b82a618701408716faaec65ae5058dde918812cece7eeaa076523969797"]
    },
    category: 3
};
const BNC = {
    symbol: "BNC",
    address: "0xa58e2aa440308ec13886e7dcfb5bd48e8bad8575",
    expiry: {
        nov20: ["nov20", "0xd2e3a36c908e5e4515b4f9508417c7a4fc3344e72f3bf8f56104c158e6fa07b2"],
        nov21: ["nov21", "0xf692cefd47f74d8f3bc14f683162136f062b61b7601d36444a428169c062a26e"]
    },
    category: 3
};
const PGR =  {
    symbol: "PGR",
    address: "0x1e4420f5d619d09bb4a2ff4e6e4e1b227c62e1ee",
    expiry: {
        nov20: ["nov20", "0x3a9785c6bced431109d4eafa2ae1d90b720fb5c1c2f8be888517b85f5aa9dac9"],
        nov21: ["nov21", "0x2d5dea468459751f1cde905674453fe1cce1e58999fc88291bc996aaed37e400"]
    },
    category: 3
};
const ENV = {
    symbol: "ENV",
    address: "0x1ff246a656899834a6db02aa5e1858eeaa4bbf9a",
    expiry: {
        nov20: ["nov20", "0x6d7fc2c6729563a98f23c2316e16d46fce49089176e56f5136d841687ebb809e"],
        nov21: ["nov21", "0x9310b28b324b4410ad9ef28f35678cdaab1e1f09b257728cb24bae890316f57a"]
    },
    category: 3
};
const TDVD = {
    symbol: "TDVD",
    address: "0x9e7b83875339c13cbda56a0594fb0fe4077de221",
    expiry: {
        nov20: ["nov20", "0xf4294076dd563df9932d1aaca2684d57d48f990f2cf7358f3e9eea57d6a5c7a2"],
        nov21: ["nov21", "0x958797977c2537d48569e68dc731d813d0dd69c937b5b3694fb9dfe671b40d7e"]
    },
    category: 3
};
const BPV = {
    symbol: "BPV",
    address: "0xa3ea0b1a827f441be7b115872ab6b0c281c6faa5",
    expiry: {
        nov20: ["nov20", "0x430d73868b7cbc3cab3a4b3a7d9f2493c1dbb748acc472925a231fea8636577a"],
        nov21: ["nov21", "0x28156803d030b54832c2ca21fa5bcfc9f40d4b454518ff5ad7e672546d34e666"]
    },
    category: 3
};
const FVIA = {
    symbol: "FVIA",
    address: "0xdde2c591b56166b39e64b92d1eace690bb182af5",
    expiry: {
        nov20: ["nov20", "0x5090b8841a42b1c50b439f667c3238f83724a1d49df5abf74578d40c5d989685"],
        nov21: ["nov21", "0xcdb3d44451ec1e28dfea5b2deda2c1d4b7466598faa9096b3fb94da48b50d42b"]
    },
    category: 3
};
const CRMA = {
    symbol: "CRMA",
    address: "0xdf6051372ecf1aff4fe6fa2daa9c0e2a1402b7e7",
    expiry: {
        nov20: ["nov20", "0x5d9fc42c1569608d953bb140ae5a0c77c9217dc08428afcf1593d82bbff174ab"],
        nov21: ["nov21", "0x891ecbe18731b97f347b59c34b4c22834519832a1a424be38927e40dbaf5449a"]
    },
    category: 3
};
const NOVA = {
    symbol: "NOVA",
    address: "0xb22ebd9cb54dc2edb313f313f106244312a57055",
    expiry: {
        mar21: ["mar21", "0x517db52c70c84d1b828d562544c64beb72a50fce076ab14c63c37f3de9577246"]
    },
    category: 3
};
const BRENT_LONG = {
    symbol: "BRENT_LONG",
    address: "0x88df5c53dd758c8f4dab878d64338a53d4e3bd27",
    expiry: {
        feb21: ["feb21", "0x38a220dc3e1750f1b7610339e867b34d40e0b9588c63e67276f4c3740deb14cf"]
    },
    category: 3
};
const BRENT_SHORT = {
    symbol: "BRENT_SHORT",
    address: "0x3369457a8cfbc17248dabce82b1adb4f8b55a8f8",
    expiry: {
        feb21: ["feb21", "0xeef97a3b7a4384ef1db6e113fb241333f96fee0b6bed17a9cf0e165c4a7acc53"]
    },
    category: 3
};
const SP500_LONG = {
    symbol: "SP500_LONG",
    address: "0x0bd7e582415fe7a407e1dda3a261f4139a8df64e",
    expiry: {
        feb21: ["feb21", "0x56ae733d9a12c91cb854c999b587ef2180c983b0525db4d791983dd9692582f0"]
    },
    category: 3
};
const SP500_SHORT = {
    symbol: "SP500_SHORT",
    address: "0x5b3fdc337f2958ba9261f2729bc1c7c6d4e47d11",
    expiry: {
        feb21: ["feb21", "0x749882a743471331b3a3b20a2cfa402700bec79f1559d9644d26c106a1e907bd"]
    },
    category: 3
};
const AGRO = {
    symbol: "AGRO",
    address: "0x21678b6bd9b321abc54540cc8cd06af9f67ecf81",
    expiry: {
        never: ["never", "0x5f1570c8ac91d7e7d0f049284e50886dd435c98c35a0e5563a7248041b1cfe1a"]
    },
    category: 3
};

// TestNet
const PI_TESTNET = {
    symbol: "PI_TESTNET",
    address: "0x0000000000000000000000000000000000000000",
    category: 1
};
const VES_TESTNET = {
    symbol: "VES_TESTNET",
    address: "0x3fdfa8d0629ef77a9654798c0a479b33ade48b80",
    category: 1
};
const BTC_TESTNET = {
    symbol: "BTC_TESTNET",
    address: "0x515234b2122a1fb51fcbe360d2379e35135b980a",
    category: 1
};
const ETH_TESTNET = {
    symbol: "ETH_TESTNET",
    address: "0x55d4a11196c8b1d0c03664e9c29296250a11635b",
    category: 1
};
const EUR_TESTNET = {
    symbol: "EUR_TESTNET",
    address: "0xbb7636c26e22d0adb7762546a243ec38fef3eb7f",
    category: 1
};
const USD_TESTNET = {
    symbol: "USD_TESTNET",
    address: "0xd4bcb641224aea90dd39f65c2344925315348564",
    category: 1
};
const USDT_TESTNET = {
    symbol: "USDT_TESTNET",
    address: "0xcf45b718dcf1d44dc6bd61c3fcc687327fa5225b",
    category: 1
};
const PEL_TESTNET = {
    symbol: "PEL_TESTNET",
    address: "0x2d76e7802ed20c46f6703ea9564358b0ed1d698c",
    category: 1
};
const GLD_TESTNET = {
    symbol: "GLD_TESTNET",
    address: "0xa722eeb4972ad557e2094834ba29d68a62ffc264",
    category: 2
};
const DIA_TESTNET = {
    symbol: "DIA_TESTNET",
    address: "0xca8eebf7b0268113328dba98061599f28d383c80",
    category: 2
};
const CMT_TESTNET = {
    symbol: "CMT_TESTNET",
    address: "0x993817a0bfffb2c86eba1b641446aac9c0bfa1ee",
    expiry: {
        nov20: "",
        nov21: "0x2290139cf07fc7d4a1b773f5eba277831c21149bfdbd74a1a49c7d765bfc07bf"
    },
    category: 3
};
const AGRO_TESTNET = {
    symbol: "AGRO_TESTNET",
    address: "0x2b0d9f4a4299860f011275f018fdb1d2f3cf7053",
    expiry: {
        never: ["never", "0x5f1570c8ac91d7e7d0f049284e50886dd435c98c35a0e5563a7248041b1cfe1a"]
    },
    category: 3
};
const PGR_TESTNET = {
    symbol: "PGR_TESTNET",
    address: "0x556198aff8d563598a93c9b9f148ba7d88afb348",
    expiry: {
        nov21: ["nov21", "0x2d5dea468459751f1cde905674453fe1cce1e58999fc88291bc996aaed37e400"],
        feb22: ["feb22", "0x14f29dfcd17779771a63b3c4ef4c92856cdffedb93487ad34ba49b94fb5c1ee7"]
    },
    category: 3
};
const RST_TESTNET = {
    symbol: "RST_TESTNET",
    address: "0xdd38a97be5a55b4eb4b0cda64c9661cbe1c3fcfb",
    expiry: {
        nov21: ["nov21", "0xb0402b82a618701408716faaec65ae5058dde918812cece7eeaa076523969797"],
        feb22: ["feb22", "0x4d9b5b6bce1118eac334eff851f5820ae54afa7d5c91c2063da4d64c89707439"]
    },
    category: 3
};

const ALL_TOKENS = [
    PI,
    BTC,
    USC,
    ETH,
    EUR,
    PEN,
    ARS,
    USD,
    VES,
    PEL,
    GLDX,
    CLP,
    USDT,
    DASHx,
    LTCx,
    XMRx,
    BRENT,
    DOGE,
    DOT,
    GAS,
    GBP,
    IBEX35,
    RUB,
    SP500,
    RST,
    BNC,
    PGR,
    ENV,
    TDVD,
    BPV,
    FVIA,
    CRMA,
    NOVA,
    BRENT_LONG,
    BRENT_SHORT,
    SP500_LONG,
    SP500_SHORT,
    AGRO
]

const ALL_ERC223 = [
    PI,
    BTC,
    USC,
    ETH,
    EUR,
    PEN,
    ARS,
    USD,
    VES,
    PEL,
    GLDX,
    CLP,
    USDT,
    DASHx,
    LTCx,
    XMRx,
    BRENT,
    DOGE,
    DOT,
    GAS,
    GBP,
    IBEX35,
    RUB,
    SP500
]

const ALL_ERC223_NO_FIAT = [
    PI,
    BTC,
    USC,
    ETH,
    GLDX,
    PEL,
    USDT,
    DASHx,
    LTCx,
    XMRx,
    BRENT,
    DOGE,
    DOT,
    GAS,
    GBP,
    IBEX35,
    RUB,
    SP500
]

const ALL_PACKABLES = [
    RST,
    BNC,
    PGR,
    ENV,
    TDVD,
    BPV,
    FVIA,
    CRMA,
    NOVA,
    BRENT_LONG,
    BRENT_SHORT,
    SP500_LONG,
    SP500_SHORT,
    AGRO
]

const ALL_PACKABLE_EXP = [
    RST.expiry.nov21,
    BNC.expiry.nov21,
    PGR.expiry.nov21,
    ENV.expiry.nov21,
    TDVD.expiry.nov21,
    BPV.expiry.nov21,
    FVIA.expiry.nov21,
    CRMA.expiry.nov21,
    NOVA.expiry.mar21,
    BRENT_LONG.expiry.feb21,
    BRENT_SHORT.expiry.feb21,
    SP500_LONG.expiry.feb21,
    SP500_SHORT.expiry.feb21,
    AGRO.expiry.never
]

const ALL_COLLECTABLES = [
    DIA,
    GLDS
]

// OTHER
const MIN_GAS_PRICE = "1000000000";
const OVERRIDES = {gasPrice: 1000000000};
const OVERRIDES_FORCE = {gasPrice: 1000000000, gasLimit: 500000};
const OVERRIDES_BACKEND = {gasPrice: 0};

export { 
    RPC_URL, 
    RPC_URL_TESTNET, 
    TRACES_URL, 
    GRAPH_URL,
    GRAPH_URL_TESTNET,
    BANK_SUBGRAPH,
    BANK_SUBGRAPH_TESTNET,
    MARKETS_SUBGRAPH,
    MARKETS_SUBGRAPH_TESTNET,
    P2P_SUBGRAPH,
    P2P_SUBGRAPH_TESTNET,
    P2P_PRIMARY_SUBGRAPH,
    P2P_PRIMARY_SUBGRAPH_TESTNET,
    AUCTION_SUBGRAPH,
    AUCTION_SUBGRAPH_TESTNET,
    PIPRICE_SUBGRAPH,
    PIPRICE_SUBGRAPH_TESTNET,
    DIVIDENDS_SUBGRAPH,
    DIVIDENDS_SUBGRAPH_TESTNET,
    DEX_SUBGRAPH,
    DEX_SUBGRAPH_TESTNET,
    REGISTRY_SUBGRAPH,
    REGISTRY_SUBGRAPH_TESTNET,
    CONTROLLER_ABI,
    REGISTRY_ABI,
    IDENTITY_FACTORY_ABI,
    IDENTITY_ABI,
    WALLET_ABI,
    NAME_SERVICE_ABI,
    P2P_ABI,
    P2P_NFT_ABI,
    P2P_PNFT_ABI,
    TOKEN_ABI,
    TOKEN_PACKABLE_ABI,
    TOKEN_NFT_ABI,
    AUCTION_FACTORY_ABI,
    AUCTION_ABI,
    REGISTRY_KYC_ABI,
    DIVIDENDS_ABI,
    MARKET_ABI,
    DEX_ABI,
    DEX_PACKABLE_ABI,
    PATH_0,
    PATH_1,
    CONTROLLER_ADDRESS,
    CONTROLLER_ADDRESS_TESTNET,
    MIN_GAS_PRICE,
    OVERRIDES,
    OVERRIDES_FORCE,
    OVERRIDES_BACKEND,
    PI,
    GLDS,
    GLDX,
    MVZA,
    PTR,
    BTC,
    USC,
    ETH,
    DASHx,
    LTCx,
    XMRx,
    BRENT,
    DOGE,
    DOT,
    GAS,
    GBP,
    IBEX35,
    RUB,
    SP500,
    EUR,
    PEN,
    ARS,
    USD,
    IMV,
    VES,
    COP,
    CMT,
    VOTE,
    CLP,
    PEL,
    USDT,
    DIA,
    PGR,
    ENV,
    RST,
    TDVD,
    BPV,
    BNC,
    FVIA,
    CRMA,
    NOVA,
    BRENT_LONG,
    BRENT_SHORT,
    SP500_LONG,
    SP500_SHORT,
    AGRO,
    PI_TESTNET,
    VES_TESTNET,
    BTC_TESTNET,
    ETH_TESTNET,
    EUR_TESTNET,
    USD_TESTNET,
    USDT_TESTNET,
    PEL_TESTNET,
    GLD_TESTNET,
    CMT_TESTNET,
    RST_TESTNET,
    PGR_TESTNET,
    AGRO_TESTNET,
    DIA_TESTNET,
    ALL_TOKENS,
    ALL_ERC223,
    ALL_ERC223_NO_FIAT,
    ALL_PACKABLES,
    ALL_PACKABLE_EXP,
    ALL_COLLECTABLES
};