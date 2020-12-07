import { ethers } from 'ethers';
import * as Constants from './constants';
import { Contracts } from './contracts';
import { Wallets, WalletPair } from './wallets';
import { Transactions } from './transactions';
import { Query } from './graph';
import { Blockchain } from './blockchain';

export class SmartID {
    readonly signer: ethers.Wallet;
    readonly identity: string;
    readonly wallet: string;
    readonly network: string;
    readonly contractsService: any;
    readonly transactionsService: any;

    constructor(
        signer: ethers.Wallet,
        identity: string,
        wallet: string,
        network: string = 'mainnet'
    ) {
        this.signer = signer;
        this.identity = identity;
        this.wallet = wallet;
        this.network = network;
        this.contractsService = new Contracts(this.network);
        this.transactionsService = new Transactions();

        if (this.signer.provider == undefined) {
            let bc = new Blockchain(this.network);
            this.signer = this.signer.connect(bc.getProvider());
        }
    }

    async forward(destination: string, data: string) {
        let identityContract = this.contractsService.getContractSigner(
            this.identity, 
            Constants.IDENTITY_ABI, 
            this.signer
        );

        let response: any;

        try {
            response = await identityContract.forward(destination, data, Constants.OVERRIDES);
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }

        try {
            let receipt = await this.transactionsService.getReceipt(response);
            return receipt;
        } catch (receiptError) {
            console.error(receiptError);
            throw new Error(receiptError);
        }
    }

    /******** TRANSFER */

