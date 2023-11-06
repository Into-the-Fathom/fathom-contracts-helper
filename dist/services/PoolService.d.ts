import IPoolService from "interfaces/IPoolService";
import Xdc3 from "xdc3";
import { ChainId } from "../types";
export default class PoolService implements IPoolService {
    chainId: ChainId;
    provider: Xdc3;
    constructor(provider: Xdc3, chainId: ChainId);
    getUserTokenBalance(address: string, forAddress: string): any;
    getTokenDecimals(forAddress: string, library: Xdc3): any;
    getDexPrice(forAddress: string): Promise<any>;
    getCollateralTokenAddress(forAddress: string): any;
    setChainId(chainId: number): void;
    setProvider(provider: Xdc3): void;
}
//# sourceMappingURL=PoolService.d.ts.map