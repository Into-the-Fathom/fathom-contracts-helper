# fathom-sdk

The `fathom-sdk` package offers a set of services which allow to interact with
protocol smart contracts via rpc.

### Installation

Install the package in your project directory with:

```sh
// with npm
npm install fathom-sdk

// with yarn
yarn add fathom-sdk
```

<br />

### Compatibility

This library has a peer dependency of [ethers.js](https://docs.ethers.org/v5/)
JsonRpcProvider.

To install the correct version, run:

```sh
npm install ethers@5.7.2
```

<br />

- a. [PoolService](#pool-service)
  - [getDexPrice](#getDexPrice)
  - [getCollateralTokenAddress](#getCollateralTokenAddress)
- b. [PositionService](#position-service)
  - [openPosition](#openPosition)
  - [topUpPositionAndBorrow](#topUpPositionAndBorrow)
  - [topUpPosition](#topUpPosition)
  - [createProxyWallet](#createProxyWallet)
  - [closePosition](#closePosition)
  - [partiallyClosePosition](#partiallyClosePosition)
  - [approve](#approve)
  - [approvalStatus](#approvalStatus)
  - [approveStableCoin](#approveStableCoin)
  - [getProxyWallet](#getProxyWallet)
  - [balanceStableCoin](#balanceStableCoin)
  - [approvalStatusStableCoin](#approvalStatusStableCoin)
  - [getPositionDebtCeiling](#getPositionDebtCeiling)
  - [isDecentralizedMode](#isDecentralizedMode)
  - [isWhitelisted](#isWhitelisted)
- с. [ProposalService](#proposal-service)
  - [createProposal](#createProposal)
  - [executeProposal](#executeProposal)
  - [queueProposal](#queueProposal)
  - [castVote](#castVote)
  - [hasVoted](#hasVoted)
  - [viewProposalState](#viewProposalState)
  - [nextAcceptableProposalTimestamp](#nextAcceptableProposalTimestamp)
  - [getVBalance](#getVBalance)
  - [quorum](#quorum)
  - [proposalVotes](#proposalVotes)
  - [proposalThreshold](#proposalThreshold)
- d. [StableSwapService](#stable-swap-service)
  - [swapTokenToStableCoin](#swapTokenToStableCoin)
  - [swapStableCoinToToken](#swapStableCoinToToken)
  - [addLiquidity](#addLiquidity)
  - [removeLiquidity](#removeLiquidity)
  - [approveStableCoin](#approveStableCoin)
  - [approveUsdt](#approveUsdt)
  - [claimFeesRewards](#claimFeesRewards)
  - [withdrawClaimedFees](#withdrawClaimedFees)
  - [approvalStatusStableCoin](#approvalStatusStableCoin)
  - [approvalStatusUsdt](#approvalStatusUsdt)
  - [getFeeIn](#getFeeIn)
  - [getFeeOut](#getFeeOut)
  - [getLastUpdate](#getLastUpdate)
  - [getDailySwapLimit](#getDailySwapLimit)
  - [getPoolBalance](#getPoolBalance)
  - [isDecentralizedState](#isDecentralizedState)
  - [isUserWhitelisted](#isUserWhitelisted)
  - [usersWrapperWhitelist](#usersWrapperWhitelist)
  - [getAmounts](#getAmounts)
  - [getTotalValueLocked](#getTotalValueLocked)
  - [getDepositTracker](#getDepositTracker)
  - [getActualLiquidityAvailablePerUser](#getActualLiquidityAvailablePerUser)
  - [getClaimableFeesPerUser](#getClaimableFeesPerUser)
  - [getClaimedFXDFeeRewards](#getClaimedFXDFeeRewards)
  - [getClaimedTokenFeeRewards](#getClaimedTokenFeeRewards)
- e. [StakingService](#staking-service)
  - [createLock](#createLock)
  - [handleUnlock](#handleUnlock)
  - [handleEarlyWithdrawal](#handleEarlyWithdrawal)
  - [handleClaimRewards](#handleClaimRewards)
  - [handleWithdrawAll](#handleWithdrawAll)
  - [approveStakingFTHM](#approveStakingFTHM)
  - [approvalStatusStakingFTHM](#approvalStatusStakingFTHM)
  - [getStreamClaimableAmountPerLock](#getStreamClaimableAmountPerLock)
  - [getStreamClaimableAmount](#getStreamClaimableAmount)
  - [getMinLockPeriod](#getMinLockPeriod)
  - [getPairPrice](#getPairPrice)
- f. [VaultService](#vault-service)
  - [deposit](#deposit)
  - [withdraw](#withdraw)
  - [redeem](#redeem)
  - [approve](#approve)
  - [approvalStatus](#approvalStatus)
  - [previewDeposit](#previewDeposit)
  - [previewWithdraw](#previewWithdraw)
  - [previewRedeem](#previewRedeem)

<br />

### Usage Example

Each Service require <code>provider</code> and <code>chainId</code> in
constructor. Also, when provider or chainId changed need to pass new provider or
chainId to service via <code>setProvider</code> and <code>setChainId</code>

Example of one main service <code>RootService</code>.

```ts
import {
  // Services
  PoolService,
  PositionService,
  ProposalService,
  StableSwapService,
  StakingService,
  VaultService,
  // Interfaces
  IPoolService,
  IPositionService,
  IProposalService,
  IStableSwapService,
  IStakingService,
  IVaultService,
} from 'fathom-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
/**
 * Cache for contract instances.
 */
import { Web3Utils } from 'fathom-sdk';
/**
 * Apothen Testnet, for Mainnet use 50.
 */
const DEFAULT_CHAIN_ID = 51;
/**
 * Read-only mode.
 * Use public RPC for read on-chain data.
 */
const getDefaultProvider = () =>
  new JsonRpcProvider('https://erpc.apothem.network/');

export class RootService {
  /*
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  proposalService: IProposalService;
  stakingService: IStakingService;
  vaultService: IVaultService;

  chainId = DEFAULT_CHAIN_ID;

  provider: JsonRpcProvider;

  serviceList = [
    'poolService',
    'positionService',
    'proposalService',
    'stableSwapService',
    'stakingService',
    'vaultService',
  ];

  constructor() {
    this.provider = getDefaultProvider();

    this.poolService = new PoolService(this.provider, this.chainId);
    this.positionService = new PositionService(this.provider, this.chainId);
    this.proposalService = new ProposalService(this.provider, this.chainId);
    this.stakingService = new StakingService(this.provider, this.chainId);
    this.stableSwapService = new StableSwapService(this.provider, this.chainId);
    this.vaultService = new VaultService(this.provider, this.chainId);
  }

  /**
   * When chain id changed need to call this function.
   * @param chainId
   */
  setChainId(chainId: number) {
    this.chainId = chainId;
    /**
     * Pass chainId to services.
     */
    this.serviceList.forEach(serviceName => {
      this[serviceName].setChainId(chainId);
    });
  }

  /**
   * Provider is JsonRpcProvider provider instance
   * It can be JsonRpcProvider or WebSocketProvider or Web3Provider
   * @param provider
   */
  setProvider(provider: JsonRpcProvider) {
    this.provider = provider;
    /**
     * When change provider need to reset contracts cache.
     */
    Web3Utils.clearContracts();
    /**
     * Pass provider to services.
     */
    this.serviceList.forEach(serviceName => {
      this[serviceName].setProvider(provider);
    });
  }
}
```

Services List:

- PoolService - helper functions for retrieve on-chain data for FXD pools, this
  service has no transaction methods.
- PositionService - all methods for retrieve on-chain data about opened FXD
  positions, and transaction methods for manage positions.
- ProposalService - DAO service for create proposals and vote for them.
- StakingService - DAO service for stake FTHM governance token and get revenue
  also get vFTHM token which allow to create proposal and increase voting power.
- StableSwapService - Swap methods for FXD/xUSDT pair. Available only for
  whitelisted wallets.
- VaultService - Vault service for deposit assets and withdrawal.
