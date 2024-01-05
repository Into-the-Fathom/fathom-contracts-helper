import EventEmitter from 'eventemitter3';
import { DefaultProvider } from '../../types';
import { BigNumber } from 'fathom-ethers';

export default interface IStableSwapService {
  emitter: EventEmitter;
  provider: DefaultProvider;
  chainId: number;

  swapTokenToStableCoin(
    address: string,
    tokenIn: string,
    tokenInDecimals: string,
    tokenName: string,
  ): Promise<number | Error>;

  swapStableCoinToToken(
    address: string,
    stableCoinIn: string,
    tokenName: string,
  ): Promise<number | Error>;

  addLiquidity(amount: string, account: string): Promise<number | Error>;

  removeLiquidity(amount: string, account: string): Promise<number | Error>;

  approveStableCoin(
    address: string,
    isStableSwapWrapper?: boolean,
  ): Promise<number | Error>;

  approveUsdt(
    address: string,
    isStableSwapWrapper?: boolean,
  ): Promise<number | Error>;

  claimFeesRewards(account: string): Promise<number | Error>;

  withdrawClaimedFees(account: string): Promise<number | Error>;

  approvalStatusStableCoin(
    address: string,
    tokenIn: string,
    inputDecimal: string,
    isStableSwapWrapper?: boolean,
  ): Promise<boolean>;

  approvalStatusUsdt(
    address: string,
    tokenIn: string,
    inputDecimal: string,
    isStableSwapWrapper?: boolean,
  ): Promise<boolean>;

  getFeeIn(): Promise<BigNumber>;

  getFeeOut(): Promise<BigNumber>;

  getLastUpdate(): Promise<BigNumber>;

  getDailySwapLimit(): Promise<BigNumber>;

  getTotalValueDeposited(): Promise<BigNumber>;

  getSingleSwapLimitNumerator(): Promise<BigNumber>;

  getSingleSwapLimitDenominator(): Promise<BigNumber>;

  getPoolBalance(tokenAddress: string): Promise<BigNumber>;

  getAmounts(amount: string, account: string): Promise<BigNumber[]>;

  getTotalValueLocked(): Promise<BigNumber>;

  getActualLiquidityAvailablePerUser(account: string): Promise<BigNumber>;

  getDepositTracker(account: string): Promise<BigNumber>;

  getClaimableFeesPerUser(
    account: string,
  ): Promise<{ 0: BigNumber; 1: BigNumber }>;

  getClaimedFXDFeeRewards(account: string): Promise<BigNumber>;

  getClaimedTokenFeeRewards(account: string): Promise<BigNumber>;

  isDecentralizedState(): Promise<boolean>;

  isUserWhitelisted(address: string): Promise<boolean>;

  usersWrapperWhitelist(address: string): Promise<boolean>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
