import Xdc3 from 'xdc3';
import { TransactionReceipt } from 'xdc3-eth';
import EventEmitter from 'eventemitter3';
import BigNumber from 'bignumber.js';

import IStakingService from '../interfaces/services/IStakingService';
import {
  ITransaction,
  TransactionType,
} from '../interfaces/models/ITransaction';

import { MAX_UINT256 } from '../utils/Constants';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';
import { xdcPayV1EventHandler } from '../utils/xdcPayV1EventHandler';
import { emitPendingTransaction } from '../utils/emitPendingTransaction';

const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  public provider: Xdc3;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    this.emitter = new EventEmitter<string | symbol, ITransaction>();
  }

  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider,
        );
        const endTime = unlockPeriod * DAY_SECONDS;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          'createLock',
          [
            this.provider.utils.toWei(stakePosition.toString(), 'ether'),
            endTime,
          ],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          Staking,
          resolve,
          reject,
          this.emitter,
          TransactionType.CreateLock,
        );

        Staking.methods
          .createLock(
            this.provider.utils.toWei(stakePosition.toString(), 'ether'),
            endTime,
          )
          .send(options)
          .on('transactionHash', (hash: string) =>
            emitPendingTransaction(
              this.emitter,
              hash,
              TransactionType.CreateLock,
            ),
          )
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.CreateLock,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.CreateLock,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.CreateLock,
          error,
        });
        reject(error);
      }
    });
  }

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          'unlockPartially',
          [lockId, this.provider.utils.toWei(amount.toString(), 'ether')],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          Staking,
          resolve,
          reject,
          this.emitter,
          TransactionType.HandleUnlock,
        );

        Staking.methods
          .unlockPartially(
            lockId,
            this.provider.utils.toWei(amount.toString(), 'ether'),
          )
          .send(options)
          .on('transactionHash', (hash: string) =>
            emitPendingTransaction(
              this.emitter,
              hash,
              TransactionType.HandleUnlock,
            ),
          )
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.HandleUnlock,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.HandleUnlock,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.HandleUnlock,
          error,
        });
        reject(error);
      }
    });
  }

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          'earlyUnlock',
          [lockId],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          Staking,
          resolve,
          reject,
          this.emitter,
          TransactionType.HandleEarlyWithdrawal,
        );

        return Staking.methods
          .earlyUnlock(lockId)
          .send(options)
          .on('transactionHash', (hash: string) =>
            emitPendingTransaction(
              this.emitter,
              hash,
              TransactionType.HandleEarlyWithdrawal,
            ),
          )
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.HandleEarlyWithdrawal,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.HandleEarlyWithdrawal,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.HandleEarlyWithdrawal,
          error,
        });
        reject(error);
      }
    });
  }

  handleClaimRewards(
    account: string,
    streamId: number,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          'claimAllLockRewardsForStream',
          [streamId],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          Staking,
          resolve,
          reject,
          this.emitter,
          TransactionType.HandleClaimRewards,
        );

        Staking.methods
          .claimAllLockRewardsForStream(streamId)
          .send(options)
          .on('transactionHash', (hash: string) =>
            emitPendingTransaction(
              this.emitter,
              hash,
              TransactionType.HandleClaimRewards,
            ),
          )
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.HandleClaimRewards,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.HandleClaimRewards,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.HandleClaimRewards,
          error,
        });
        reject(error);
      }
    });
  }

  handleWithdrawAll(
    account: string,
    streamId: number,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider,
        );

        /**
         * For FTHM stream is 0
         */
        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          'withdrawStream',
          [streamId],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          Staking,
          resolve,
          reject,
          this.emitter,
          TransactionType.HandleWithdrawAll,
        );

        Staking.methods
          .withdrawStream(streamId)
          .send(options)
          .on('transactionHash', (hash: string) =>
            emitPendingTransaction(
              this.emitter,
              hash,
              TransactionType.HandleWithdrawAll,
            ),
          )
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.HandleWithdrawAll,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.HandleWithdrawAll,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.HandleWithdrawAll,
          error,
        });
        reject(error);
      }
    });
  }

  approveStakingFTHM(
    account: string,
    fthmTokenAddress: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FTHMToken = Web3Utils.getContractInstance(
          SmartContractFactory.MainToken(fthmTokenAddress),
          this.provider,
        );

        const StakingAddress = SmartContractFactory.Staking(
          this.chainId,
        ).address;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FTHMToken,
          'approve',
          [StakingAddress, MAX_UINT256],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          FTHMToken,
          resolve,
          reject,
          this.emitter,
          TransactionType.Approve,
        );

        FTHMToken.methods
          .approve(StakingAddress, MAX_UINT256)
          .send(options)
          .on('transactionHash', (hash: string) =>
            emitPendingTransaction(this.emitter, hash, TransactionType.Approve),
          )
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.Approve,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.Approve,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.Approve,
          error,
        });
        reject(error);
      }
    });
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
  ) {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      this.provider,
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.methods
      .allowance(address, StakingAddress)
      .call();

    return BigNumber(allowance).isGreaterThanOrEqualTo(
      this.provider.utils.toWei(stakingPosition.toString(), 'ether'),
    );
  }

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
  ) {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.provider,
    );
    return Staking.methods
      .getStreamClaimableAmountPerLock(streamId, account, lockId)
      .call();
  }

  getStreamClaimableAmount(account: string) {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      this.provider,
    );
    return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
  }

  getMinLockPeriod() {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.provider,
    );
    return Staking.methods.minLockPeriod().call();
  }

  getPairPrice(token0: string, token1: string) {
    const DexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      this.provider,
    );
    return DexPriceOracle.methods.getPrice(token0, token1).call();
  }
  /**
   * Set Xdc3 provider for service
   * @param provider - Xdc3 provider
   */
  setProvider(provider: Xdc3) {
    this.provider = provider;
  }
  /**
   * Set chainId
   * @param chainId
   */
  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
