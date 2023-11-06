import Xdc3 from "xdc3";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: string,
    tokenInDecimals: number,
    tokenName: string
  ): Promise<number | Error>;

  swapStableCoinToToken(
    address: string,
    stableCoinIn: string,
    stableCoinInDecimals: number,
    tokenName: string
  ): Promise<number | Error>;

  addLiquidity(
    amount: number,
    account: string
  ): Promise<number | Error>;

  removeLiquidity(
    amount: number,
    account: string
  ): Promise<number | Error>;

  approveStableCoin(
    address: string,
    isStableSwapWrapper?: boolean
  ): Promise<number | Error>;

  approveUsdt(
    address: string,
    isStableSwapWrapper?: boolean
  ): Promise<number | Error>;

  claimFeesRewards(
    account: string
  ): Promise<number | Error>;

  withdrawClaimedFees(
    account: string
  ): Promise<number | Error>;

  approvalStatusStableCoin(
    address: string,
    tokenIn: string,
    inputDecimal: number,
    isStableSwapWrapper?: boolean
  ): Promise<boolean>;

  approvalStatusUsdt(
    address: string,
    tokenIn: string,
    inputDecimal: number,
    isStableSwapWrapper?: boolean
  ): Promise<boolean>;

  getFeeIn(): Promise<string>;

  getFeeOut(): Promise<string>;

  getLastUpdate(): Promise<string>;

  getDailySwapLimit(): Promise<number>;

  getPoolBalance(tokenAddress: string): Promise<number>;

  getAmounts(amount: string, account: string): Promise<number[]>;

  getTotalValueLocked(): Promise<number>;

  getActualLiquidityAvailablePerUser(account: string): Promise<number>;

  getDepositTracker(account: string): Promise<number>;

  getClaimableFeesPerUser(account: string): Promise<{ 0: number, 1: number }>;

  getClaimedFXDFeeRewards(account: string): Promise<number>;

  getClaimedTokenFeeRewards(account: string): Promise<number>;

  isDecentralizedState(): Promise<boolean>;

  isUserWhitelisted(address: string): Promise<boolean>;

  usersWrapperWhitelist(address: string): Promise<boolean>;

  setChainId(chainId: number): void;

  setProvider(provider: Xdc3): void;
}
