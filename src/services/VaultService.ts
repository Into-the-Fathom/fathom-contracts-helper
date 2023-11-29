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
import { MAX_UINT256, WeiPerWad, ZERO_ADDRESS } from '../utils/Constants';
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
   */
  deposit(amount: string, account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomVault = Web3Utils.getContractInstance(
          SmartContractFactory.FathomVault(this.chainId),
          this.provider.getSigner(),
          'signer',
        );

        console.log('Contract: ', FathomVault);

        const receiver = FathomVault.address;
        const assets = utils.parseEther(amount);
        console.log('Address: ', receiver, assets);

        const options = {
          from: account,
          gasLimit: 0,
        };
        const gasLimit = await getEstimateGas(
          FathomVault,
          'deposit',
          [assets, receiver],
          options,
        );

        options.gasLimit = gasLimit;

        console.log('gasLimit: ', gasLimit);

        const transaction = await FathomVault.deposit(
          assets,
          receiver,
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
   * Return proxy wallet for provided wallet address.
   * @param address - wallet address
   */
  getProxyWallet(address: string) {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.provider,
    );

    return proxyWalletRegistry.proxies(address);
  }

  /**
   * Create proxy wallet for provided wallet address.
   * @param address - wallet address.
   */
  async createProxyWallet(address: string) {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.provider.getSigner(),
      'signer',
    );

    const transaction = await proxyWalletRegistry.build(address);

    emitPendingTransaction(
      this.emitter,
      transaction.hash,
      TransactionType.CreateProxyWallet,
    );

    const receipt = await transaction.wait();

    this.emitter.emit('successTransaction', {
      type: TransactionType.CreateProxyWallet,
      receipt,
    });

    return proxyWalletRegistry.proxies(address);
  }

  /**
   * Approve ERC20 token.
   * @param address - wallet address
   * @param tokenAddress - ERC20 token to approve.
   */
  approve(address: string, tokenAddress: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.getProxyWallet(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        const ERC20 = Web3Utils.getContractInstance(
          SmartContractFactory.ERC20(tokenAddress),
          this.provider.getSigner(),
          'signer',
        );

        const options = { from: address, gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          ERC20,
          'approve',
          [proxyWalletAddress, MAX_UINT256],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await ERC20.approve(
          proxyWalletAddress,
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
   * @param tokenAddress - ERC20 token address.
   * @param deposit - amount of deposit for check.
   */
  async approvalStatus(address: string, tokenAddress: string, deposit: string) {
    const proxyWalletAddress = await this.getProxyWallet(address);

    if (proxyWalletAddress === ZERO_ADDRESS) {
      return false;
    }

    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(tokenAddress),
      this.provider,
    );

    const allowance = await ERC20.allowance(address, proxyWalletAddress);

    console.log(1, BigNumber(allowance.toString()));
    console.log(2, WeiPerWad.multipliedBy(deposit));
    console.log(
      'Allow: ',
      BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
        WeiPerWad.multipliedBy(deposit),
      ),
    );

    return BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
      WeiPerWad.multipliedBy(deposit),
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
