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
      'provider',
      'erc20',
    );

    return ERC20.balanceOf(address);
  }

  /**
   * Retrieves the total supply of an ERC20 token.
   * This method queries the ERC20 contract to obtain the total supply of the token.
   *
   * @param forAddress - The address of the ERC20 token contract.
   * @returns A promise that resolves to a string representing the total supply of the token.
   */
  getTotalSupply(forAddress: string) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(forAddress),
      this.provider,
    );

    return ERC20.totalSupply();
  }

  /**
   * Retrieves the symbol of an ERC20 token.
   * This method queries the ERC20 contract to obtain the token symbol.
   *
   * @param forAddress - The address of the ERC20 token contract.
   * @returns A promise that resolves to a string representing the symbol of the token.
   */
  getTokenSymbol(forAddress: string) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(forAddress),
      this.provider,
    );

    return ERC20.symbol();
  }

  /**
   * Retrieves the number of decimals used by an ERC20 token.
   * This method queries the ERC20 contract to obtain the decimals value, which indicates the token's precision.
   *
   * @param forAddress - The address of the ERC20 token contract.
   * @returns A promise that resolves to a number representing the decimals used by the token.
   */
  getTokenDecimals(forAddress: string) {
    const ERC20 = Web3Utils.getContractInstance(
      SmartContractFactory.ERC20(forAddress),
      this.provider,
    );

    return ERC20.decimals();
  }

  /**
   * Returns the USDT price for a provided ERC20 token address.
   * This method uses a DEX pair to determine the price.
   *
   * @param forAddress - The address of the ERC20 token.
   * @returns A promise that resolves to a string representing the price of the token in USDT.
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
   * Returns the collateral token address for a given ERC20 token address.
   * This method queries the Collateral Token Adapter contract to obtain the collateral token address.
   *
   * @param forAddress - The address of the ERC20 borrow token.
   * @returns A promise that resolves to a string representing the collateral token address.
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
