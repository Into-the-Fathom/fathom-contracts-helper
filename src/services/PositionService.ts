import BigNumber from 'bignumber.js';
import EventEmitter from 'eventemitter3';

import {
  ZERO_ADDRESS,
  MAX_UINT256,
  WeiPerWad,
  WeiPerRad,
} from '../utils/Constants';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';

import {
  ITransaction,
  TransactionType,
} from '../interfaces/models/ITransaction';
import ICollateralPool from '../interfaces/models/ICollateralPool';
import IPositionService from '../interfaces/services/IPositionService';
import { emitPendingTransaction } from '../utils/emitPendingTransaction';
import { DefaultProvider } from '../types';
import { utils } from 'ethers';

export default class PositionService implements IPositionService {
  public provider: DefaultProvider;
  public chainId: number;
  public emitter: EventEmitter;

  private _abiCoder: utils.AbiCoder;
  private _stableCoinProxyActionInterface: utils.Interface;

  private _stableCoinProxyActionInterfaceMethodNames = [
    'openLockXDCAndDraw',
    'lockXDCAndDraw',
    'lockXDC',
    'wipeAllAndUnlockXDC',
    'wipeAndUnlockXDC',
  ];

  constructor(provider: DefaultProvider, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    this.emitter = new EventEmitter<string | symbol, ITransaction>();

    this._abiCoder = new utils.AbiCoder();

    this._stableCoinProxyActionInterface = new utils.Interface(
      (
        SmartContractFactory.FathomStablecoinProxyAction(this.chainId)
          .abi as ReadonlyArray<{ name: string }>
      ).filter(abi =>
        this._stableCoinProxyActionInterfaceMethodNames.includes(abi.name),
      ),
    );
  }
  /**
   * Create new position, lock collateral in contract and mint FXD stable coin.
   * @param address - wallet address. Create or get proxy wallet for provided address.
   * @param pool - collateral pool model.
   * @param collateral - amount of collateral
   * @param fathomToken - amount for mint FXD stable coin.
   */
  openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    fathomToken: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.getProxyWallet(address);

