import BigNumber from 'bignumber.js';
import { TransactionType } from '../interfaces/models/ITransaction';

export const XDC_BLOCK_TIME = 2; // 2 seconds
export const ESTIMATE_GAS_MULTIPLIER = 1.2;

export const FXD_MINIMUM_BORROW_AMOUNT = 1;

export const WeiPerWad = new BigNumber('1e18');
export const WeiPerRad = new BigNumber('1e45');
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const MAX_UINT256 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const CHECK_ON_BLOCK_EXPLORER =
  'Click on transaction to view on Block Explorer.';

export const TRANSACTION_PENDING_MESSAGES = {
  [TransactionType.OpenPosition]: 'Opening Position Pending',
  [TransactionType.TopUpPosition]: 'Top Up Position Pending',
  [TransactionType.TopUpPositionAndBorrow]: 'Top Up Position Pending',
  [TransactionType.RepayPosition]: 'Repay Position Pending',
  [TransactionType.Approve]: 'Approval Pending',
  [TransactionType.CreateProposal]: 'Create Proposal Pending',
  [TransactionType.CreateProxyWallet]: 'Create Proxy Wallet Pending.',
  [TransactionType.ExecuteProposal]: 'Execute Proposal Pending',
  [TransactionType.QueueProposal]: 'Queue Proposal Pending',
  [TransactionType.CastVote]: 'Vote Pending',
  [TransactionType.SwapTokenToStableCoin]: '${tokenName} to FXD Swap Pending',
  [TransactionType.SwapStableCoinToToken]: 'FXD to ${tokenName} Swap Pending',
  [TransactionType.AddLiquidity]: 'Add Liquidity to Stable Swap Pending.',
  [TransactionType.RemoveLiquidity]:
    'Remove Liquidity from Stable Swap Pending.',
  [TransactionType.ClaimFeesRewards]: 'Claim Fees Rewards Pending',
  [TransactionType.WithdrawClaimedFees]: 'Withdraw Claimed Fees Pending',
  [TransactionType.CreateLock]: 'Creating Lock Pending',
  [TransactionType.HandleUnlock]: 'Handling Unlock Pending',
  [TransactionType.HandleEarlyWithdrawal]: 'Handling Early Unlock Pending',
  [TransactionType.HandleClaimRewards]: 'Handling Claim Rewards Pending',
  [TransactionType.HandleWithdrawAll]: 'Handling Withdraw Rewards Pending',
  [TransactionType.OpenVaultDeposit]: 'Handling New Deposit Pending',
};

export const TRANSACTION_SUCCESS_MESSAGES = {
  [TransactionType.OpenPosition]: 'New position opened successfully!',
  [TransactionType.TopUpPosition]: 'Top Up position successfully!',
  [TransactionType.TopUpPositionAndBorrow]: 'Top Up position successfully!',
  [TransactionType.RepayPosition]: 'Position repay successfully!',
  [TransactionType.Approve]: 'Token approval was successful!',
  [TransactionType.CreateProxyWallet]: 'Proxy Wallet created successfully!',
  [TransactionType.CreateProposal]: 'Proposal created successfully!',
  [TransactionType.ExecuteProposal]: 'Proposal executed successfully!',
  [TransactionType.QueueProposal]: 'Queue Proposal executed successfully!',
  [TransactionType.CastVote]: 'You have successfully voted!',
  [TransactionType.SwapTokenToStableCoin]:
    '${tokenName} token swapped to FXD successfully!',
  [TransactionType.SwapStableCoinToToken]:
    'FXD token swapped to ${tokenName} successfully!',
  [TransactionType.AddLiquidity]:
    'Successfully added Liquidity to Stable Swap!',
  [TransactionType.RemoveLiquidity]:
    'Successfully removed Liquidity from Stable Swap!',
  [TransactionType.ClaimFeesRewards]: 'Claimed rewards successfully!',
  [TransactionType.WithdrawClaimedFees]:
    'Withdrawal of claim fees was successful!',
  [TransactionType.CreateLock]: 'Lock position created successfully!',
  [TransactionType.HandleUnlock]: 'Position unlock was successful!',
  [TransactionType.HandleEarlyWithdrawal]:
    'Handling Early Unlock was successful!',
  [TransactionType.HandleClaimRewards]: 'Claim Rewards was successful!',
  [TransactionType.HandleWithdrawAll]: 'Withdraw all was successful!',
  [TransactionType.OpenVaultDeposit]: 'Deposit was successful!',
};
