import { ethers } from "ethers";
import { Contracts } from "./contracts";
import * as Constants from './constants';
import { Wallets } from "./wallets";

export class Backend {
    readonly signer: ethers.Wallet;
    readonly network: string;
    readonly walletsService: any;
    readonly contractsService: any;

    constructor(_signer: ethers.Wallet, _network: string = 'mainnet') {
        this.signer = _signer;
        this.network = _network;
        this.contractsService = new Contracts(this.network);
        this.walletsService = new Wallets(this.network);
    }

    async dealOrder(
        orderA: string,
        orderB: string,
        side: number,
        nonce: number
    ) {
        const controllerContract = this.contractsService.getContractCaller(
            Constants.CONTROLLER_ADDRESS,
            Constants.CONTROLLER_ABI
        );
        const dexAddress = await controllerContract.addresses("30");
        
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