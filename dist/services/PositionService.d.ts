import Xdc3 from "xdc3";
import IPositionService from "interfaces/IPositionService";
import ICollateralPool from "interfaces/ICollateralPool";
import { ChainId } from "types";
export default class PositionService implements IPositionService {
    chainId: ChainId;
    provider: Xdc3;
    constructor(provider: Xdc3, chainId: ChainId);
    openPosition(address: string, pool: ICollateralPool, collateral: string, fathomToken: string): Promise<number | Error>;
    topUpPositionAndBorrow(address: string, pool: ICollateralPool, collateral: string, fathomToken: string, positionId: string): Promise<number | Error>;
    topUpPosition(address: string, pool: ICollateralPool, collateral: string, positionId: string): Promise<number | Error>;
    createProxyWallet(address: string): Promise<string>;
    proxyWalletExist(address: string): any;
    closePosition(positionId: string, pool: ICollateralPool, address: string, collateral: string): Promise<number | Error>;
    partiallyClosePosition(positionId: string, pool: ICollateralPool, address: string, stableCoin: string, collateral: string): Promise<number | Error>;
    approve(address: string, tokenAddress: string): Promise<number | Error>;
    approvalStatus(address: string, tokenAddress: string, collateral: string): Promise<boolean>;
    approveStableCoin(address: string): Promise<number | Error>;
    balanceStableCoin(address: string): Promise<string>;
    approvalStatusStableCoin(valueToCheck: string | number, address: string): Promise<boolean>;
    getDebtValue(debtShare: number, poolId: string): Promise<string>;
    getPositionDebtCeiling(poolId: string): Promise<string>;
    isDecentralizedMode(): any;
    isWhitelisted(address: string): any;
    setChainId(chainId: number): void;
    setProvider(provider: Xdc3): void;
}
//# sourceMappingURL=PositionService.d.ts.map