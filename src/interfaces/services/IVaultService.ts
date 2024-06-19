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

  withdraw(
    amount: string,
    receiver: string,
    owner: string,
    vaultAddress: string,
  ): Promise<number | Error>;

  redeem(
    shareAmount: string,
    receiver: string,
    owner: string,
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

  getDepositLimit(
    vaultAddress: string,
    wallet: string,
    isTfType: boolean,
  ): Promise<string>;
  kycPassed(vaultAddress: string, wallet: string): Promise<boolean>;
  getTfVaultDepositEndDate(strategyAddress: string): Promise<string>;
  getTfVaultLockEndDate(strategyAddress: string): Promise<string>;

  previewDeposit(amount: string, vaultAddress: string): Promise<string>;
  previewWithdraw(amount: string, vaultAddress: string): Promise<string>;
  previewRedeem(shareAmount: string, vaultAddress: string): Promise<string>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
