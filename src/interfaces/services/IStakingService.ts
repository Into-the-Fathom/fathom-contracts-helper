import EventEmitter from 'eventemitter3';
import { DefaultProvider } from '../../types';
import { BigNumber } from 'fathom-ethers';

export default interface IStakingService {
  emitter: EventEmitter;
  provider: DefaultProvider;
  chainId: number;

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
    stakingPosition: string,
    fthmTokenAddress: string,
  ): Promise<boolean>;

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
  ): Promise<BigNumber>;

  getPairPrice(token0: string, token1: string): Promise<BigNumber[]>;

  getStreamClaimableAmount(account: string): Promise<BigNumber>;

  getMinLockPeriod(): Promise<BigNumber>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
