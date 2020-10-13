import { ethers } from 'ethers';
import * as Constants from './constants';

export class Blockchain {

    readonly url: string;
    readonly name: string;

    constructor(_url = 'mainnet') {
        if (_url == 'mainnet') {
            this.url = Constants.RPC_URL;
            this.name = _url;
        } else if (_url == 'testnet') {
            this.url = Constants.RPC_URL_TESTNET;
            this.name = _url;
        } else {
            this.url = _url;
            this.name = 'custom';
        }
    }

    getProvider(): ethers.providers.BaseProvider {
        return new ethers.providers.JsonRpcProvider(this.url);
    }

    async getNetwork() {
        return await this.getProvider().getNetwork();
    }

    async getCode(_address) {
        return await this.getProvider().getCode(_address);
    }

    async getStorageAt(_address, _position) {
        return await this.getProvider().getStorageAt(_address, _position);
    }

    async getBlockNumber() {
        return await this.getProvider().getBlockNumber();
    }

    async getBlock(_blockHashOrBlockNumber) {
        return await this.getProvider().getBlock(_blockHashOrBlockNumber);
    }

    async getTransaction(_txHash) {
        return await this.getProvider().getTransaction(_txHash);
    }

    async getTransactionReceipt(_txHash) {
        return await this.getProvider().getTransactionReceipt(_txHash);
    }

    async getBalance(_address) {
        return await this.getProvider().getBalance(_address);
    }

    async getNonce(_address) {
        return await this.getProvider().getTransactionCount(_address);
    }
}