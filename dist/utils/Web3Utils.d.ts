import Xdc3 from "xdc3";
import { AbiItem as XdcAbiItem } from "xdc3-utils";
interface XdcContractMetaData {
    address: string;
    abi: XdcAbiItem[];
}
export declare class Web3Utils {
    static getContractInstance(contractMetaData: XdcContractMetaData, library: Xdc3): any;
    static getContractInstanceFrom(abi: XdcAbiItem[], address: string, library: Xdc3): any;
}
export {};
//# sourceMappingURL=Web3Utils.d.ts.map