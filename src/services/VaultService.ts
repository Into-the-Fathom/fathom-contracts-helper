import EventEmitter from 'eventemitter3';
import { utils } from 'fathom-ethers';
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
import { MAX_UINT256 } from '../utils/Constants';
import BigNumber from 'bignumber.js';
import { getErrorTextFromError, TxAction } from '../utils/errorHandler';

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

    const previewAmountShare = await FathomVault.previewDeposit(parsedAmount);

    return previewAmountShare.toString();
  }

  /**
   * Get amount tokens by amount of share token in position.
   * @param shareAmount - The amount of share token.
   * @param vaultAddress - Vault contract address.
   */
  async previewRedeem(shareAmount: string, vaultAddress: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
      'provider',
      'fathomVault',
    );

    const parsedAmount = utils.parseEther(shareAmount);

    const previewAmountShare = await FathomVault.previewRedeem(parsedAmount);

    return previewAmountShare.toString();
  }

  /**
   * Get the amount of burnt share tokens by the amount of the asset to be withdrawn
   * @param amount - The amount of asset to be withdrawn.
   * @param vaultAddress - Vault contract address.
   */
  async previewWithdraw(amount: string, vaultAddress: string) {
    const FathomVault = Web3Utils.getContractInstance(
      SmartContractFactory.FathomVault(vaultAddress),
      this.provider,
    );

    const parsedAmount = utils.parseEther(amount);

    const previewAmountShare = await FathomVault.previewWithdraw(parsedAmount);

    return previewAmountShare.toString();
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