    async transfer(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transfer.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferSending(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferSending.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferDomain(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferDomain.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferDomainSending(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferDomainSending.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.amount, 
            tx.data, 
            tx.kind
        ]);
        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferNFT(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferNFT.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferNFTDomain(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferNFTDomain.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferNFTRef(tx: TransferNFTRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferNFTRef.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.reference, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferNFTRefDomain(tx: TransferNFTRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferNFTRefDomain.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.reference, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferPNFT(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferPNFT.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.packableId,
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async transferPNFTDomain(tx: TransferRequest) {
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let data = walletContract.interface.functions.transferPNFTDomain.encode([
            tx.tokenAddress, 
            tx.destination, 
            tx.packableId,
            tx.amount, 
            tx.data, 
            tx.kind
        ]);

        try {
            return await this.forward(this.wallet, data);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    /******** P2P */

    // Common for all P2Ps [9-17]
    async cancelOffer(
        offerId: string,
        p2pIndex: "9" | "10" | "11" | "12" | "13" | "14" | "15" | "17"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer);
        let p2pData = p2pContract.interface.functions.cancelOffer.encode([
            offerId
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let walletData = walletContract.interface.functions.forward.encode([
            p2pAddress,
            p2pData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // Common for all P2Ps [9-17]
    async updateBuyAmount(
        offerId: string,
        buyAmount: ethers.utils.BigNumber,
        p2pIndex: "9" | "10" | "11" | "12" | "13" | "14" | "15" | "17"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.updateBuyAmount.encode([
            offerId,
            buyAmount
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forward.encode([
            p2pAddress,
            p2pData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // Common for all P2Ps [9-17]
    async voteDeal(
        dealId: string,
        vote: "1" | "2", // 1 - Confirm | 2 - Cancel
        p2pIndex: "9" | "10" | "11" | "12" | "13" | "14" | "15" | "17"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.voteDeal.encode([
            dealId,
            vote
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forward.encode([
            p2pAddress,
            p2pData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // Deals where buyer part is Fiat. Common for [9-14] P2Ps 
    async deal(
        offerId: string,
        buyAmount: ethers.utils.BigNumber,
        p2pIndex: "9" | "10" | "11" | "12" | "13" | "14"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.deal.encode([
            offerId,
            buyAmount
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forward.encode([
            p2pAddress,
            p2pData
        ]);
    
        try {
            let receipt = await this.forward(this.wallet, walletData);

            let event: any;
            if (receipt.logs != undefined) {
                for (let i = 0; i < receipt.logs.length; i++) {
                    if (receipt.logs[i].address.toLowerCase() == p2pAddress.toLowerCase()) {
                        if (receipt.logs[i].topics[0] == "0x75c48d2c41d94e0ba2f763f7aa64a7cae7a2802b6e471cb4ccff923c99e03977") {
                            let topics = receipt.logs[i].topics;
                            let data = receipt.logs[i].data;
                            let _log = {topics, data};
                            event = await this.contractsService.decodeEvent(p2pContract, _log)
                        }
                    }
                }
            }
        
            return [event.dealId, receipt.transactionHash];
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // Deals where buyer part is ERC223. Common for [9-15] P2Ps 
    async dealToken(
        offerId: string,
        buyAmount: ethers.utils.BigNumber,
        buyToken: string,
        p2pIndex: "9" | "10" | "11" | "12" | "13" | "14" | "15"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.deal.encode([
            offerId,
            buyAmount
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forwardValue.encode([
            buyToken,
            buyAmount,
            p2pAddress,
            p2pData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // ERC223 vs ERC223/Fiat. Primary and Secondary [9, 11] 
    async offer(
        offerParams: P2POffer,
        p2pIndex: "9" | "11"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer);
        let p2pData = p2pContract.interface.functions.offer.encode([
            offerParams.tokens, 
            offerParams.amounts, 
            offerParams.settings, 
            offerParams.limits,
            offerParams.auditor,
            offerParams.description,
            offerParams.metadata
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer);
        let walletData = walletContract.interface.functions.forwardValue.encode([
            offerParams.tokens[0],
            offerParams.amounts[0],
            p2pAddress,
            p2pData
        ]);

        try {
            let receipt = await this.forward(this.wallet, walletData);

            let event: any;
            if (receipt.logs != undefined) {
                for (let i = 0; i < receipt.logs.length; i++) {
                    if (receipt.logs[i].address.toLowerCase() == p2pAddress.toLowerCase()) {
                        let topics = receipt.logs[i].topics;
                        let data = receipt.logs[i].data;
                        let _log = {topics, data};
                        event = await this.contractsService.decodeEvent(p2pContract, _log)
                    }
                }
            }
        
            return [event.offerId, receipt.transactionHash];
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // NFT vs ERC223/Fiat. Primary and Secondary [10, 12]
    async offerCommodity(
        offerParams: P2POfferCommodity,
        p2pIndex: "10" | "12"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_NFT_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.offer.encode([
            offerParams.sellToken, 
            offerParams.sellId, 
            offerParams.buyToken,
            offerParams.buyAmount,
            offerParams.isBuyFiat,
            offerParams.minReputation,
            offerParams.auditor,
            offerParams.description,
            offerParams.metadata
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forwardValue.encode([
            offerParams.sellToken,
            offerParams.sellId,
            p2pAddress,
            p2pData
        ]);
    
        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // PNFT vs ERC223/Fiat. Primary and Secondary [13, 14]
    async offerPackable(
        offerParams: P2POfferPackable,
        p2pIndex: "13" | "14"
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress(p2pIndex);
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_PNFT_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.offer.encode([
            offerParams.tokens, 
            offerParams.tokenId, 
            offerParams.amounts,
            offerParams.settings,
            offerParams.limits,
            offerParams.auditor,
            offerParams.description,
            offerParams.metadata,
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forwardValuePNFT.encode([
            offerParams.tokens[0],
            offerParams.tokenId,
            offerParams.amounts[0],
            p2pAddress,
            p2pData
        ]);
    
        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async offerTokenRequestPackable(
        offerParams: P2POfferPackable
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress("17");
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_PNFT_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.offer.encode([
            offerParams.tokens, 
            offerParams.tokenId, 
            offerParams.amounts,
            offerParams.settings,
            offerParams.limits,
            offerParams.auditor,
            offerParams.description,
            offerParams.metadata,
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forwardValue.encode([
            offerParams.tokens[0],
            offerParams.amounts[0],
            p2pAddress,
            p2pData
        ]);
    
        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }
    
    async offerFiatRequestPackable(
        offerParams: P2POfferPackable
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress("17");
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_PNFT_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.offer.encode([
            offerParams.tokens, 
            offerParams.tokenId, 
            offerParams.amounts,
            offerParams.settings,
            offerParams.limits,
            offerParams.auditor,
            offerParams.description,
            offerParams.metadata,
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forward.encode([
            p2pAddress,
            p2pData
        ]);
    
        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async dealPackable(
        offerId: string,
        buyAmount: ethers.utils.BigNumber,
        buyToken: string,
        tokenId: string
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress("17");
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_PNFT_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.deal.encode([
            offerId,
            buyAmount
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forwardValuePNFT.encode([
            buyToken,
            tokenId,
            buyAmount,
            p2pAddress,
            p2pData
        ]);
    
        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async offerFiat(
        offerParams: P2POffer
    ) {
        let p2pAddress = await this.contractsService.getControllerAddress("15");
        let p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            this.signer
        );
        let p2pData = p2pContract.interface.functions.offer.encode([
            offerParams.tokens, 
            offerParams.amounts, 
            offerParams.settings, 
            offerParams.limits,
            offerParams.auditor,
            offerParams.description,
            offerParams.metadata
        ]);
    
        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );
        let walletData = walletContract.interface.functions.forward.encode([
            p2pAddress,
            p2pData
        ]);
    
        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    /******** AUCTIONS */

    // WHEN AUCTION TOKEN IS ERC223 OR COLLECTABLE
    async deployAuction (
        auction: AuctionParams
    ) {
        let auctionFactoryAddress = await this.contractsService.getControllerAddress("20");
        let auctionFactory = this.contractsService.getContractSigner(
            auctionFactoryAddress, 
            Constants.AUCTION_FACTORY_ABI, 
            this.signer
        );
        let deployAuctionData = auctionFactory.interface.functions.deployAuction.encode([
            auction.auditor,
            auction.tokens,
            auction.auctionAmountOrId,
            auction.auctionTokenId,
            auction.settings
        ]);

        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );

        let walletData = walletContract.interface.functions.forwardValue.encode([
            auction.tokens[0],
            auction.auctionAmountOrId,
            auctionFactoryAddress,
            deployAuctionData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    // WHEN AUCTION TOKEN IS PACKABLE
    async deployAuctionPackable (
        auction: AuctionParams
    ) {
        let auctionFactoryAddress = await this.contractsService.getControllerAddress("20");
        let auctionFactory = this.contractsService.getContractSigner(
            auctionFactoryAddress, 
            Constants.AUCTION_FACTORY_ABI, 
            this.signer
        );
        let deployAuctionData = auctionFactory.interface.functions.deployAuction.encode([
            auction.auditor,
            auction.tokens,
            auction.auctionAmountOrId,
            auction.auctionTokenId,
            auction.settings
        ]);

        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );

        let walletData = walletContract.interface.functions.forwardValuePNFT.encode([
            auction.tokens[0],
            auction.auctionTokenId,
            auction.auctionAmountOrId,
            auctionFactoryAddress,
            deployAuctionData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async bid(
        auctionAddress: string,
        bidToken: string,
        bid: ethers.utils.BigNumber,
        minValue: ethers.utils.BigNumber
    ) {
        let auctionContract = this.contractsService.getContractSigner(
            auctionAddress, 
            Constants.AUCTION_ABI, 
            this.signer
        );
        let bidData = auctionContract.interface.functions.bid.encode([
            bid
        ]);

        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );

        let walletData = walletContract.interface.functions.forwardValue.encode([
            bidToken,
            minValue,
            auctionAddress,
            bidData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async updateBid(
        auctionAddress: string,
        bid: ethers.utils.BigNumber
    ) {
        let auctionContract = this.contractsService.getContractSigner(
            auctionAddress, 
            Constants.AUCTION_ABI, 
            this.signer
        );
        let bidData = auctionContract.interface.functions.updateBid.encode([
            bid
        ]);

        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );

        let walletData = walletContract.interface.functions.forward.encode([
            auctionAddress,
            bidData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async cancelBid(
        auctionAddress: string
    ) {
        let auctionContract = this.contractsService.getContractSigner(
            auctionAddress, 
            Constants.AUCTION_ABI, 
            this.signer
        );
        let bidData = auctionContract.interface.functions.cancelBid.encode([]);

        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );

        let walletData = walletContract.interface.functions.forward.encode([
            auctionAddress,
            bidData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async payDeal(
        auctionAddress: string,
        bidToken: string,
        amountLeft: ethers.utils.BigNumber
    ) {
        let auctionContract = this.contractsService.getContractSigner(
            auctionAddress, 
            Constants.AUCTION_ABI, 
            this.signer
        );
        let bidData = auctionContract.interface.functions.payDeal.encode([]);

        let walletContract = this.contractsService.getContractSigner(
            this.wallet, 
            Constants.WALLET_ABI, 
            this.signer
        );

        let walletData = walletContract.interface.functions.forwardValue.encode([
            bidToken,
            amountLeft,
            auctionAddress,
            bidData
        ]);

        try {
            return await this.forward(this.wallet, walletData);
        } catch(error) {
            console.error(error);
            throw new Error(error);
        }
    }
}

export class SmartIDLogin {
    readonly network: string;
    readonly walletsService: any;

    constructor(_url: string = 'mainnet') {
        this.network = _url;
        this.walletsService = new Wallets(this.network);
    }

    async login(password: string, encryptedWallet: string) {
        return await this.walletsService.createWalletFromEncryptedJson(encryptedWallet, password);
    }

    async firstLogin(nickname: string, encryptedWallet: string, password: string) {
        let signer = await this.login(password, encryptedWallet);
        let digitalIdentity = await this.getDigitalIdentity(nickname);
        digitalIdentity.setSigner(signer);

        return digitalIdentity;
    }

    async getDigitalIdentity(nickname: string) {
        let wallet = await this.nicknameToWallet(nickname);
        let identity = await this.getIdentityByWallet(wallet);
    
        return new SmartIDPublic(nickname, identity, wallet);
    }

    /***** QUERY */

    async walletToNickname(address) {
        let customQuery = '{ wallet(id: "' + address + '"){ name { id } } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            return response.wallet.name.id;
        } catch(error) {
            console.error(error);
            return '';
        }
    }

    async nicknameToWallet(nickname) {
        let customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            return response.wallets[0].id;
        } catch(error) {
            console.error(error);
            return '';
        }
    }

    async isNameAvailable(nickname) {
        let customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            return response.wallets.length == 0;
        } catch(error) {
            console.error(error);
        }
    }

    async isDataHashAvailable(dataHash) {
        let customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            return response.identities.length == 0;
        } catch(error) {
            console.error(error);
        }
    }

    async getIdentityByName(nickname) {
        try {
            let address = await this.nicknameToWallet(nickname);
            let response = await this.getIdentityByWallet(address);
            return response;
        } catch(error) {
            console.error(error);
        }
    }

    async getIdentityByWallet(address) {
        let customQuery = '{ identities(where: { wallet: "' + address + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            return response.identities[0].id;
        } catch(error) {
            console.error(error);
            return '';
        }
    }

    async getIdentityByDataHash(dataHash) {
        let customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
        let query = new Query('bank', this.network);
        query.setCustomQuery(customQuery);

        try {
            let response = await query.request();
            return response.identities[0].id;
        } catch(error) {
            console.error(error);
        }
    }
}

export class SmartIDRegistry {

    readonly network: string;
    readonly walletsService: any;
    readonly contractsService: any;
    readonly transactionsService: any;

    constructor(_url: string = 'mainnet') {
        this.network = _url;
        this.walletsService = new Wallets(this.network);
        this.contractsService = new Contracts(this.network);
        this.transactionsService = new Transactions();
    }

    async createWalletPair(entropy: string, password: string) {
        const wallet = this.walletsService.createWalletFromEntropy(entropy);
        const owner = this.walletsService.createWalletFromMnemonic(wallet.mnemonic, Constants.PATH_0);
        const onlyOwner = this.walletsService.createWalletFromPrivKey(owner.privateKey);
        const scryptOptions = { scrypt: { N: 64 } };
        const encryptedOwner = await onlyOwner.encrypt(password, scryptOptions);
        const recovery = this.walletsService.createWalletFromMnemonic(wallet.mnemonic, Constants.PATH_1);

        return new WalletPair(owner.address, recovery.address, wallet.mnemonic, encryptedOwner);
    }

    async deployIdentity(
        owner: string, 
        recovery: string, 
        dataHash: string, 
        nickname: string, 
        signerPrivateKey: string
    ) {
        const controllerContract = this.contractsService.getContractCaller(
            Constants.CONTROLLER_ADDRESS,
            Constants.CONTROLLER_ABI
        );
        const identityFactoryAddress = await controllerContract.addresses("2");
        const signer = this.walletsService.createWalletFromPrivKey(signerPrivateKey);
        const identityFactory = this.contractsService.getContractSigner(
            identityFactoryAddress,
            Constants.IDENTITY_FACTORY_ABI,
            signer
        );

        let response: any;

        try {
            response = await identityFactory.deployIdentity(
                owner,
                recovery,
                dataHash,
                nickname,
                Constants.OVERRIDES_BACKEND
            )
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }

        try {
            let receipt = await this.transactionsService.getReceipt(response);
            let event: any;
            for (let i = 0; i < receipt.logs.length; i++) {
                if (receipt.logs[i].address.toLowerCase() == identityFactoryAddress.toLowerCase()) {
                    let topics = receipt.logs[i].topics;
                    let data = receipt.logs[i].data;
                    let _log = {topics, data};
                    event = await this.contractsService.decodeEvent(identityFactory, _log);
                }
            }

            if (event != undefined) {
                return event.wallet;
            } else {
                return receipt;
            }

        } catch (receiptError) {
            console.error(receiptError);
            throw new Error(receiptError);
        }
    }

    async setNewIdentityDD(identity: string, dataHashDD: string, signerPrivateKey: string) {
        const controllerContract = this.contractsService.getContractCaller(
            Constants.CONTROLLER_ADDRESS,
            Constants.CONTROLLER_ABI
        );
        const registryAddress = await controllerContract.addresses("1");
        const signer = this.walletsService.createWalletFromPrivKey(signerPrivateKey);
        const identityFactory = this.contractsService.getContractSigner(
            registryAddress,
            Constants.REGISTRY_ABI,
            signer
        );

        let response: any;

        try {
            response = await identityFactory.setNewIdentityDD(
                identity,
                dataHashDD,
                Constants.OVERRIDES_BACKEND
            )
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }

        try {
            let receipt = await this.transactionsService.getReceipt(response);
            return receipt;
        } catch (receiptError) {
            console.error(receiptError);
            throw new Error(receiptError);
        }
    }

    async updateReputation(
        user: string,
        reputation: string,
        signerPrivateKey: string
    ) {
        const p2pAddress = await this.contractsService.getControllerAddress("16");
        const signer = this.walletsService.createWalletFromPrivKey(signerPrivateKey);
        const p2pContract = this.contractsService.getContractSigner(
            p2pAddress, 
            Constants.P2P_ABI, 
            signer
        );

        let response: any;

        try {
            response = await p2pContract.updateReputation(
                user, 
                reputation, 
                Constants.OVERRIDES_BACKEND
            );
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }

        try {
            let receipt = await this.transactionsService.getReceipt(response);
            return receipt;
        } catch (receiptError) {
            console.error(receiptError);
            throw new Error(receiptError);
        }
    }
}

export class SmartIDPublic {
    readonly nickname: string;
    readonly identity: string;
    readonly wallet: string;
    public signer: ethers.Wallet;

    constructor(
        nickname: string,
        identity: string,
        wallet: string,
        signer?: ethers.Wallet
    ) {
        this.nickname = nickname;
        this.identity = identity;
        this.wallet = wallet;
        this.signer = signer;
    }

    setSigner(signer: ethers.Wallet) {
        this.signer = signer;
    }
}

export class TransferRequest {

    tokenAddress: string;
    destination: string;
    amount: ethers.utils.BigNumber;
    data: string;
    kind: ethers.utils.BigNumber;
    packableId?: string;

    constructor(
        tokenAddress: string,
        destination: string, //address or nickname
        amount: ethers.utils.BigNumber,
        data: string,
        kind: ethers.utils.BigNumber,
        packableId?: string
    ) {
        this.tokenAddress = tokenAddress;
        this.destination = destination;
        this.amount = amount;
        this.data = data;
        this.kind = kind;
        
        if (packableId != undefined) {
            this.packableId = packableId;
        }
    }
}

export class TransferNFTRequest {

    tokenAddress: string;
    destination: string;
    reference: string;
    data: string;
    kind: ethers.utils.BigNumber;

    constructor(
        tokenAddress: string,
        destination: string, //address or nickname
        reference: string,
        data: string,
        kind: ethers.utils.BigNumber
    ) {
        this.tokenAddress = tokenAddress;
        this.destination = destination;
        this.reference = reference;
        this.data = data;
        this.kind = kind;
    }
}

export class P2POffer {

    tokens: string[] = [];
    amounts: ethers.utils.BigNumber[] = [];
    settings: boolean[] = [];
    limits: ethers.utils.BigNumber[] = [];
    auditor: string;
    description: string;
    metadata: number[] = [];

    constructor(
        sellToken: string,
        sellAmount: ethers.utils.BigNumber,
        isPartial: boolean,
        buyToken: string,
        buyAmount: ethers.utils.BigNumber,
        isFiat: boolean, // isBuyFiat or isSellFiat depending on the target SC
        minDealAmount: ethers.utils.BigNumber,
        maxDealAmount: ethers.utils.BigNumber,
        minReputation: ethers.utils.BigNumber,
        auditor: string,
        description: string,
        country: number[],
        payMethods: number[]
    ) {
        this.tokens.push(sellToken);
        this.tokens.push(buyToken);
        this.amounts.push(sellAmount);
        this.amounts.push(buyAmount);
        this.settings.push(isPartial);
        this.settings.push(isFiat);
        this.limits.push(minDealAmount);
        this.limits.push(maxDealAmount);
        this.limits.push(minReputation);
        this.auditor = auditor;
        this.description = description;

        let zero = [0];
        let metadata = country.concat(zero).concat(payMethods).concat(zero);
        this.metadata = metadata;
    }
}

export class P2POfferCommodity {

    sellToken: string;
    sellId: ethers.utils.BigNumber;
    buyToken: string;
    buyAmount: ethers.utils.BigNumber;
    isBuyFiat: boolean;
    minReputation: ethers.utils.BigNumber;
    auditor: string;
    description: string;
    metadata: number[] = [];

    constructor(
        sellToken: string,
        sellId: ethers.utils.BigNumber,
        buyToken: string,
        buyAmount: ethers.utils.BigNumber,
        isBuyFiat: boolean,
        minReputation: ethers.utils.BigNumber,
        auditor: string,
        description: string,
        country: number[],
        payMethods: number[]
    ) {
        this.sellToken = sellToken;
        this.sellId = sellId;
        this.buyToken = buyToken;
        this.buyAmount = buyAmount;
        this.isBuyFiat = isBuyFiat;
        this.minReputation = minReputation;
        this.auditor = auditor;
        this.description = description;

        let zero = [0];
        let metadata = country.concat(zero).concat(payMethods).concat(zero);
        this.metadata = metadata;
    }
}

export class P2POfferPackable {

    tokens: string[] = [];
    amounts: ethers.utils.BigNumber[] = [];
    tokenId: string;
    settings: boolean[] = [];
    limits: ethers.utils.BigNumber[] = [];
    auditor: string;
    description: string;
    metadata: number[] = [];

    constructor(
        sellToken: string,
        sellAmount: ethers.utils.BigNumber,
        tokenId: string,
        isPartial: boolean,
        buyToken: string,
        buyAmount: ethers.utils.BigNumber,
        isFiat: boolean, // isBuyFiat or isSellFiat depending on the target SC
        minDealAmount: ethers.utils.BigNumber,
        maxDealAmount: ethers.utils.BigNumber,
        minReputation: ethers.utils.BigNumber,
        auditor: string,
        description: string,
        country: number[],
        payMethods: number[]
    ) {
        this.tokens.push(sellToken);
        this.tokens.push(buyToken);
        this.amounts.push(sellAmount);
        this.amounts.push(buyAmount);
        this.tokenId = tokenId;
        this.settings.push(isPartial);
        this.settings.push(isFiat);
        this.limits.push(minDealAmount);
        this.limits.push(maxDealAmount);
        this.limits.push(minReputation);
        this.auditor = auditor;
        this.description = description;

        let zero = [0];
        let metadata = country.concat(zero).concat(payMethods).concat(zero);
        this.metadata = metadata;
    }
}

export class AuctionParams {

    readonly auditor: string;
    readonly tokens: string[];
    readonly auctionAmountOrId: ethers.utils.BigNumber;
    readonly settings: ethers.utils.BigNumber[];
    readonly auctionTokenId: string;

    constructor(
        auditor: string,
        auctionToken: string,
        bidToken: string,
        auctionAmountOrId: ethers.utils.BigNumber,
        minValue: ethers.utils.BigNumber,
        endTime: ethers.utils.BigNumber,
        auctionTokenId?: string
    ) {
        this.auditor = auditor;
        this.tokens = [];
        this.tokens.push(auctionToken);
        this.tokens.push(bidToken);
        this.auctionAmountOrId = auctionAmountOrId;
        this.settings = [];
        this.settings.push(minValue);
        this.settings.push(endTime);

        if (auctionTokenId == undefined) {
            this.auctionTokenId = ethers.constants.HashZero;
        } else {
            this.auctionTokenId = auctionTokenId;
        }
    }
}