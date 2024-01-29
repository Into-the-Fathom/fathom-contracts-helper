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
    symbol: string;
    name: string;
  };
  shareToken: {
    symbol: string;
    name: string;
  };
}

export interface IVaultStrategyReport {
  totalFees: string;
  protocolFees: string;
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
  };
  reports: IVaultStrategyReport[];
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
}
