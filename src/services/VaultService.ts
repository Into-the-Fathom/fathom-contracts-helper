import EventEmitter from 'eventemitter3';
import { utils } from 'ethers';
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
