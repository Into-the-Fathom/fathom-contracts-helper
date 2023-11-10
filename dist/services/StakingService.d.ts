import Xdc3 from 'xdc3';
import EventEmitter from 'eventemitter3';
import IStakingService from '../interfaces/services/IStakingService';
export default class StakingService implements IStakingService {
    provider: Xdc3;
    chainId: number;
    emitter: EventEmitter;
    constructor(provider: Xdc3, chainId: number);
    createLock(account: string, stakePosition: number, unlockPeriod: number): Promise<number | Error>;
    handleUnlock(account: string, lockId: number, amount: number): Promise<number | Error>;
    handleEarlyWithdrawal(account: string, lockId: number): Promise<number | Error>;
    handleClaimRewards(account: string, streamId: number): Promise<number | Error>;
    handleWithdrawAll(account: string, streamId: number): Promise<number | Error>;
    approveStakingFTHM(account: string, fthmTokenAddress: string): Promise<number | Error>;
    approvalStatusStakingFTHM(address: string, stakingPosition: number, fthmTokenAddress: string): Promise<boolean>;
    getStreamClaimableAmountPerLock(streamId: number, account: string, lockId: number): any;
    getStreamClaimableAmount(account: string): any;
    getMinLockPeriod(): any;
    getPairPrice(token0: string, token1: string): any;
    setProvider(provider: Xdc3): void;
    setChainId(chainId: number): void;
}
//# sourceMappingURL=StakingService.d.ts.map