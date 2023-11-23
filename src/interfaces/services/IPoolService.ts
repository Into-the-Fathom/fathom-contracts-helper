import { DefaultProvider } from '../../types';

export default interface IPoolService {
  provider: DefaultProvider;
  chainId: number;

  getUserTokenBalance(address: string, forAddress: string): Promise<number>;

  getTokenDecimals(forAddress: string): Promise<number>;

  getDexPrice(forAddress: string): Promise<number>;

  getCollateralTokenAddress(forAddress: string): Promise<string>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
