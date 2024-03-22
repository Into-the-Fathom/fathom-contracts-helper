import { Web3Utils } from '../utils/Web3Utils';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import IOracleService from '../interfaces/services/IOracleService';

import { DefaultProvider } from '../types';

export default class OracleService implements IOracleService {
  public provider: DefaultProvider;
  public chainId: number;

  constructor(provider: DefaultProvider, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
  }

  /**
   * Get XDC price from Fathom Oracle
   */
  async getXdcPrice() {
    const FathomPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.FathomPriceOracle(this.chainId),
      this.provider,
    );

    try {
      const xdcPrice = await FathomPriceOracle.getPrice();

      return xdcPrice;
    } catch (error: any) {
      console.error(error);
    }
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
