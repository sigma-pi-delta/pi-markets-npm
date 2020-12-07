import { ethers } from 'ethers';
import {Blockchain} from './blockchain';
import * as Constants from './constants';

export class Contracts {

    readonly blockchain: Blockchain;
    readonly provider: ethers.providers.Provider;
    readonly controller: string;

    constructor(_url: string = 'mainnet') {
        this.blockchain = new Blockchain(_url)
        this.provider = this.blockchain.getProvider();

        if (_url == 'mainnet') {
            this.controller = Constants.CONTROLLER_ADDRESS;
        } else if (_url == 'testnet') {
            this.controller = Constants.CONTROLLER_ADDRESS_TESTNET;
        }
    }

    getContractCaller(_address: string, _abi: any | ethers.utils.Interface): ethers.Contract {
        return new ethers.Contract(_address, _abi, this.provider);
    }

    getContractSigner(
        _address: string, 
        _abi: any | ethers.utils.Interface, 
        _wallet: ethers.Wallet
    ) 
        : ethers.Contract
    {
        _wallet = _wallet.connect(this.provider);
        return this.getContractCaller(_address, _abi).connect(_wallet);
    }

    async getPastEvents(
        _contract: ethers.Contract, 
        _filter: ethers.EventFilter, 
        _fromBlock: number, 
        _toBlock: number | string
    ) {
        let logsFilter = {
            address: _contract.address,
            fromBlock: _fromBlock,
            toBlock: _toBlock,
            topics: _filter.topics
        }
        return await this.provider.getLogs(logsFilter);
    }

    async decodeEvent(_contract: ethers.Contract, _log: {topics: string [], data: string}) {
        return await _contract.interface.parseLog(_log).values;
    }

    async getControllerAddress(index: string) {
        let controllerContract = this.getContractCaller(
            this.controller, 
            Constants.CONTROLLER_ABI
        );
        return await controllerContract.addresses(index);
    }
}