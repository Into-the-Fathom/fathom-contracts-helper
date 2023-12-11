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
  totalDebtAmount: string;
  depositLimit: string;
  strategies: [
    {
      reports: [
        {
          totalFees: string;
          protocolFees: string;
          results: [
            {
              apr: string;
            },
          ];
        },
      ];
    },
  ];
}
