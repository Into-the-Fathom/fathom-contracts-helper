export default interface IVault {
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
}
