import EventEmitter from 'eventemitter3';
import { DefaultProvider } from '../../types';

export default interface IVaultService {
  emitter: EventEmitter;
  provider: DefaultProvider;
  chainId: number;

  deposit(amount: string, account: string): Promise<number | Error>;

  getProxyWallet(address: string): Promise<string>;

  createProxyWallet(address: string): Promise<string>;

  approve(address: string, tokenAddress: string): Promise<number | Error>;

  approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: string,
  ): Promise<boolean>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
