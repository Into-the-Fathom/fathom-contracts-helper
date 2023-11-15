import Xdc3 from 'xdc3';
import { TransactionReceipt } from 'xdc3-eth';
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
  TransactionStatus,
  TransactionType,
} from '../interfaces/models/ITransaction';
import ICollateralPool from '../interfaces/models/ICollateralPool';
import IPositionService from '../interfaces/services/IPositionService';
import { xdcPayV1EventHandler } from '../utils/xdcPayV1EventHandler';

export default class PositionService implements IPositionService {
  public provider: Xdc3;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    this.emitter = new EventEmitter<string | symbol, ITransaction>();
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
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider,
        );

        const encodedResult = this.provider.eth.abi.encodeParameters(
          ['address'],
          [address],
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId,
        ).abi.filter(abi => abi.name === 'openLockXDCAndDraw')[0];

        const openPositionCall = this.provider.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            SmartContractFactory.StabilityFeeCollector(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            pool.id,
            this.provider.utils.toWei(fathomToken.toString(), 'ether'),
            encodedResult,
          ],
        );

        const options = {
          from: address,
          gas: 0,
          value: this.provider.utils.toWei(collateral.toString(), 'ether'),
        };

        const gas = await getEstimateGas(
          wallet,
          'execute',
          [openPositionCall],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          wallet,
          resolve,
          this.emitter,
          TransactionType.OpenPosition,
        );

        wallet.methods
          .execute(openPositionCall)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.OpenPosition,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.OpenPosition,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.OpenPosition,
              error,
            });
            reject(error);
          });
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
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider,
        );

        const encodedResult = this.provider.eth.abi.encodeParameters(
          ['address'],
          [address],
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId,
        ).abi.filter(abi => abi.name === 'lockXDCAndDraw')[0];

        const topUpPositionCall = this.provider.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            SmartContractFactory.StabilityFeeCollector(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            positionId,
            fathomToken
              ? this.provider.utils.toWei(fathomToken.toString(), 'ether')
              : '0',
            encodedResult,
          ],
        );

        const options = {
          from: address,
          gas: 0,
          value: collateral
            ? this.provider.utils.toWei(collateral, 'ether')
            : 0,
        };
        const gas = await getEstimateGas(
          wallet,
          'execute',
          [topUpPositionCall],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          wallet,
          resolve,
          this.emitter,
          TransactionType.TopUpPositionAndBorrow,
        );

        wallet.methods
          .execute(topUpPositionCall)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.TopUpPositionAndBorrow,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.TopUpPositionAndBorrow,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.TopUpPositionAndBorrow,
              error,
            });
            reject(error);
          });
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
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider,
        );

        const encodedResult = this.provider.eth.abi.encodeParameters(
          ['address'],
          [address],
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId,
        ).abi.filter(abi => abi.name === 'lockXDC')[0];

        const topUpPositionCall = this.provider.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            pool.tokenAdapterAddress,
            positionId,
            encodedResult,
          ],
        );

        const options = {
          from: address,
          gas: 0,
          value: collateral
            ? this.provider.utils.toWei(collateral.toString(), 'ether')
            : '0',
        };

        const gas = await getEstimateGas(
          wallet,
          'execute',
          [topUpPositionCall],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          wallet,
          resolve,
          this.emitter,
          TransactionType.TopUpPosition,
        );

        wallet.methods
          .execute(topUpPositionCall)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.TopUpPosition,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.TopUpPosition,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.TopUpPosition,
              error,
            });
            reject(error);
          });
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
      this.provider,
    );

    await proxyWalletRegistry.methods.build(address).send({ from: address });

    const proxyWallet = await proxyWalletRegistry.methods
      .proxies(address)
      .call();

    return proxyWallet;
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
        const proxyWalletAddress = await this.proxyWalletExist(address);

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider,
        );

        const encodedResult = this.provider.eth.abi.encodeParameters(
          ['address'],
          [address],
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId,
        ).abi.filter(abi => abi.name === 'wipeAllAndUnlockXDC')[0];

        const wipeAllAndUnlockTokenCall =
          this.provider.eth.abi.encodeFunctionCall(jsonInterface, [
            SmartContractFactory.PositionManager(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            positionId,
            collateral,
            encodedResult,
          ]);

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          wallet,
          'execute',
          [wipeAllAndUnlockTokenCall],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          wallet,
          resolve,
          this.emitter,
          TransactionType.RepayPosition,
        );

        wallet.methods
          .execute(wipeAllAndUnlockTokenCall)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.RepayPosition,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.RepayPosition,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.RepayPosition,
              error,
            });
            reject(error);
          });
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
        const proxyWalletAddress = await this.proxyWalletExist(address);

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.provider,
        );

        const encodedResult = this.provider.eth.abi.encodeParameters(
          ['address'],
          [address],
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId,
        ).abi.filter(abi => abi.name === 'wipeAndUnlockXDC')[0];

        const wipeAndUnlockTokenCall = this.provider.eth.abi.encodeFunctionCall(
          jsonInterface,
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

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          wallet,
          'execute',
          [wipeAndUnlockTokenCall],
          options,
        );
        options.gas = gas;

        xdcPayV1EventHandler(
          wallet,
          resolve,
          this.emitter,
          TransactionType.RepayPosition,
        );

        wallet.methods
          .execute(wipeAndUnlockTokenCall)
          .send({ from: address })
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.RepayPosition,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.RepayPosition,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.RepayPosition,
              error,
            });
            reject(error);
          });
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
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        const ERC20 = Web3Utils.getContractInstance(
          SmartContractFactory.ERC20(tokenAddress),
          this.provider,
        );

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          ERC20,
          'approve',
          [proxyWalletAddress, MAX_UINT256],
          options,
        );
        options.gas = gas;

        xdcPayV1EventHandler(
          ERC20,
          resolve,
          this.emitter,
          TransactionType.Approve,
        );

        ERC20.methods
          .approve(proxyWalletAddress, MAX_UINT256)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
            });
          })
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
    const proxyWalletAddress = await this.proxyWalletExist(address);

    if (proxyWalletAddress === ZERO_ADDRESS) {
      return false;
    }

    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(tokenAddress),
      this.provider,
    );

    const allowance = await ERC20.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return BigNumber(allowance).isGreaterThanOrEqualTo(
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
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        const fathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          this.provider,
        );

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          fathomStableCoin,
          'approve',
          [proxyWalletAddress, MAX_UINT256],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          fathomStableCoin,
          resolve,
          this.emitter,
          TransactionType.Approve,
        );

        fathomStableCoin.methods
          .approve(proxyWalletAddress, MAX_UINT256)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
            });
          })
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

  /**
   * Check is proxy wallet exists for provided wallet address.
   * @param address - wallet address
   */
  proxyWalletExist(address: string) {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.provider,
    );

    return proxyWalletRegistry.methods.proxies(address).call();
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

    return fathomStableCoin.methods.balanceOf(address).call();
  }

  /**
   * Check is approved stable coin is equal or greater than amount
   * @param amount - amount which should be approved
   * @param address - wallet address
   */
  async approvalStatusStableCoin(
    amount: number,
    address: string,
  ) {
    const proxyWalletAddress = await this.proxyWalletExist(address);

    if (proxyWalletAddress === ZERO_ADDRESS) {
      return false;
    }

    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.provider,
    );

    const [allowance, decimals] = await Promise.all([
      fathomStableCoin.methods.allowance(address, proxyWalletAddress).call(),
      fathomStableCoin.methods.decimals().call(),
    ]);

    return BigNumber(allowance)
      .dividedBy(10 ** decimals)
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

    const debtAccumulatedRate = await poolConfigContract.methods
      .getDebtAccumulatedRate(poolId)
      .call();

    const debtShareValue = BigNumber(debtShare)
      .multipliedBy(WeiPerWad)
      .integerValue(BigNumber.ROUND_CEIL);

    const debtValue =
      BigNumber(debtAccumulatedRate).multipliedBy(debtShareValue);

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

    const debtCeiling = await poolConfigContract.methods
      .getPositionDebtCeiling(poolId)
      .call();

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

    return proxyWalletRegistry.methods.isDecentralizedMode().call();
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

    return proxyWalletRegistry.methods.whitelisted(address).call();
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
