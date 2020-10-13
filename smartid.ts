import { ethers } from 'ethers';
import * as Constants from './constants';
import {Contracts} from './contracts';
import {Wallets, WalletPair} from './wallets';
import {Transactions} from './transactions';
import { Graph, Query } from './graph';

export class SmartID {

}

export class SmartIDLogin {
    readonly network: string;
    readonly walletsService: any;
    readonly graph: any;

    constructor(_url: string = 'mainnet') {
        this.network = _url;
        this.walletsService = new Wallets(this.network);
        this.graph = new Graph();
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
    
        return new SmartIDObject(nickname, identity, wallet);
    }

    /***** QUERY */

    async walletToNickname(address) {
        let customQuery = '{ wallet(id: "' + address + '"){ name { id } } }';
        let query = new Query('bank');
        query.setCustomQuery(customQuery);

        try {
            let response = await this.graph.querySubgraph(query);
            return response.wallet.name.id;
        } catch(error) {
            console.error(error);
            return '';
        }
    }

    async nicknameToWallet(nickname) {
        let customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
        let query = new Query('bank');
        query.setCustomQuery(customQuery);

        try {
            let response = await this.graph.querySubgraph(query);
            return response.wallets[0].id;
        } catch(error) {
            console.error(error);
            return '';
        }
    }

    async isNameAvailable(nickname) {
        let customQuery = '{ wallets(where: { name: "' + nickname + '" }){ id } }';
        let query = new Query('bank');
        query.setCustomQuery(customQuery);

        try {
            let response = await this.graph.querySubgraph(query);
            return response.wallets.length == 0;
        } catch(error) {
            console.error(error);
        }
    }

    async isDataHashAvailable(dataHash) {
        let customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id } }';
        let query = new Query('bank');
        query.setCustomQuery(customQuery);

        try {
            let response = await this.graph.querySubgraph(query);
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
        let query = new Query('bank');
        query.setCustomQuery(customQuery);

        try {
            let response = await this.graph.querySubgraph(query);
            return response.identities[0].id;
        } catch(error) {
            console.error(error);
            return '';
        }
    }

    async getIdentityByDataHash(dataHash) {
        let customQuery = '{ identities(where: { dataHash: "' + dataHash + '" }){ id dataHash owner recovery wallet { id name { id } } creationTime lastModification } }';
        let query = new Query('bank');
        query.setCustomQuery(customQuery);

        try {
            let response = await this.graph.querySubgraph(query);
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
}

export class SmartIDObject {
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