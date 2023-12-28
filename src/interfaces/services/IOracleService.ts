import { BigNumber } from 'fathom-ethers';
import { DefaultProvider } from '../../types';

export default interface IOracleService {
  provider: DefaultProvider;
  chainId: number;

  getXdcPrice(): Promise<BigNumber[]>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
