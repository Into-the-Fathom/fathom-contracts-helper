import Xdc3 from 'xdc3';
import IPoolService from '../interfaces/services/IPoolService';
export default class PoolService implements IPoolService {
    provider: Xdc3;
    chainId: number;
    constructor(provider: Xdc3, chainId: number);
    getUserTokenBalance(address: string, forAddress: string): any;
    getTokenDecimals(forAddress: string): any;
    getDexPrice(forAddress: string): Promise<any>;
    getCollateralTokenAddress(forAddress: string): any;
    setProvider(provider: Xdc3): void;
    setChainId(chainId: number): void;
}
//# sourceMappingURL=PoolService.d.ts.map