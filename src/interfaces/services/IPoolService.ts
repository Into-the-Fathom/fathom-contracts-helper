import Xdc3 from 'xdc3';

export default interface IPoolService {
  getUserTokenBalance(address: string, forAddress: string): Promise<number>;

  getTokenDecimals(forAddress: string): Promise<number>;

  getDexPrice(forAddress: string): Promise<number>;

  setChainId(chainId: number): void;

  setProvider(provider: Xdc3): void;
}
