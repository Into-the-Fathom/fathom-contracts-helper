import EventEmitter from 'eventemitter3';
import BigNumber from 'bignumber.js';
import { TransactionStatus, TransactionType, } from '../interfaces/models/ITransaction';
import { MAX_UINT256 } from '../utils/Constants';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';
import { xdcPayV1EventHandler } from "../utils/xdcPayV1EventHandler";
const DAY_SECONDS = 24 * 60 * 60;
export default class StakingService {
    constructor(provider, chainId) {
        this.provider = provider;
        this.chainId = chainId;
        this.emitter = new EventEmitter();
    }
    createLock(account, stakePosition, unlockPeriod) {
        return new Promise(async (resolve, reject) => {
            try {
                const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
                const endTime = unlockPeriod * DAY_SECONDS;
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(Staking, 'createLock', [
                    this.provider.utils.toWei(stakePosition.toString(), 'ether'),
                    endTime,
                ], options);
                options.gas = gas;
                xdcPayV1EventHandler(Staking, resolve, this.emitter, TransactionType.CreateLock);
                Staking.methods
                    .createLock(this.provider.utils.toWei(stakePosition.toString(), 'ether'), endTime)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.CreateLock,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.CreateLock,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.CreateLock,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.CreateLock,
                    error,
                });
                reject(error);
            }
        });
    }
    handleUnlock(account, lockId, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(Staking, 'unlockPartially', [lockId, this.provider.utils.toWei(amount.toString(), 'ether')], options);
                options.gas = gas;
                xdcPayV1EventHandler(Staking, resolve, this.emitter, TransactionType.HandleUnlock);
                Staking.methods
                    .unlockPartially(lockId, this.provider.utils.toWei(amount.toString(), 'ether'))
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.HandleUnlock,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.HandleUnlock,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.HandleUnlock,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.HandleUnlock,
                    error,
                });
                reject(error);
            }
        });
    }
    handleEarlyWithdrawal(account, lockId) {
        return new Promise(async (resolve, reject) => {
            try {
                const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(Staking, 'earlyUnlock', [lockId], options);
                options.gas = gas;
                xdcPayV1EventHandler(Staking, resolve, this.emitter, TransactionType.HandleEarlyWithdrawal);
                return Staking.methods
                    .earlyUnlock(lockId)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.HandleEarlyWithdrawal,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.HandleEarlyWithdrawal,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.HandleEarlyWithdrawal,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.HandleEarlyWithdrawal,
                    error,
                });
                reject(error);
            }
        });
    }
    handleClaimRewards(account, streamId) {
        return new Promise(async (resolve, reject) => {
            try {
                const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(Staking, 'claimAllLockRewardsForStream', [streamId], options);
                options.gas = gas;
                xdcPayV1EventHandler(Staking, resolve, this.emitter, TransactionType.HandleClaimRewards);
                Staking.methods
                    .claimAllLockRewardsForStream(streamId)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.HandleClaimRewards,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.HandleClaimRewards,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.HandleClaimRewards,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.HandleClaimRewards,
                    error,
                });
                reject(error);
            }
        });
    }
    handleWithdrawAll(account, streamId) {
        return new Promise(async (resolve, reject) => {
            try {
                const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
                /**
                 * For FTHM stream is 0
                 */
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(Staking, 'withdrawStream', [streamId], options);
                options.gas = gas;
                xdcPayV1EventHandler(Staking, resolve, this.emitter, TransactionType.HandleWithdrawAll);
                Staking.methods
                    .withdrawStream(streamId)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.HandleWithdrawAll,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.HandleWithdrawAll,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.HandleWithdrawAll,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.HandleWithdrawAll,
                    error,
                });
                reject(error);
            }
        });
    }
    approveStakingFTHM(account, fthmTokenAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                const FTHMToken = Web3Utils.getContractInstance(SmartContractFactory.MainToken(fthmTokenAddress), this.provider);
                const StakingAddress = SmartContractFactory.Staking(this.chainId).address;
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(FTHMToken, 'approve', [StakingAddress, MAX_UINT256], options);
                options.gas = gas;
                xdcPayV1EventHandler(FTHMToken, resolve, this.emitter, TransactionType.Approve);
                FTHMToken.methods
                    .approve(StakingAddress, MAX_UINT256)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.Approve,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.Approve,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.Approve,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.Approve,
                    error,
                });
                reject(error);
            }
        });
    }
    async approvalStatusStakingFTHM(address, stakingPosition, fthmTokenAddress) {
        const FTHMToken = Web3Utils.getContractInstance(SmartContractFactory.MainToken(fthmTokenAddress), this.provider);
        const StakingAddress = SmartContractFactory.Staking(this.chainId).address;
        const allowance = await FTHMToken.methods
            .allowance(address, StakingAddress)
            .call();
        return BigNumber(allowance).isGreaterThanOrEqualTo(this.provider.utils.toWei(stakingPosition.toString(), 'ether'));
    }
    getStreamClaimableAmountPerLock(streamId, account, lockId) {
        const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
        return Staking.methods
            .getStreamClaimableAmountPerLock(streamId, account, lockId)
            .call();
    }
    getStreamClaimableAmount(account) {
        const StakingGetter = Web3Utils.getContractInstance(SmartContractFactory.StakingGetter(this.chainId), this.provider);
        return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
    }
    getMinLockPeriod() {
        const Staking = Web3Utils.getContractInstance(SmartContractFactory.Staking(this.chainId), this.provider);
        return Staking.methods.minLockPeriod().call();
    }
    getPairPrice(token0, token1) {
        const DexPriceOracle = Web3Utils.getContractInstance(SmartContractFactory.DexPriceOracle(this.chainId), this.provider);
        return DexPriceOracle.methods.getPrice(token0, token1).call();
    }
    setProvider(provider) {
        this.provider = provider;
    }
    setChainId(chainId) {
        this.chainId = chainId;
    }
}
//# sourceMappingURL=StakingService.js.map