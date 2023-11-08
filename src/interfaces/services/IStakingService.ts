import Xdc3 from 'xdc3';

export default interface IStakingService {
  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
  ): Promise<number | Error>;

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
  ): Promise<number | Error>;

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
  ): Promise<number | Error>;

  handleClaimRewards(
    account: string,
    streamId: number,
  ): Promise<number | Error>;

  handleWithdrawAll(account: string, streamId: number): Promise<number | Error>;

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
  ): Promise<number | Error>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
  ): Promise<boolean>;

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
  ): Promise<number>;

  getPairPrice(token0: string, token1: string): Promise<number>;

  getStreamClaimableAmount(account: string): Promise<number>;

  getMinLockPeriod(): Promise<number>;

  setChainId(chainId: number): void;

  setProvider(provider: Xdc3): void;
}