        console.log({ proxyWalletAddress });

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }
        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider.getSigner(address),
          'signer',
        );

        const encodedResult = this._abiCoder.encode(['address'], [address]);
        const roundedValue = BigNumber(fathomToken).precision(18).toString();

        const openPositionCall =
          this._stableCoinProxyActionInterface.encodeFunctionData(
            'openLockXDCAndDraw',
            [
              SmartContractFactory.PositionManager(this.chainId).address,
              SmartContractFactory.StabilityFeeCollector(this.chainId).address,
              pool.tokenAdapterAddress,
              SmartContractFactory.StablecoinAdapter(this.chainId).address,
              pool.id,
              utils.parseEther(roundedValue),
              encodedResult,
            ],
          );

        const options = {
          gasLimit: 0,
          value: utils.parseEther(collateral),
        };

        const gasLimit = await getEstimateGas(
          wallet,
          'execute',
          [openPositionCall],
          options,
        );

        options.gasLimit = gasLimit;
        const transaction = await wallet.execute(openPositionCall, options);

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.OpenPosition,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.OpenPosition,
          receipt,
        });

        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.OpenPosition,
          error,
        });
        reject(error);
      }
    });
  }
  /**
   * Add extra collateral to existing position or/and mint more FXD stable coin.
   * @param address - wallet address. Create or get proxy wallet for provided address.
   * @param pool - collateral pool model.
   * @param collateral - add extra collateral for existing position.
   * @param fathomToken - mint additional FXD stable coin.
   * @param positionId - existing position id.
   */
  topUpPositionAndBorrow(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    fathomToken: string,
    positionId: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.getProxyWallet(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider.getSigner(address),
          'signer',
        );

        const encodedResult = this._abiCoder.encode(['address'], [address]);

        const topUpPositionCall =
          this._stableCoinProxyActionInterface.encodeFunctionData(
            'lockXDCAndDraw',
            [
              SmartContractFactory.PositionManager(this.chainId).address,
              SmartContractFactory.StabilityFeeCollector(this.chainId).address,
              pool.tokenAdapterAddress,
              SmartContractFactory.StablecoinAdapter(this.chainId).address,
              positionId,
              fathomToken ? utils.parseEther(fathomToken.toString()) : '0',
              encodedResult,
            ],
          );

        const options = {
          gasLimit: 0,
          value: collateral ? utils.parseEther(collateral) : 0,
        };

        const gasLimit = await getEstimateGas(
          wallet,
          'execute',
          [topUpPositionCall],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await wallet.execute(topUpPositionCall, options);
        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.TopUpPositionAndBorrow,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.TopUpPositionAndBorrow,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.TopUpPositionAndBorrow,
          error,
        });
        reject(error);
      }
    });
  }
  /**
   * Add extra collateral to existing position.
   * @param address - wallet address. Create or get proxy wallet for provided address.
   * @param pool - collateral pool model.
   * @param collateral - add extra collateral for existing position without extra mint FXD stable coin.
   * @param positionId - existing position id.
   */
  topUpPosition(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    positionId: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.getProxyWallet(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider.getSigner(address),
          'signer',
        );

        const encodedResult = this._abiCoder.encode(['address'], [address]);

        const topUpPositionCall =
          this._stableCoinProxyActionInterface.encodeFunctionData('lockXDC', [
            SmartContractFactory.PositionManager(this.chainId).address,
            pool.tokenAdapterAddress,
            positionId,
            encodedResult,
          ]);

        const options = {
          gasLimit: 0,
          value: collateral ? utils.parseEther(collateral.toString()) : '0',
        };

        const gasLimit = await getEstimateGas(
          wallet,
          'execute',
          [topUpPositionCall],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await wallet.execute(topUpPositionCall, options);

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.TopUpPosition,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.TopUpPosition,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.TopUpPosition,
          error,
        });
        reject(error);
      }
    });
  }
  /**
   * Create proxy wallet for provided wallet address.
   * @param address - wallet address.
   */
  async createProxyWallet(address: string) {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.provider.getSigner(address),
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
   * Repay full position and unlock all collateral, burn FXD stable coin.
   * @param positionId - existing position id.
   * @param pool - collateral pool model.
   * @param address - wallet address.
   * @param collateral - amount of collateral which will unlock after repay.
   */
  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletAddress = await this.getProxyWallet(address);

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider.getSigner(address),
          'signer',
        );

        const encodedResult = this._abiCoder.encode(['address'], [address]);

        const wipeAllAndUnlockTokenCall =
          this._stableCoinProxyActionInterface.encodeFunctionData(
            'wipeAllAndUnlockXDC',
            [
              SmartContractFactory.PositionManager(this.chainId).address,
              pool.tokenAdapterAddress,
              SmartContractFactory.StablecoinAdapter(this.chainId).address,
              positionId,
              collateral,
              encodedResult,
            ],
          );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          wallet,
          'execute',
          [wipeAllAndUnlockTokenCall],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await wallet.execute(
          wipeAllAndUnlockTokenCall,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.RepayPosition,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.RepayPosition,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.RepayPosition,
          error,
        });
        reject(error);
      }
    });
  }
  /**
   * Partly repay position and unlock collateral, burn FXD stable coin.
   * @param positionId - existing position id.
   * @param pool - collateral pool model.
   * @param address - wallet address.
   * @param stableCoin - amount of FXD stable coin for repay.
   * @param collateral - amount of collateral which will unlock after repay.
   */
  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    stableCoin: string,
    collateral: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletAddress = await this.getProxyWallet(address);

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider.getSigner(address),
          'signer',
        );

        const encodedResult = this._abiCoder.encode(['address'], [address]);

        const wipeAndUnlockTokenCall =
          this._stableCoinProxyActionInterface.encodeFunctionData(
            'wipeAndUnlockXDC',
            [
              SmartContractFactory.PositionManager(this.chainId).address,
              pool.tokenAdapterAddress,
              SmartContractFactory.StablecoinAdapter(this.chainId).address,
              positionId,
              collateral,
              stableCoin,
              encodedResult,
            ],
          );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          wallet,
          'execute',
          [wipeAndUnlockTokenCall],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await wallet.execute(
          wipeAndUnlockTokenCall,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.RepayPosition,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.RepayPosition,
          receipt,
        });
        resolve(receipt.blockNumber);
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.RepayPosition,
          error,
        });
        reject(error);
      }
    });
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
          this.provider.getSigner(address),
          'signer',
        );

        const options = { gasLimit: 0 };
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
   * Check approved collateral token.
   * @param address - wallet address.
   * @param tokenAddress - ERC20 token address.
   * @param collateral - amount of collateral for check.
   */
  async approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: string,
  ) {
    const proxyWalletAddress = await this.getProxyWallet(address);

    if (proxyWalletAddress === ZERO_ADDRESS) {
      return false;
    }

    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(tokenAddress),
      this.provider,
    );

    const allowance = await ERC20.allowance(address, proxyWalletAddress);

    return BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
      WeiPerWad.multipliedBy(collateral),
    );
  }

  /**
   * Check approved FXD stable coin for wallet address.
   * @param address - wallet address.
   */
  approveStableCoin(address: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.getProxyWallet(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        const fathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          this.provider.getSigner(address),
          'signer',
        );

        const options = { gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          fathomStableCoin,
          'approve',
          [proxyWalletAddress, MAX_UINT256],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await fathomStableCoin.approve(
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
   * Return balance of FXD stable coin for provided wallet address.
   * @param address - wallet address.
   */
  balanceStableCoin(address: string) {
    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.provider,
    );

    return fathomStableCoin.balanceOf(address);
  }

  /**
   * Check is approved stable coin is equal or greater than amount
   * @param amount - amount which should be approved
   * @param address - wallet address
   */
  async approvalStatusStableCoin(amount: string, address: string) {
    const proxyWalletAddress = await this.getProxyWallet(address);

    if (proxyWalletAddress === ZERO_ADDRESS) {
      return false;
    }

    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.provider,
    );

    const [allowance, decimals] = await Promise.all([
      fathomStableCoin.allowance(address, proxyWalletAddress),
      fathomStableCoin.decimals(),
    ]);

    return BigNumber(allowance.toString())
      .dividedBy(BigNumber(10).exponentiatedBy(decimals.toString()))
      .isGreaterThanOrEqualTo(amount);
  }

  /**
   * Get debtValue = debtShare * debtAccumulatedRate.
   * @param debtShare - debt share amount.
   * @param poolId - protocol pool id.
   */
  async getDebtValue(debtShare: number, poolId: string) {
    const poolConfigContract = Web3Utils.getContractInstance(
      SmartContractFactory.PoolConfig(this.chainId),
      this.provider,
    );

    const debtAccumulatedRate = await poolConfigContract.getDebtAccumulatedRate(
      poolId,
    );

    const debtShareValue = BigNumber(debtShare)
      .multipliedBy(WeiPerWad)
      .integerValue(BigNumber.ROUND_CEIL);

    const debtValue = BigNumber(debtAccumulatedRate.toString()).multipliedBy(
      debtShareValue,
    );

    return debtValue.dividedBy(WeiPerRad).decimalPlaces(18).toString();
  }

  /**
   * Return max borrow amount available for pool.
   * @param poolId - protocol pool id.
   */
  async getPositionDebtCeiling(poolId: string) {
    const poolConfigContract = Web3Utils.getContractInstance(
      SmartContractFactory.PoolConfig(this.chainId),
      this.provider,
    );

    const debtCeiling = await poolConfigContract.getPositionDebtCeiling(poolId);

    return BigNumber(debtCeiling)
      .dividedBy(WeiPerRad)
      .integerValue()
      .toString();
  }

  /**
   * Is Decentralized mode enabled
   * @return boolean;
   */
  isDecentralizedMode() {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.provider,
    );

    return proxyWalletRegistry.isDecentralizedMode();
  }

  /**
   * Check is wallet address whitelisted.
   * @param address - wallet address.
   */
  isWhitelisted(address: string) {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.provider,
    );

    return proxyWalletRegistry.whitelisted(address);
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
