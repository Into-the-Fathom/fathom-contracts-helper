import Xdc3 from 'xdc3';
import EventEmitter from 'eventemitter3';
import IStableSwapService from '../interfaces/services/IStableSwapService';
export default class StableSwapService implements IStableSwapService {
    provider: Xdc3;
    chainId: number;
    emitter: EventEmitter;
    constructor(provider: Xdc3, chainId: number);
    swapTokenToStableCoin(account: string, tokenIn: string, tokenInDecimals: number, tokenName: string): Promise<number | Error>;
    swapStableCoinToToken(account: string, tokenOut: string, tokenName: string): Promise<number | Error>;
    addLiquidity(amount: number, account: string): Promise<number | Error>;
    removeLiquidity(amount: number, account: string): Promise<number | Error>;
    approveStableCoin(account: string, isStableSwapWrapper?: boolean): Promise<number | Error>;
    approveUsdt(account: string, isStableSwapWrapper?: boolean): Promise<number | Error>;
    claimFeesRewards(account: string): Promise<number | Error>;
    withdrawClaimedFees(account: string): Promise<number | Error>;
    approvalStatusStableCoin(account: string, tokenIn: string, tokenInDecimal: number, isStableSwapWrapper?: boolean): Promise<boolean>;
    approvalStatusUsdt(account: string, tokenIn: string, tokenInDecimal: number, isStableSwapWrapper?: boolean): Promise<boolean>;
    getFeeIn(): any;
    getFeeOut(): any;
    getLastUpdate(): any;
    getDailySwapLimit(): any;
    getPoolBalance(tokenAddress: string): any;
    isDecentralizedState(): any;
    isUserWhitelisted(address: string): any;
    usersWrapperWhitelist(address: string): any;
    getAmounts(amount: string, account: string): any;
    getTotalValueLocked(): any;
    getDepositTracker(account: string): any;
    getActualLiquidityAvailablePerUser(account: string): any;
    getClaimableFeesPerUser(account: string): any;
    getClaimedFXDFeeRewards(account: string): any;
    getClaimedTokenFeeRewards(account: string): any;
    setProvider(provider: Xdc3): void;
    setChainId(chainId: number): void;
}
//# sourceMappingURL=StableSwapService.d.ts.map