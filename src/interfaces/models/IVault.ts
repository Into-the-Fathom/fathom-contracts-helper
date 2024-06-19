import { VaultType } from 'src/utils/Constants';

export interface IVaultPosition {
  id: string;
  balancePosition: string;
  balanceProfit: string;
  balanceShares: string;
  balanceTokens: string;
  vault: {
    id: string;
  };
  token: {
    id: string;
    symbol: string;
    name: string;
  };
  shareToken: {
    id: string;
    symbol: string;
    name: string;
  };
}

export interface IVaultStrategyReport {
  timestamp: string;
  gain: string;
  loss: string;
  currentDebt: string;
}

export interface IVaultStrategy {
  id: string;
  delegatedAssets: string;
  currentDebt: string;
  maxDebt: string;
  apr: string;
  historicalApr: {
    id: string;
    apr: string;
    timestamp: string;
  }[];
  reports: IVaultStrategyReport[];
  isShutdown?: boolean;
}

export interface IAccountVaultPosition {
  id: string;
  balancePosition: string;
  balanceProfit: string;
  balanceShares: string;
  balanceTokens: string;
  vault: {
    id: string;
  };
  token: {
    id: string;
    symbol: string;
    name: string;
  };
  shareToken: {
    id: string;
    symbol: string;
    name: string;
  };
}

export interface IVault {
  id: string;
  token: {
    id: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  shareToken: {
    id: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  sharesSupply: string;
  balanceTokens: string;
  balanceTokensIdle: string;
  depositLimit: string;
  apr: string;
  strategies: IVaultStrategy[];
  activationBlockNumber?: string;
  shutdown: boolean;
  type: VaultType;
}
