export enum TransactionType {
  OpenPosition = 'OpenPosition',
  TopUpPosition = 'TopUpPosition',
  TopUpPositionAndBorrow = 'TopUpPositionAndBorrow',
  RepayPosition = 'RepayPosition',
  Approve = 'Approve',
  CreateProxyWallet = 'CreateProxyWallet',

  CreateProposal = 'CreateProposal',
  ExecuteProposal = 'ExecuteProposal',
  QueueProposal = 'QueueProposal',
  CastVote = 'CastVote',

  SwapTokenToStableCoin = 'SwapTokenToStableCoin',
  SwapStableCoinToToken = 'SwapStableCoinToToken',
  AddLiquidity = 'AddLiquidity',
  RemoveLiquidity = 'RemoveLiquidity',
  ClaimFeesRewards = 'ClaimFeesRewards',
  WithdrawClaimedFees = 'WithdrawClaimedFees',

  CreateLock = 'CreateLock',
  HandleUnlock = 'HandleUnlock',
  HandleEarlyWithdrawal = 'HandleEarlyWithdrawal',
  HandleClaimRewards = 'HandleClaimRewards',
  HandleWithdrawAll = 'HandleWithdrawAll',

  OpenVaultDeposit = 'OpenVaultDeposit',
}

export enum TransactionStatus {
  None,
  Success,
  Error,
}

export interface ITransaction {
  hash: string;
  type: TransactionType;
  active: boolean;
  status: TransactionStatus;
  title: string;
  message: string;
  tokenName?: string;
}
