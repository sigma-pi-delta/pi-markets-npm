import { ethers } from 'ethers';

export class Utils {

    etherStringToWeiBN(ether: string): ethers.utils.BigNumber {
        return ethers.utils.parseEther(ether);
    }
    
    etherStringToWeiString(ether: string): string {
        return ethers.utils.parseEther(ether).toString();
    }
    
    weiStringToEtherBN(wei: string): ethers.utils.BigNumber {
        return ethers.utils.bigNumberify(ethers.utils.formatEther(wei));
    }
    
    weiToEtherBN(weiBN: ethers.utils.BigNumber): ethers.utils.BigNumber {
        return ethers.utils.bigNumberify(ethers.utils.formatEther(weiBN));
    }
    
    weiToEther(wei: string): string {
        return ethers.utils.formatEther(wei);
    }
    
    weiBNToEtherString(bn: ethers.utils.BigNumber): string {
        return ethers.utils.formatEther(bn.toString());
    }
    
    BNToString(bn: ethers.utils.BigNumber): string {
        return bn.toString();
    }
    
    stringToBN(str: string): ethers.utils.BigNumber {
        return ethers.utils.bigNumberify(str);
    }
    
    commify(ether: string): string {
        return ethers.utils.commify(ether);
    }
    
    commifyBN(bn: ethers.utils.BigNumber): string {
        return ethers.utils.commify(bn.toString());
    }
}