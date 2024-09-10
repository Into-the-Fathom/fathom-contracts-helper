import { DefaultProvider } from '../../types';
import { BigNumber } from 'fathom-ethers';

export default interface IPoolService {
  provider: DefaultProvider;
  chainId: number;

  getUserTokenBalance(address: string, forAddress: string): Promise<BigNumber>;

  getTokenDecimals(forAddress: string): Promise<BigNumber>;

  getTokenSymbol(forAddress: string): Promise<string>;

  getTotalSupply(forAddress: string): Promise<string>;

  getDexPrice(forAddress: string): Promise<BigNumber>;

  getCollateralTokenAddress(forAddress: string): Promise<string>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
