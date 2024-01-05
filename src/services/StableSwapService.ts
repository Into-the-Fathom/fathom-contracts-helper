import EventEmitter from 'eventemitter3';
import BigNumber from 'bignumber.js';
import { BigNumber as eBigNumber } from 'fathom-ethers';

import { MAX_UINT256 } from '../utils/Constants';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';

import { getEstimateGas } from '../utils/getEstimateGas';

import {
  ITransaction,
  TransactionType,
} from '../interfaces/models/ITransaction';
import IStableSwapService from '../interfaces/services/IStableSwapService';
import { emitPendingTransaction } from '../utils/emitPendingTransaction';
import { DefaultProvider } from '../types';
import { utils } from 'fathom-ethers';

export default class StableSwapService implements IStableSwapService {
  public provider: DefaultProvider;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: DefaultProvider, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    this.emitter = new EventEmitter<string | symbol, ITransaction>();
  }

  swapTokenToStableCoin(
    account: string,
    tokenIn: string,
    tokenInDecimals: string,
    tokenName: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModule = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModule(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );
        const options = { gasLimit: 0 };

        const formattedTokenAmount = BigNumber(tokenIn)
          .multipliedBy(BigNumber(10).exponentiatedBy(tokenInDecimals))
          .integerValue(BigNumber.ROUND_DOWN)
          .precision(18);

        const roundedValue = eBigNumber.from(formattedTokenAmount.toString());

        const gasLimit = await getEstimateGas(
          StableSwapModule,
          'swapTokenToStablecoin',
          [account, roundedValue],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await StableSwapModule.swapTokenToStablecoin(
          account,
          roundedValue,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.SwapTokenToStableCoin,
          tokenName,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.SwapTokenToStableCoin,
          receipt,
          tokenName,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.SwapTokenToStableCoin,
          error,
          tokenName,
        });
        reject(error);
      }
    });
  }

  swapStableCoinToToken(
    account: string,
    tokenOut: string,
    tokenName: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModule = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModule(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const roundedTokenAmount = BigNumber(tokenOut)
          .precision(18, BigNumber.ROUND_DOWN)
          .toString();
        const formattedTokenAmount = utils.parseEther(roundedTokenAmount);

        const gasLimit = await getEstimateGas(
          StableSwapModule,
          'swapStablecoinToToken',
          [account, formattedTokenAmount],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await StableSwapModule.swapStablecoinToToken(
          account,
          formattedTokenAmount,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.SwapStableCoinToToken,
          tokenName,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.SwapStableCoinToToken,
          receipt,
          tokenName,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.SwapStableCoinToToken,
          error,
          tokenName,
        });
        reject(error);
      }
    });
  }

  addLiquidity(amount: string, account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );
        const options = { gasLimit: 0 };

        const formattedTokenAmount = utils.parseEther(amount);

        const gasLimit = await getEstimateGas(
          StableSwapModuleWrapper,
          'depositTokens',
          [formattedTokenAmount],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await StableSwapModuleWrapper.depositTokens(
          formattedTokenAmount,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.AddLiquidity,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.AddLiquidity,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.AddLiquidity,
          error,
        });
        reject(error);
      }
    });
  }

  removeLiquidity(amount: string, account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };

        const formattedTokenAmount = utils.parseEther(amount);

        const gasLimit = await getEstimateGas(
          StableSwapModuleWrapper,
          'withdrawTokens',
          [formattedTokenAmount],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await StableSwapModuleWrapper.withdrawTokens(
          formattedTokenAmount,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.RemoveLiquidity,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.RemoveLiquidity,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.RemoveLiquidity,
          error,
        });
        reject(error);
      }
    });
  }

  approveStableCoin(
    account: string,
    isStableSwapWrapper = false,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const approvalAddress = isStableSwapWrapper
          ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
          : SmartContractFactory.StableSwapModule(this.chainId).address;

        const gasLimit = await getEstimateGas(
          FathomStableCoin,
          'approve',
          [approvalAddress, MAX_UINT256],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await FathomStableCoin.approve(
          approvalAddress,
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
        this.emitter.emit('errorTransaction', {
          type: TransactionType.Approve,
          error,
        });
        reject(error);
      }
    });
  }

  async approveUsdt(
    account: string,
    isStableSwapWrapper = false,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const USStable = Web3Utils.getContractInstance(
          SmartContractFactory.USDT(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const approvalAddress = isStableSwapWrapper
          ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
          : SmartContractFactory.StableSwapModule(this.chainId).address;

        const gasLimit = await getEstimateGas(
          USStable,
          'approve',
          [approvalAddress, MAX_UINT256],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await USStable.approve(
          approvalAddress,
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
        this.emitter.emit('errorTransaction', {
          type: TransactionType.Approve,
          error,
        });
        reject(error);
      }
    });
  }

  claimFeesRewards(account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };

        const gasLimit = await getEstimateGas(
          StableSwapModuleWrapper,
          'claimFeesRewards',
          [],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await StableSwapModuleWrapper.claimFeesRewards(
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.ClaimFeesRewards,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.ClaimFeesRewards,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.ClaimFeesRewards,
          error,
        });
        reject(error);
      }
    });
  }

  withdrawClaimedFees(account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider.getSigner(account),
          'signer',
        );
        const options = { gasLimit: 0 };

        const gasLimit = await getEstimateGas(
          StableSwapModuleWrapper,
          'withdrawClaimedFees',
          [],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await StableSwapModuleWrapper.withdrawClaimedFees(
          options,
        );
        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.WithdrawClaimedFees,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.WithdrawClaimedFees,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.WithdrawClaimedFees,
          error,
        });
        reject(error);
      }
    });
  }

  async approvalStatusStableCoin(
    account: string,
    tokenIn: string,
    tokenInDecimal: string,
    isStableSwapWrapper = false,
  ) {
    const FathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.provider,
    );

    const allowance = await FathomStableCoin.allowance(
      account,
      isStableSwapWrapper
        ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
        : SmartContractFactory.StableSwapModule(this.chainId).address,
    );
    return BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
      BigNumber(10).exponentiatedBy(tokenInDecimal).multipliedBy(tokenIn),
    );
  }

  async approvalStatusUsdt(
    account: string,
    tokenIn: string,
    tokenInDecimal: string,
    isStableSwapWrapper = false,
  ) {
    const USStable = Web3Utils.getContractInstance(
      SmartContractFactory.USDT(this.chainId),
      this.provider,
    );

    const allowance = await USStable.allowance(
      account,
      isStableSwapWrapper
        ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
        : SmartContractFactory.StableSwapModule(this.chainId).address,
    );

    return BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
      BigNumber(10).exponentiatedBy(tokenInDecimal).multipliedBy(tokenIn),
    );
  }

  getFeeIn() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );

    return StableSwapModule.feeIn();
  }

  getFeeOut() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.feeOut();
  }

  getLastUpdate() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.lastUpdate();
  }

  getDailySwapLimit() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.remainingDailySwapAmount();
  }

  getTotalValueDeposited() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.totalValueDeposited();
  }

  getSingleSwapLimitNumerator() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.singleSwapLimitNumerator();
  }

  getSingleSwapLimitDenominator() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.SINGLE_SWAP_LIMIT_DENOMINATOR();
  }

  getPoolBalance(tokenAddress: string) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );

    return StableSwapModule.tokenBalance(tokenAddress);
  }

  isDecentralizedState() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.isDecentralizedState();
  }

  isUserWhitelisted(address: string) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.isUserWhitelisted(address);
  }

  usersWrapperWhitelist(address: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );
    return StableSwapModuleWrapper.usersWhitelist(address);
  }

  getAmounts(amount: string, account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );

    const roundedAmount = BigNumber(amount).precision(18).toString();
    const formattedTokenAmount = utils.parseEther(roundedAmount);

    return StableSwapModuleWrapper.getAmounts(formattedTokenAmount, {
      from: account,
    });
  }

  getTotalValueLocked() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider,
    );
    return StableSwapModule.totalValueLocked();
  }

  getDepositTracker(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );
    return StableSwapModuleWrapper.depositTracker(account);
  }

  getActualLiquidityAvailablePerUser(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );
    return StableSwapModuleWrapper.getActualLiquidityAvailablePerUser(account);
  }

  getClaimableFeesPerUser(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );
    return StableSwapModuleWrapper.getClaimableFeesPerUser(account);
  }

  getClaimedFXDFeeRewards(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );
    return StableSwapModuleWrapper.claimedFXDFeeRewards(account);
  }

  getClaimedTokenFeeRewards(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider,
    );
    return StableSwapModuleWrapper.claimedTokenFeeRewards(account);
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
