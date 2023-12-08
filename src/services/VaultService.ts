import EventEmitter from 'eventemitter3';
import { utils } from 'ethers';
import BigNumber from 'bignumber.js';
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
          this.provider.getSigner(),
          'signer',
        );

        const parsedAmount = utils.parseEther(amount);

        const options = {
          from: account,
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
        this.emitter.emit('errorTransaction', {
          type: TransactionType.CreateLock,
          error,
        });
        reject(error);
      }
    });
  }

  /**
   * Withdraw from Vault.
   * @param amount - The amount of asset to withdraw.
   * @param receiver - The address to receive the assets.
   * @param owner - The address who's shares are being burnt.
   * @param vaultAddress - ERC20 token address.
   * @param max_loss - Amount of acceptable loss in Basis Points. Optional parameter
   * @param strategies - Array of strategies to withdraw from. If none is passed, it will just use defaultQueue array of strategies. Optional parameter
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
          this.provider.getSigner(),
          'signer',
        );

        const parsedAmount = utils.parseEther(amount);
        const maxLoss = utils.parseEther('0');

        const options = {
          from: owner,
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
        this.emitter.emit('errorTransaction', {
          type: TransactionType.CreateLock,
          error,
        });
        reject(error);
      }
    });
  }

  /**
   * Approve ERC20 token.
   * @param address - wallet address.
   * @param tokenAddress - ERC20 token for deposit.
   * @param vaultAddress - vault address to approve.
   */
  approve(
    address: string,
    tokenAddress: string,
    vaultAddress: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const ERC20 = Web3Utils.getContractInstance(
          SmartContractFactory.ERC20(tokenAddress),
          this.provider.getSigner(),
          'signer',
        );

        const options = { from: address, gasLimit: 0 };
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
        this.emitter.emit('errorTransaction', {
          type: TransactionType.Approve,
          error,
        });
        reject(error);
      }
    });
  }

  /**
   * Check approved deposit token.
   * @param address - wallet address.
   * @param tokenAddress - ERC20 token addres.
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
   * @param vaultAddress - Vault contract adress.
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
   * Get the amount of burnt share tokens by the amount of the asset to be withdrawn
   * @param amount - The amount of asset to be withdrawn.
   * @param vaultAddress - Vault contract adress.
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
