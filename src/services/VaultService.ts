import EventEmitter from 'eventemitter3';
import { ContractInterface, utils } from 'fathom-ethers';
import IVaultService from '../interfaces/services/IVaultService';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { emitPendingTransaction } from '../utils/emitPendingTransaction';
import {
  ITransaction,
  TransactionType,
} from '../interfaces/models/ITransaction';
import { DefaultProvider } from '../types';
import { MAX_UINT256, ZERO_ADDRESS } from '../utils/Constants';
import BigNumber from 'bignumber.js';
import { getErrorTextFromError, TxAction } from '../utils/errorHandler';
import DepositLimitModule from '../abis/Vaults/DepositLimitModule.json';
import TradeFlowStrategy from '../abis/Vaults/TradeFiStrategy.json';

export default class VaultService implements IVaultService {
  public provider: DefaultProvider;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: DefaultProvider, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    this.emitter = new EventEmitter<string | symbol, ITransaction>();
  }

  /**
   * Create deposit on Vault.
   * @param amount - The amount of asset to deposit.
   * @param account - The address to receive the assets.
   * @param vaultAddress - ERC20 token address.
   */
  deposit(
    amount: string,
    account: string,
    vaultAddress: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomVault = Web3Utils.getContractInstance(
          SmartContractFactory.FathomVault(vaultAddress),
          this.provider.getSigner(account),
          'signer',
        );

        const parsedAmount = utils.parseEther(amount);

        const options = {
          gasLimit: 0,
        };

        const gasLimit = await getEstimateGas(
          FathomVault,
          'deposit',
          [parsedAmount, account],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await FathomVault.deposit(
          parsedAmount,
          account,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.OpenVaultDeposit,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.OpenVaultDeposit,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.OpenVaultDeposit,
          error: parsedError,
        });
        reject(error);
      }
    });
  }

  /**
   * Withdraw from Vault.
   * @param amount - The amount of asset to withdraw.
   * @param receiver - The address to receive the assets.
   * @param owner - The address who`s shares are being burnt.
   * @param vaultAddress - ERC20 token address.
   */
  withdraw(
    amount: string,
    receiver: string,
    owner: string,
    vaultAddress: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomVault = Web3Utils.getContractInstance(
          SmartContractFactory.FathomVault(vaultAddress),
          this.provider.getSigner(owner),
          'signer',
        );

        const parsedAmount = utils.parseEther(amount);
        const maxLoss = utils.parseEther('0');

        const options = {
          gasLimit: 0,
        };

        const gasLimit = await getEstimateGas(
          FathomVault,
          'withdraw',
          [parsedAmount, receiver, owner.toLowerCase(), maxLoss, []],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await FathomVault.withdraw(
          parsedAmount,
          receiver,
          owner.toLowerCase(),
          maxLoss,
          [],
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.WithdrawVaultDeposit,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.WithdrawVaultDeposit,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.WithdrawVaultDeposit,
          error: parsedError,
        });
        reject(error);
      }
    });
  }

  /**
   * Withdraw from Vault.
   * @param shareAmount - The amount of share Token to withdraw.
   * @param receiver - The address to receive the assets.
   * @param owner - The address who`s shares are being burnt.
   * @param vaultAddress - ERC20 token address.
   */
  redeem(
    shareAmount: string,
    receiver: string,
    owner: string,
    vaultAddress: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomVault = Web3Utils.getContractInstance(
          SmartContractFactory.FathomVault(vaultAddress),
          this.provider.getSigner(owner),
          'signer',
        );

        const parsedAmount = utils.parseEther(shareAmount);
        const maxLoss = utils.parseEther('0');

        const options = {
          gasLimit: 0,
        };

        const gasLimit = await getEstimateGas(
          FathomVault,
          'redeem',
          [parsedAmount, receiver, owner.toLowerCase(), maxLoss, []],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await FathomVault.redeem(
          parsedAmount,
          receiver,
          owner.toLowerCase(),
          maxLoss,
          [],
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.WithdrawVaultDeposit,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.WithdrawVaultDeposit,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION);
        this.emitter.emit('errorTransaction', {
          type: TransactionType.WithdrawVaultDeposit,
          error: parsedError,
        });
        reject(error);
      }
    });
  }

  /**
   * Approve ERC20 token.
   * @param account - wallet address.
   * @param tokenAddress - ERC20 token for deposit.
   * @param vaultAddress - vault address to approve.
   */
  approve(
    account: string,
    tokenAddress: string,
    vaultAddress: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const ERC20 = Web3Utils.getContractInstance(
          SmartContractFactory.ERC20(tokenAddress),
          this.provider.getSigner(account),
          'signer',
        );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          ERC20,
          'approve',
          [vaultAddress, MAX_UINT256],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await ERC20.approve(
          vaultAddress,
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

  /**
   * Check approved deposit token.
   * @param address - wallet address.
   * @param tokenAddress - ERC20 token address.
   * @param vaultAddress - ERC20 token address.
   * @param deposit - amount of deposit for check.
   */
  async approvalStatus(
    address: string,
    tokenAddress: string,
    vaultAddress: string,
    deposit: string,
  ) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(tokenAddress),
      this.provider,
    );

    const allowance = await ERC20.allowance(address, vaultAddress);

    return BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
      utils.parseEther(deposit).toString(),
    );
  }

  /**
   * Get amount share token by amount of asset to deposit.
   * @param amount - The amount of asset to deposit.
   * @param vaultAddress - Vault contract address.
   */
  async previewDeposit(amount: string, vaultAddress: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
    );

    const parsedAmount = utils.parseEther(amount);

    return (await FathomVault.previewDeposit(parsedAmount)).toString();
  }

  /**
   * Calculates the equivalent asset amount for a given amount of share tokens to be redeemed from the vault.
   * This method queries the vault contract to determine the equivalent asset amount that corresponds to the specified share token amount.
   *
   * @param shareAmount - The amount of share tokens to be redeemed, specified in the smallest unit of the token (e.g., wei for ETH).
   * @param vaultAddress - The address of the vault contract from which the redemption will be made.
   * @returns A promise that resolves to a string representing the equivalent asset amount for the specified share token amount.
   */
  async previewRedeem(shareAmount: string, vaultAddress: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
      'provider',
      'fathomVault',
    );

    const parsedAmount = utils.parseEther(shareAmount);

    return (await FathomVault.previewRedeem(parsedAmount)).toString();
  }

  /**
   * Calculates the amount of burnt share tokens based on the amount of the asset to be withdrawn from the vault.
   * This method queries the vault contract to determine how many share tokens would be burnt for a given withdrawal amount.
   *
   * @param amount - The amount of asset to be withdrawn, specified in the smallest unit of the asset (e.g., wei for ETH).
   * @param vaultAddress - The address of the vault contract from which the withdrawal will be made.
   * @returns A promise that resolves to a string representing the amount of burnt share tokens for the specified withdrawal amount.
   */
  async previewWithdraw(amount: string, vaultAddress: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
    );

    const parsedAmount = utils.parseEther(amount);

    return (await FathomVault.previewWithdraw(parsedAmount)).toString();
  }

  /**
   * Retrieves the current deposit limit for a given vault. If the vault is a TradeFlow vault and a wallet address is provided,
   * it queries the deposit limit module of the vault to determine the available deposit limit for that wallet.
   * Otherwise, it returns the general deposit limit for the vault.
   *
   * @param vaultAddress - The address of the vault for which to retrieve the deposit limit.
   * @param isTradeFlowVault - A boolean indicating whether the vault is a TradeFlow vault.
   * @param wallet - Optional. The wallet address to check for an individual deposit limit in a TradeFlow vault.
   * @returns A promise that resolves to a string representing the current deposit limit for the vault or for the individual wallet if specified.
   */
  async getDepositLimit(
    vaultAddress: string,
    isTradeFlowVault: boolean,
    wallet?: string,
  ) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
    );

    if (isTradeFlowVault && wallet) {
      let currentDepositLimit = '0';
      const depositLimitModuleAddress = await FathomVault.depositLimitModule();

      if (depositLimitModuleAddress !== ZERO_ADDRESS) {
        const DepositLimitModuleContract = Web3Utils.getContractInstanceFrom(
          DepositLimitModule.abi as ContractInterface,
          depositLimitModuleAddress,
          this.provider,
          'provider',
          'TradeFiVault',
        );

        currentDepositLimit = (
          await DepositLimitModuleContract.availableDepositLimit(wallet)
        ).toString();
      }

      return currentDepositLimit;
    }

    return (await FathomVault.depositLimit()).toString();
  }

  /**
   * Checks if the KYC (Know Your Customer) process has been passed for a given wallet address in relation to a specific vault.
   * This method queries the deposit limit module of the vault to determine the KYC status.
   *
   * @param vaultAddress - The address of the vault for which to check the KYC status.
   * @param wallet - The wallet address to check for KYC completion.
   * @returns A promise that resolves to a boolean indicating whether the KYC process has been passed for the given wallet.
   */
  async kycPassed(vaultAddress: string, wallet: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
    );

    const depositLimitModuleAddress = await FathomVault.depositLimitModule();

    if (depositLimitModuleAddress !== ZERO_ADDRESS) {
      const DepositLimitContract = Web3Utils.getContractInstanceFrom(
        DepositLimitModule.abi as ContractInterface,
        depositLimitModuleAddress,
        this.provider,
        'provider',
        'TradeFiVault',
      );

      return DepositLimitContract.kycPassed(wallet);
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * Retrieves the end date of the deposit period for a TradeFlow vault.
   * This method queries the TradeFlow strategy contract to obtain the timestamp when the deposit period ends.
   *
   * @param strategyAddress - The address of the TradeFlow strategy contract.
   * @returns A promise that resolves to a string representing the timestamp of the deposit period end date.
   */
  async getTradeFlowVaultDepositEndDate(strategyAddress: string) {
    const Strategy = Web3Utils.getContractInstanceFrom(
      TradeFlowStrategy.abi as ContractInterface,
      strategyAddress,
      this.provider,
      'TradeFiVault',
    );

    return (await Strategy.depositPeriodEnds()).toString();
  }

  /**
   * Retrieves the end date of the lock period for a TradeFlow vault.
   * This method queries the TradeFlow strategy contract to obtain the timestamp when the lock period ends.
   *
   * @param strategyAddress - The address of the TradeFlow strategy contract.
   * @returns A promise that resolves to a string representing the timestamp of the lock period end date.
   */
  async getTradeFlowVaultLockEndDate(strategyAddress: string) {
    const Strategy = Web3Utils.getContractInstanceFrom(
      TradeFlowStrategy.abi as ContractInterface,
      strategyAddress,
      this.provider,
      'TradeFiVault',
    );

    return (await Strategy.lockPeriodEnds()).toString();
  }

  /**
   * Retrieves the minimum deposit amount required for a user to participate in a TradeFlow vault.
   * This method queries the TradeFlow vault contract to obtain the minimum deposit amount.
   *
   * @param vaultAddress - The address of the TradeFlow vault for which to retrieve the minimum deposit amount.
   * @returns A promise that resolves to a string representing the minimum deposit amount required for participation.
   */
  async getMinUserDeposit(vaultAddress: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomTradeFlowVault(vaultAddress),
      this.provider,
      'provider',
      'TradeFiVault',
    );

    return (await FathomVault.minUserDeposit()).toString();
  }

  /**
   * Checks if a given strategy is in shutdown mode.
   * This method queries the strategy contract to determine its shutdown status.
   *
   * @param strategyId - The identifier of the strategy to check.
   * @returns A promise that resolves to a boolean indicating whether the strategy is in shutdown mode.
   */
  isStrategyShutdown(strategyId: string) {
    const FathomStrategy = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVaultStrategy(strategyId),
      this.provider,
      'provider',
      'Strategy',
    );

    return FathomStrategy.isShutdown();
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
