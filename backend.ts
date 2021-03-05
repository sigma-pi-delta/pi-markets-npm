import { ethers } from "ethers";
import { Contracts } from "./contracts";
import * as Constants from './constants';
import { Wallets } from "./wallets";

export class Backend {
    readonly signer: ethers.Wallet;
    readonly network: string;
    readonly walletsService: any;
    readonly contractsService: any;
    readonly controllerAddress: string;

    constructor(_signer: ethers.Wallet, _network: string = 'mainnet') {
        this.signer = _signer;
        this.network = _network;
        this.contractsService = new Contracts(this.network);
        this.walletsService = new Wallets(this.network);

        if (this.network == 'mainnet') {
            this.controllerAddress = Constants.CONTROLLER_ADDRESS;
        } else if (this.network == 'testnet') {
            this.controllerAddress = Constants.CONTROLLER_ADDRESS_TESTNET;
        }
    }

    async dealOrderTokenDex(
        orderA: string,
        orderB: string,
        side: number,
        nonce: number,
        index: string = "30"
    ) {
        try {
            return await this.dealOrder(
                orderA,
                orderB,
                side,
                nonce,
                index
            )
        } catch (error) {
            throw new Error(error);
        }
    }

    async dealOrderPackableDex(
        orderA: string,
        orderB: string,
        side: number,
        nonce: number,
        index: string = "31"
    ) {
        try {
            return await this.dealOrder(
                orderA,
                orderB,
                side,
                nonce,
                index
            )
        } catch (error) {
            throw new Error(error);
        }
    }

    async dealOrder(
        orderA: string,
        orderB: string,
        side: number,
        nonce: number,
        contractIndex: string
    ) {
        const controllerContract = this.contractsService.getContractCaller(
            this.controllerAddress,
            Constants.CONTROLLER_ABI
        );
        const dexAddress = await controllerContract.addresses(contractIndex);
        
        const dex = this.contractsService.getContractSigner(
            dexAddress,
            Constants.DEX_ABI,
            this.signer
        );

        let response: any;

        try {
            response = await dex.dealOrder(
                orderA,
                orderB,
                side,
                {gasPrice: 0, gasLimit: 3000000, nonce: nonce}
            )

            return response;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}