import EventEmitter from 'eventemitter3';

import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';

import {
  ITransaction,
  TransactionType,
} from '../interfaces/models/ITransaction';
import IProposalService from '../interfaces/services/IProposalService';
import { emitPendingTransaction } from '../utils/emitPendingTransaction';
import { DefaultProvider } from '../types';
import { utils } from 'ethers';

export default class ProposalService implements IProposalService {
  public provider: DefaultProvider;
  public chainId: number;
  public emitter: EventEmitter;

  constructor(provider: DefaultProvider, chainId: number) {
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
          SmartContractFactory.MainFathomGovernor(this.chainId),
          this.provider.getSigner(),
          'signer',
        );

        const options = { from: account, gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          FathomGovernor,
          'propose',
          [targets, values, callData, description],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await FathomGovernor.propose(
          targets,
          values,
          callData,
          description,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.CreateProposal,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.CreateProposal,
          receipt,
        });
        resolve(receipt.blockNumber);
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
          SmartContractFactory.MainFathomGovernor(this.chainId),
          this.provider.getSigner(),
          'signer',
        );

        const options = { from: account, gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          FathomGovernor,
          'execute',
          [targets, values, callData, utils.keccak256(description)],
          options,
        );

        options.gasLimit = gasLimit;

        const transaction = await FathomGovernor.execute(
          targets,
          values,
          callData,
          utils.keccak256(description),
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.ExecuteProposal,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.ExecuteProposal,
          receipt,
        });
        resolve(receipt.blockNumber);
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
          SmartContractFactory.MainFathomGovernor(this.chainId),
          this.provider.getSigner(),
          'signer',
        );

        const options = { from: account, gasLimit: 0 };

        const gasLimit = await getEstimateGas(
          FathomGovernor,
          'queue',
          [targets, values, callData, utils.keccak256(description)],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await FathomGovernor.queue(
          targets,
          values,
          callData,
          utils.keccak256(description),
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.QueueProposal,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.QueueProposal,
          receipt,
        });
        resolve(receipt.blockNumber);
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
          SmartContractFactory.MainFathomGovernor(this.chainId),
          this.provider.getSigner(),
          'signer',
        );

        const options = { from: account, gasLimit: 0 };
        const gasLimit = await getEstimateGas(
          FathomGovernor,
          'castVote',
          [proposalId, support],
          options,
        );
        options.gasLimit = gasLimit;

        const transaction = await FathomGovernor.castVote(
          proposalId,
          support,
          options,
        );

        emitPendingTransaction(
          this.emitter,
          transaction.hash,
          TransactionType.CastVote,
        );

        const receipt = await transaction.wait();

        this.emitter.emit('successTransaction', {
          type: TransactionType.CastVote,
          receipt,
        });
        resolve(receipt.blockNumber);
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
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );
    return FathomGovernor.hasVoted(proposalId, account);
  }

  /**
   * Return current state of proposal can be Pending | Open-to-Vote | Canceled | Defeated | Succeeded | Queued | Expired | Executed.
   * @param proposalId - proposal id.
   * @param account - wallet address.
   */
  viewProposalState(proposalId: string, account: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );
    return FathomGovernor.state(proposalId, { from: account });
  }

  /**
   * Return timestamp when account can create new proposal.
   * @param account - wallet address.
   */
  nextAcceptableProposalTimestamp(account: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );

    return FathomGovernor.nextAcceptableProposalTimestamp(account);
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

    return VeFathom.balanceOf(account);
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

    return FathomGovernor.quorum(blockNumber);
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

    return FathomGovernor.proposalVotes(proposalId);
  }

  /**
   * Return minimum vFTHM token balance required for create proposal.
   */
  proposalThreshold() {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider,
    );

    return FathomGovernor.proposalThreshold();
  }
  /**
   * Set JsonRpcProvider provider for service
   * @param provider - JsonRpcProvider provider
   */
  setProvider(provider: DefaultProvider) {
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
