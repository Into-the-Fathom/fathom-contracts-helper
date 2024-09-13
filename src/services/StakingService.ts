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
import { emitPendingTransaction } from '../utils/emitPendingTransaction';
import { DefaultProvider } from '../types';
import { utils } from 'fathom-ethers';
import { getErrorTextFromError, TxAction } from '../utils/errorHandler';

const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  public provider: DefaultProvider;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: DefaultProvider, chainId: number) {
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
          this.provider.getSigner(account),
          'signer',
        );

        const endTime = unlockPeriod * DAY_SECONDS;

        const formattedPosition = BigNumber(stakePosition.toString())
          .precision(18, BigNumber.ROUND_DOWN)
          .toString();

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          Staking,
          'createLock',
          [utils.parseEther(formattedPosition), endTime],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await Staking.createLock(
          utils.parseEther(formattedPosition),
          endTime,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.CreateLock,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.CreateLock,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.CreateLock,
          error: parsedError,
        });
        reject(error);
      }
    });
  }

  handleUnlock(account: string, lockId: number): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          Staking,
          'unlock',
          [lockId],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await Staking.unlock(lockId, options);

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.StakingUnlock,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.StakingUnlock,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.StakingUnlock,
          error: parsedError,
        });
        reject(error);
      }
    });
  }

  handlePartiallyUnlock(
    account: string,
    lockId: number,
    amount: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const formattedWithdrawAmount = BigNumber(amount)
          .precision(18, BigNumber.ROUND_DOWN)
          .toString();

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          Staking,
          'unlockPartially',
          [lockId, utils.parseEther(formattedWithdrawAmount)],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await Staking.unlockPartially(
          lockId,
          utils.parseEther(formattedWithdrawAmount),
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.StakingUnlock,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.StakingUnlock,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.StakingUnlock,
          error: parsedError,
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
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          Staking,
          'earlyUnlock',
          [lockId],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await Staking.earlyUnlock(lockId, options);

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.StakingEarlyWithdrawal,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.StakingEarlyWithdrawal,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.StakingEarlyWithdrawal,
          error: parsedError,
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
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          Staking,
          'claimAllLockRewardsForStream',
          [streamId],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await Staking.claimAllLockRewardsForStream(
          streamId,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.StakingClaimRewards,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.StakingClaimRewards,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.StakingClaimRewards,
          error: parsedError,
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
          this.provider.getSigner(account),
          'signer',
        );

        /**
         * For FTHM stream is 0
         */
        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          Staking,
          'withdrawStream',
          [streamId],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await Staking.withdrawStream(streamId, options);

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.StakingWithdrawAll,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.StakingWithdrawAll,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.StakingWithdrawAll,
          error: parsedError,
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
          SmartContractFactory.FTHMTokenAddress(fthmTokenAddress),
          this.provider.getSigner(account),
          'signer',
        );

        const StakingAddress = SmartContractFactory.Staking(
          this.chainId,
        ).address;

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          FTHMToken,
          'approve',
          [StakingAddress, MAX_UINT256],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await FTHMToken.approve(
          StakingAddress,
          MAX_UINT256,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.Approve,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.Approve,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.APPROVAL);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.Approve,
          error: parsedError,
        });
        reject(error);
      }
    });
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: string,
    fthmTokenAddress: string,
  ) {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.FTHMTokenAddress(fthmTokenAddress),
      this.provider,
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.allowance(address, StakingAddress);

    return BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
      utils.parseEther(stakingPosition).toString(),
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
    return Staking.getStreamClaimableAmountPerLock(streamId, account, lockId);
  }

  getStreamClaimableAmount(account: string) {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      this.provider,
    );
    return StakingGetter.getStreamClaimableAmount(0, account);
  }

  getMinLockPeriod() {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.provider,
    );
    return Staking.minLockPeriod();
  }

  getPairPrice(token0: string, token1: string) {
    const DexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      this.provider,
    );
    return DexPriceOracle.getPrice(token0, token1);
  }

  getMaxLockPositions() {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.provider,
    );
    return Staking.maxLockPositions();
  }
  /**
   * Set JsonRpcProvider provider for service
   * @param provider - JsonRpcProvider provider
   */
  setProvider(provider: DefaultProvider) {
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
