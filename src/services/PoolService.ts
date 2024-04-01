import IPoolService from '../interfaces/services/IPoolService';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { DefaultProvider } from '../types';

export default class PoolService implements IPoolService {
  public provider: DefaultProvider;
  public chainId: number;

  constructor(provider: DefaultProvider, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
  }

  /**
   * Return balance for wallet in ERC20 token.
   * Use ERC20 Interface
   * @param address - wallet address
   * @param forAddress - ERC20 token address
   */
  getUserTokenBalance(address: string, forAddress: string) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(forAddress),
      this.provider,
    );

    return ERC20.balanceOf(address);
  }

  getTokenSymbol(forAddress: string) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(forAddress),
      this.provider,
    );

    return ERC20.symbol();
  }

  /**
   * Helper function which return decimals for provided ERC20 token address.
   * Use ERC20 Interface.
   * @param forAddress
   */
  getTokenDecimals(forAddress: string) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(forAddress),
      this.provider,
    );

    return ERC20.decimals();
  }

  /**
   * Return usdt price for provided ERC20 token address.
   * Use DEX pair for it.
   * @param forAddress
   */
  async getDexPrice(forAddress: string) {
    const USStable = SmartContractFactory.USDT(this.chainId).address;

    const dexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      this.provider,
    );

    const result = await dexPriceOracle.getPrice(USStable, forAddress);

    return result[0];
  }
  /**
   * Return collateral token address for given ERC20 token address
   * @param forAddress - ERC20 borrow token address.
   */
  getCollateralTokenAddress(forAddress: string) {
    const abi = SmartContractFactory.CollateralTokenAdapterAbi();

    const collateralTokenAdapter = Web3Utils.getContractInstance(
      {
        address: forAddress,
        abi,
      },
      this.provider,
    );

    return collateralTokenAdapter.collateralToken();
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
