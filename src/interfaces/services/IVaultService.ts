import EventEmitter from 'eventemitter3';
import { DefaultProvider } from '../../types';

export default interface IVaultService {
  emitter: EventEmitter;
  provider: DefaultProvider;
  chainId: number;

  deposit(
    amount: string,
    account: string,
    vaultAddress: string,
  ): Promise<number | Error>;

  approve(
    address: string,
    tokenAddress: string,
    vaultAddress: string,
  ): Promise<number | Error>;

  approvalStatus(
    address: string,
    tokenAddress: string,
    vaultAddress: string,
    collateral: string,
  ): Promise<boolean>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
