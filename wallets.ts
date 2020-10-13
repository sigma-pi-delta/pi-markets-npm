import { ethers } from 'ethers';
import {Blockchain} from './blockchain';

export class Wallets {
    readonly blockchain: Blockchain;
    readonly provider: ethers.providers.BaseProvider;

    constructor(_url = 'mainnet') {
        this.blockchain = new Blockchain(_url)
        this.provider = this.blockchain.getProvider();
    }

    connectWallet(_wallet: ethers.Wallet): ethers.Wallet {
        return _wallet.connect(this.provider);
    }

    createWalletFromEntropy(_entropy: string): ethers.Wallet {
        return ethers.Wallet.createRandom(_entropy);
    }

    createWalletFromMnemonic(_mnemonic: string, _path: string): ethers.Wallet {
        if (ethers.utils.HDNode.isValidMnemonic(_mnemonic)) {
            return ethers.Wallet.fromMnemonic(_mnemonic, _path);
        } else {
            return null;
        }
    }

    createWalletFromPrivKey(_privKey: string): ethers.Wallet {
        return new ethers.Wallet(_privKey);
    }

    async createWalletFromEncryptedJson(_encryptedJson: string, _password: string) {
        return await ethers.Wallet.fromEncryptedJson(_encryptedJson, _password);
    }

    async encryptWallet(_password: string, _wallet: ethers.Wallet ) {
        return await _wallet.encrypt(_password);
    }

    isValidMnemonic(_mnemonic:string): boolean {
        return ethers.utils.HDNode.isValidMnemonic(_mnemonic);
    }

    isAddress(_address: string): boolean {
        try {
            ethers.utils.getAddress(_address);
        } catch(e) { return false; }
        
        return true;
    }
}

export class WalletPair {

    readonly owner: string;
    readonly recovery: string;
    readonly mnemonic: string;
    readonly encryptedWallet: string;

    constructor(owner: string, recovery: string, mnemonic: string, encryptedWallet: string) {
        this.owner = owner;
        this.recovery = recovery;
        this.mnemonic = mnemonic;
        this.encryptedWallet = encryptedWallet;
    }
}