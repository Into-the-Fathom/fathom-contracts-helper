import Xdc3 from 'xdc3';
import ICollateralPool from '../models/ICollateralPool';
export default interface IPositionService {
    openPosition(address: string, pool: ICollateralPool, collateral: string, fathomToken: string): Promise<number | Error>;
    topUpPositionAndBorrow(address: string, pool: ICollateralPool, collateral: string, fathomToken: string, positionId: string): Promise<number | Error>;
    topUpPosition(address: string, pool: ICollateralPool, collateral: string, positionId: string): Promise<number | Error>;
    createProxyWallet(address: string): Promise<string>;
    proxyWalletExist(address: string): Promise<string>;
    closePosition(positionId: string, pool: ICollateralPool, address: string, collateral: string): Promise<number | Error>;
    approve(address: string, tokenAddress: string): Promise<number | Error>;
    approvalStatus(address: string, tokenAddress: string, collateral: string): Promise<boolean>;
    balanceStableCoin(address: string): Promise<string>;
    approveStableCoin(address: string): Promise<number | Error>;
    approvalStatusStableCoin(maxPositionDebtValue: number, address: string): Promise<boolean>;
    partiallyClosePosition(positionId: string, pool: ICollateralPool, address: string, debt: string, collateralValue: string): Promise<number | Error>;
    getDebtValue(debtShare: number, poolId: string): Promise<string>;
    getPositionDebtCeiling(poolId: string): Promise<string>;
    isWhitelisted(address: string): Promise<boolean>;
    isDecentralizedMode(): Promise<boolean>;
    setChainId(chainId: number): void;
    setProvider(provider: Xdc3): void;
}
//# sourceMappingURL=IPositionService.d.ts.map