import Xdc3 from 'xdc3';
import EventEmitter from 'eventemitter3';
import ICollateralPool from '../interfaces/models/ICollateralPool';
import IPositionService from '../interfaces/services/IPositionService';
export default class PositionService implements IPositionService {
    provider: Xdc3;
    chainId: number;
    emitter: EventEmitter;
    constructor(provider: Xdc3, chainId: number);
    openPosition(address: string, pool: ICollateralPool, collateral: string, fathomToken: string): Promise<number | Error>;
    topUpPositionAndBorrow(address: string, pool: ICollateralPool, collateral: string, fathomToken: string, positionId: string): Promise<number | Error>;
    topUpPosition(address: string, pool: ICollateralPool, collateral: string, positionId: string): Promise<number | Error>;
    createProxyWallet(address: string): Promise<any>;
    closePosition(positionId: string, pool: ICollateralPool, address: string, collateral: string): Promise<number | Error>;
    partiallyClosePosition(positionId: string, pool: ICollateralPool, address: string, stableCoin: string, collateral: string): Promise<number | Error>;
    approve(address: string, tokenAddress: string): Promise<number | Error>;
    approvalStatus(address: string, tokenAddress: string, collateral: string): Promise<boolean>;
    approveStableCoin(address: string): Promise<number | Error>;
    proxyWalletExist(address: string): any;
    balanceStableCoin(address: string): any;
    approvalStatusStableCoin(maxPositionDebtValue: number, address: string): Promise<boolean>;
    getDebtValue(debtShare: number, poolId: string): Promise<string>;
    getPositionDebtCeiling(poolId: string): Promise<string>;
    isDecentralizedMode(): any;
    isWhitelisted(address: string): any;
    setProvider(provider: Xdc3): void;
    setChainId(chainId: number): void;
}
//# sourceMappingURL=PositionService.d.ts.map