import Xdc3 from 'xdc3';
import { TransactionReceipt } from 'xdc3-eth';
import { keccak256 } from 'xdc3-utils';
import EventEmitter from 'eventemitter3';

import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';

import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from '../interfaces/models/ITransaction';
import IProposalService from '../interfaces/services/IProposalService';
import { xdcPayV1EventHandler } from '../utils/xdcPayV1EventHandler';

export default class ProposalService implements IProposalService {
  public provider: Xdc3;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    this.emitter = new EventEmitter<string | symbol, ITransaction>();
  }

  /**
   * Create actionable proposal on DAO.
   * @param targets - array of contract addresses for execute proposal actions.
   * @param values - array of value which will pass to each target transaction.
   * @param callData - calldata for each target transaction.
   * @param description - description of proposal.
   * @param account - wallet address which create proposal.
   */
  createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FathomGovernor,
          'propose',
          [targets, values, callData, description],
          options,
        );

        options.gas = gas;
        xdcPayV1EventHandler(
          FathomGovernor,
          resolve,
          reject,
          this.emitter,
          TransactionType.CreateProposal,
        );

        FathomGovernor.methods
          .propose(targets, values, callData, description)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.CreateProposal,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.CreateProposal,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.CreateProposal,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.CreateLock,
          error,
        });
        reject(error);
      }
    });
  }

  /**
   * Execute proposal.
   * @param targets - array of contract addresses for execute proposal actions.
   * @param values - array of value which will pass to each target transaction.
   * @param callData - calldata for each target transaction.
   * @param description - description of proposal.
   * @param account - wallet address which execute proposal.
   */
  executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FathomGovernor,
          'execute',
          [targets, values, callData, keccak256(description)],
          options,
        );

        options.gas = gas;
        xdcPayV1EventHandler(
          FathomGovernor,
          resolve,
          reject,
          this.emitter,
          TransactionType.ExecuteProposal,
        );

        return FathomGovernor.methods
          .execute(targets, values, callData, keccak256(description))
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.ExecuteProposal,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.ExecuteProposal,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.ExecuteProposal,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.ExecuteProposal,
          error,
        });
        reject(error);
      }
    });
  }

  queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FathomGovernor,
          'queue',
          [targets, values, callData, keccak256(description)],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          FathomGovernor,
          resolve,
          reject,
          this.emitter,
          TransactionType.QueueProposal,
        );

        FathomGovernor.methods
          .queue(targets, values, callData, keccak256(description))
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.QueueProposal,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.QueueProposal,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.QueueProposal,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.QueueProposal,
          error,
        });
        reject(error);
      }
    });
  }

  /**
   * Vote for proposal.
   * @param proposalId - proposal id.
   * @param account - wallet address which vote.
   * @param support - 1 is For, 0 is Against, 2 is Abstain.
   */
  castVote(
    proposalId: string,
    account: string,
    support: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider,
        );

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FathomGovernor,
          'castVote',
          [proposalId, support],
          options,
        );
        options.gas = gas;
        xdcPayV1EventHandler(
          FathomGovernor,
          resolve,
          reject,
          this.emitter,
          TransactionType.CastVote,
        );

        return FathomGovernor.methods
          .castVote(proposalId, support)
          .send(options)
          .on('transactionHash', (hash: string) => {
            this.emitter.emit('pendingTransaction', {
              hash: hash,
              type: TransactionType.CastVote,
              active: false,
              status: TransactionStatus.None,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.emitter.emit('successTransaction', {
              type: TransactionType.CastVote,
              receipt,
            });
            resolve(receipt.blockNumber);
          })
          .catch((error: Error) => {
            this.emitter.emit('errorTransaction', {
              type: TransactionType.CastVote,
              error,
            });
            reject(error);
          });
      } catch (error: any) {
        this.emitter.emit('errorTransaction', {
          type: TransactionType.CastVote,
          error,
        });
        reject(error);
      }
    });
  }

  /**
   * Check is wallet account already voted.
   * @param proposalId - proposal id.
   * @param account - wallet account.
   */
  hasVoted(proposalId: string, account: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.provider,
    );
    return FathomGovernor.methods.hasVoted(proposalId, account).call();
  }

  /**
   * Return current state of proposal can be Pending | Open-to-Vote | Canceled | Defeated | Succeeded | Queued | Expired | Executed.
   * @param proposalId - proposal id.
   * @param account - wallet address.
   */
  viewProposalState(proposalId: string, account: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.provider,
    );
    return FathomGovernor.methods.state(proposalId).call({ from: account });
  }

  /**
   * Return timestamp when account can create new proposal.
   * @param account - wallet address.
   */
  nextAcceptableProposalTimestamp(account: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.provider,
    );

    return FathomGovernor.methods
      .nextAcceptableProposalTimestamp(account)
      .call();
  }

  /**
   * Return Voting token balance (vFTHM).
   * @param account - wallet address.
   */
  getVBalance(account: string) {
    const VeFathom = Web3Utils.getContractInstance(
      SmartContractFactory.vFathom(this.chainId),
      this.provider,
    );

    return VeFathom.methods.balanceOf(account).call();
  }

  /**
   * Voting quorum which should be reached. Otherwise, proposal will be Defeated.
   * @param blockNumber. - block number on which proposal was created.
   */
  quorum(blockNumber: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );

    return FathomGovernor.methods.quorum(blockNumber).call();
  }

  /**
   * Return amount of votes. againstVotes, forVotes, abstainVotes.
   * @param proposalId - proposal id.
   */
  proposalVotes(proposalId: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );

    return FathomGovernor.methods.proposalVotes(proposalId).call();
  }

  /**
   * Return minimum vFTHM token balance required for create proposal.
   */
  proposalThreshold() {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );

    return FathomGovernor.methods.proposalThreshold().call();
  }
  /**
   * Set Xdc3 provider for service
   * @param provider - Xdc3 provider
   */
  setProvider(provider: Xdc3) {
    this.provider = provider;
  }
  /**
   * Set chainId
   * @param chainId
   */
  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
