import Xdc3 from 'xdc3';
import { Contract } from 'xdc3-eth-contract';
import { AbiItem } from 'xdc3-utils';
export interface XdcContractMetaData {
    address: string;
    abi: AbiItem[];
}
export declare class Web3Utils {
    static contracts: Map<string, Contract>;
    static getContractInstance(contractMetaData: XdcContractMetaData, provider: Xdc3): Contract;
    static getContractInstanceFrom(abi: AbiItem[], address: string, provider: Xdc3): Contract;
    static clearContracts(): void;
}
//# sourceMappingURL=Web3Utils.d.ts.map